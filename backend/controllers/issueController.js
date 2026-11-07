const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");



const createIssue = async (req,res)=>{
  const {title , description} = req.body;
  const {id} = req.parmas;

  try {
    const issue = new Issue({
      title,
      description,
      repository:id,
    })
    await issue.save();
    res.status(201).json(issue)

    
  } catch (err) {
    console.log("Error during issue creation:", err.message);
    res.status(500).send("Srever Error");
  }

};

const updateIssueById = async(req ,res)=>{
  const {id} = req.parmas;
  const {title , description,status} = req.body

  try {
    
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(400).json({ error: "Issue Not found" });
    }
    issue.title = title;
    issue.description = description;
    issue.status = status;
     
     await issue.save();
     res.status(200).json({message:"Issue Update Successful" , issue})

  } catch (err) {
    console.log("Error during Issue  Update:", err.message);
    res.status(500).send("Srever Error");
  }
};

const deleteIssueById = async(req,res)=>{
  const {id} = req.parmas;
  try {
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(400).json({ error: "Issue Not Found" });
    }
    res.status(200).json({message:"Delete Issue Successfull"});
  } catch (err) {
    console.log("Error during Issue  Deleted:", err.message);
    res.status(500).send("Srever Error");
  }
}

const getAllIssue = async(req ,res)=>{
   const {id} = req.parmas;

   try {
     const issue = await Issue.findById({repository:id});
     if (!issue) {
      return res.status(400).json({ error: "Issue Not Found" });
    }
    res.status(200).json(issue ,{message:"Geting All Issue"})

   } catch (err) {
    console.log("Error during get All Issue:", err.message);
    res.status(500).send("Srever Error");
  }
}

const getIssueById = async(req ,res)=>{
  const {id} = req.parmas;
  try {
    
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(400).json({ error: "Issue Not found" });
    }
    
     await issue.save();
     res.status(200).json(issue);

  } catch (err) {
    console.log("Error during Issue  geting By Id:", err.message);
    res.status(500).send("Srever Error");
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssue,
  getIssueById

}