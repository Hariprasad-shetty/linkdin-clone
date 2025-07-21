
const mongoose=require("mongoose");

const UserSchema= new mongoose.Schema({
  googleId:{
    type: String
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
  },
  f_name:{
    type: String,
    default: ""
  },
  headline:{
    type: String,
    default: ""
  },
  curr_company:{
    type: String,
    default: ""
  },
  curr_location:{
    type: String,
    default: ""
  },
  profilePic:{
    type: String,
    default: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
  },
  cover_pic:{
    type: String,
    default: "https://wallpaperaccess.com/full/6060285.png"
  },
  about:{
    type: String,
    default: ""
  },
  skills:{
    type: [String],
    default: []
  },
  experience:[
    {
      designation:{
        type: String
      },
      company_name:{
        type: String
      },
      duration:{
        type: String
      },
      location:{
        type: String
      }
    }
    ],
    friends:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
      ],
    pending_friends:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
      ],
      resume:{
        type: String
      }
  
},{timestamps:true});

const userModel=mongoose.model("user",UserSchema);

module.exports= userModel;
