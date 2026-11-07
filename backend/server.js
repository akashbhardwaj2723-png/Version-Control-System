const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");

const { Server } = require("socket.io");

require("dotenv").config();

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init.js");
const { addRepo } = require("./controllers/add.js");
const { commitReop } = require("./controllers/commit.js");
const { pushReop } = require("./controllers/push.js");
const { pullReop } = require("./controllers/pull.js");
const { revertReop } = require("./controllers/revert.js");
const { Socket } = require("dgram");


const mainRoute = require("./routes/main.router")

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

yargs(hideBin(process.argv))
  .command("start", "Start command", {}, StartServer)
  .command("init", "Initialise a new Repository", {}, initRepo)
  .command(
    "add <file>",
    "Add  a  file to the Repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    },
  )

  .command(
    "commit <message>",
    "Commit the staged file",
    (yargs) => {
      yargs.positional("message", {
        describe: " Commit Message",
        type: "string",
      });
    },
    (argv) => {
      commitReop(argv.message);
    },
  )

  .command("push", "Push commit to S3", {}, pushReop)
  .command("pull", "Pull commit from S3", {}, pullReop)
  .command(
    "revert <commitId>",
    "Revert to a Specific commit",
    (yargs) => {
      yargs.positional("commitId", {
        type: "string",
      });
    },
    (argv) => {
      revertReop(argv.commitId);
    },
  )
  .demand(1, "You Need at least one command")
  .help().argv;

function StartServer() {
  const app = express();
  let Port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongo_Uri = process.env.Mongo_Url;
  mongoose
    .connect(mongo_Uri)
    .then(() => console.log("MongoDb Connacted !"))
    .catch((err) => console.log("MongoDb  ConnectError", err));

  app.use(cors({ origin: "*" }));
  app.use("/",mainRoute);

  const httpsServer = http.createServer(app);
  let user = "test";
  const io = new Server(httpsServer, {
    cors: {
      origin: "*",
      methods: ["get", "post"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join Room", (userId) => {
      user = userId;
      console.log("=====");
      console.log(user);
      console.log("=====");

      socket.join(userId);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUDE Operation Called");
  });

  httpsServer.listen(Port, () => {
    console.log(`Server Is Running Port Number:${Port}`);
  });
}
