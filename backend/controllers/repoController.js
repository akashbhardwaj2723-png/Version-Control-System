const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createrepository = async (req, res) => {
  const { owner, userName, issue, description, content, visibility } = req.body;

   
  try {
    if (!userName) {
      return res.status(400).json({ error: "Repository name Is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid UserId  " });
    }
    // if(!mongoose.Types.ObjectId.isValid(issue)){
    //  return res.status(400).json({error:"Invalid UserId  "});
    // }

    const newRepository = new Repository({
      userName,
      owner,
      description,
      content,
      visibility,
      issue,
    });
    
    const result = await newRepository.save();
        
    res.status(201).json({
      message: "Repository Created !",
      repositoryId: result._id,
    });
  } catch (err) {
    console.log("Error during repository creation:", err.message);
    res.status(500).send("Srever Error");
  }
};

const getAllRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issue");

    res.send(repositories);
  } catch (err) {
    console.log("Error during fatching repository:", err.message);
    res.status(500).send("Srever Error");
  }
};

const fatchRepositoriesById = async (req, res) => {
  const repoId = req.params.id;

  try {
    const repository = await Repository.find({ _id: repoId })

      .populate("owner")
      .populate("issue");

    res.send(repository);
  } catch (err) {
    console.log("Error during fatching repository By Id:", err.message);
    res.status(500).send("Srever Error");
  }
};

const fatchRepositoriesByName = async (req, res) => {
  const repoName = req.params.name;

  try {
    const repository = await Repository.find({ userName: repoName })
      .populate("owner")
      .populate("issue");

    res.send(repository);
  } catch (err) {
    console.log("Error during fatching repository By Name:", err.message);
    res.status(500).send("Srever Error");
  }
};

const fatchRepositoriesForCurrUser = async (req, res) => {
 const userId = req.params.userId;
 
  try {
    const repository = await Repository.find({ owner: userId });
    console.log("All Repository Data:", repository);
    if (!repository || repository.length == 0) {
      return res.status(404).json({ error: "User repository not found" });
    }
    res.json({ message: "Repository Found", repository });
  } catch (err) {
    console.log("Error during fatching repository By CurrUser:", err.message);
    res.status(500).send("Srever Error");
  }
};

const updateRepositoryById = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;
  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: " repository not found" });
    }

    repository.content.push(content);
    repository.description = description;

    const updateRepository = await repository.save();

    res.json({
      message: "Repository update successfull",
      repository: updateRepository,
    });
  } catch (err) {
    console.log("Error during fatching repository By Update Id:", err.message);
    res.status(500).send("Srever Error");
  }
};

const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: " repository not found" });
    }

    repository.visibility = !repository.visibility;

    const updateRepository = await repository.save();

    res.json({
      message: "Repository  Togggle by id  successfull",
      repository: updateRepository,
    });
  } catch (err) {
    console.log(
      "Error during fatching repository By  toogle id :",
      err.message,
    );
    res.status(500).send("Srever Error");
  }
};
  const deleteRepositoryById = async (req, res) => {
    const { id } = req.params;
    try {
      const repository = await Repository.findByIdAndDelete(id);

      if (!repository) {
        return res.status(404).json({ error: " repository not found" });
      }
      res.json({ message: "Repository deleted successfull" });
    } catch (err) {
      console.log("Error occure In Delete repo By Id :", err.message);
      res.status(500).send("Srever Error");
    }
  };

module.exports = {
  createrepository,
  getAllRepositories,
  fatchRepositoriesById,
  fatchRepositoriesByName,
  fatchRepositoriesForCurrUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
