const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ReturnDocument } = require("mongodb");

var ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const mongo_Uri = process.env.Mongo_Url;

let client;
async function connectClient() {
  if (!client) {
    client = new MongoClient(mongo_Uri);

    await client.connect();

    console.log("MongoDB Connected!");
  }

  return client;
}

const signUp = async (req, res) => {
  // console.log("Request Body", req.body);

  const { userName, password, email } = req.body;

  try {
    await connectClient();
    const db = client.db("VersionCtrlCulster");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ userName });
    if (user) {
      return res.status(400).json({ message: "User allready exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      userName,
      password: hashedPassword,
      email,
      repositories: [],
      followUsers: [],
      starRepo: [],
    };
    const result = await userCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.AWS_SECRET_ACCESS_KEY,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      userId: result.insertedId,
    });
  } catch (err) {
    console.log("Error during a SignUp", err.message);
    res.status(500).send("Srever Error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("VersionCtrlCulster");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials !" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials !" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.AWS_SECRET_ACCESS_KEY,
      { expiresIn: "7d" },
    );
    res.json({ token, userId: user._id });
  } catch (err) {
    console.log("Login Time Error", err.message);
    res.status(500).send("Server Error!");
  }
};

const getAllUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("VersionCtrlCulster");
    const userCollection = db.collection("users");

    const users = await userCollection.find({}).toArray();
    res.send(users);
  } catch (err) {
    console.log(" Error during fatch!!", err.message);
    res.status(500).send("Server Error!");
  }
};

const getUserProfile = async (req, res) => {
  const currentId = req.params.id;

  try {
    await connectClient();
    const db = client.db("VersionCtrlCulster");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({
      _id: new ObjectId(currentId),
    });

    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    // Send response when user is found
    // const { password, ...userProfile } = user;

    // return res.status(200).json({ user: userProfile });
    res.send(user);
  } catch (err) {
    console.log("Error during Get All Profile:", err.message);
    return res.status(500).send("Server Error!");
  }
};

const updateUserProfile = async (req, res) => {
  const currentId = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("VersionCtrlCulster");
    const userCollection = db.collection("users");

    let updatedFilds = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(String(password), salt);
      updatedFilds.password = hashedPassword;
    }
    const result = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentId),
      },
      { $set: updatedFilds },
      { returnDocument: "after" },
    );

    const updatedUser = result.value ?? result;

    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const { password: hashedPassword, ...userProfile } = updatedUser;

    return res.status(200).json(userProfile);
  } catch (err) {
    console.log("Error during UpdateUser Profile:", err.message);
    return res.status(500).send("Server Error!");
  }
};

const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;
  try {
    await connectClient();
    const db = client.db("VersionCtrlCulster");
    const userCollection = db.collection("users");

    const result = await userCollection.deleteOne({
      _id: new ObjectId(currentId),
    });

    if (result.deleteCount === 0) {
      return res.status(400).json({ message: "User Not Found!" });
    }
    res.json({ message: "User Profile  deleted:" });
  } catch (err) {
    console.log("Error during Update User profile:", err.message);
    return res.status(500).send("Server Error!");
  }
};

module.exports = {
  getAllUsers,
  signUp,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
