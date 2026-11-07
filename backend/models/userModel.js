const  mongoose = require("mongoose");
const { required } = require("yargs");
const {Schema} = mongoose;


const UserSchema = new Schema({

  userName:{
     type:String,
     required:true,
     unique:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:s=String,
  },
  repositiores:[
    {
      default:[],
      type:Schema.Types.ObjectId,
      ref:"Repository",
    },

  ],
  followedUsers:[
    {
      default:[],
      type:Schema.Types.ObjectId,
      ref:"User",
    },
    
  ],
  starRepo:[
    {
      default:[],
      type:Schema.Types.ObjectId,
      ref:"Repository",
    },
    
  ]
},{timestamps: true},
)

const User = mongoose.model("User" , UserSchema);

module.exports = User;