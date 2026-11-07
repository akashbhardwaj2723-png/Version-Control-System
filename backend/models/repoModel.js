const mongoose = require("mongoose");

const  {Schema} = mongoose;

const RepositorySchema = new Schema(
  {
     
    userName:{
      type:String,
      required:true,
    
    },
    description:{
      type:String,
    },
    content: [
  {
    type: String
  }
],
visibility: {
  type: Boolean
},
    owner:{
      type:String,
      ref:"User",
      required:true,

    },
    issue:{
      type:Schema.Types.ObjectId,
      ref:"Issue"
    }
  },{timestamps: true},
);
RepositorySchema.index(
  { userName: 1, owner: 1 },
  { unique: true }
);



const Repository = mongoose.model("Repository" , RepositorySchema);

module.exports =  Repository;