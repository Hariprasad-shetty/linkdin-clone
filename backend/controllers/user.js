


const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {OAuth2Client}= require("google-auth-library");
const User=require("../models/user");
const NotificationModel=require("../models/notification")
require("dotenv").config();



const cookieOptions={
  httpOnly:true,
  secure: false,
  sameSite: "Lax"
}


exports.register=async (req,res)=>{
  try {
    let {email,password,f_name}=req.body;
    let isUserExists= await User.findOne({email});
    
    if(isUserExists){
      return res.status(400).json({error: "Already have an account with this email, please try with other email"})
    }
    const hashedPassword=await bcryptjs.hash(password,10);
    const newUser= new User({email,password:hashedPassword,f_name});
    await newUser.save();
    
    return res.status(200).json({message: "User registered successfully",success: "yes",data: newUser})
    
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "server error",message: error.message});
  }
}


exports.login=async (req,res)=>{
  let {email,password}= req.body;
  const userExist= await User.findOne({email});
  
  
  if(userExist && !userExist.password){
    return res.status(400).json({error: "Please login through google"});
  }
  
  
  if(userExist && await bcryptjs.compare(password,userExist.password)){
    let token= jwt.sign({userId:userExist._id},process.env.JWT_PRIVATE_KEY);
    res.cookie("token",token,cookieOptions);
    const userToReturn= await User.findOne({email}).select("-password");
    return res.status(201).json({message: "Login successfully",success: "true",userExist:userToReturn});
  }else{
    return res.status(400).json({error: "Invalid credantials"});
  }
  
  
}

const client= new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.loginThroughGmail= async (req,res)=>{
  try{
    const {token}= req.body;
    const ticket= await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload= ticket.getPayload();
    const {sub,email,name,picture}= payload;
    let userExist= await User.findOne({email}).select("-password");
    
    if(!userExist){
      userExist= await User.create({
        googleId: sub,
        email,
        f_name: name,
        profilePic:picture
      });
    }
    let jwttoken= jwt.sign({userId:userExist._id},process.env.JWT_PRIVATE_KEY);
    res.cookie("token",jwttoken,cookieOptions);
    return res.status(201).json({user:userExist});
    
  }
  catch (error) {
    console.error(error);
    res.send(500).json({error: "server error",message: error.message});
  }
  
  
}


 exports.updateUser= async (req,res)=>{
  
  try{
    const {user}=req.body;
    const isExist= await User.findById(req.user._id);
    
    if(!isExist){
      return res.status(400).json({error: "User doesn't exist"});
    }
    
    const updateData= await User.findByIdAndUpdate(isExist._id,user); 
    
    const userData= await User.findById(req.user._id);
     res.status(200).json({
      message: "User updated successfully",
      user: userData
    })
    
  }
  catch (error) {
    console.error(error);
    res.send(500).json({error: "server error",message: error.message});
  }
  
}


exports.getProfileById=async (req,res)=>{
  try{
    const {id}= req.params;
    const isExist= await User.findById(id);
    
    if(!isExist){
      return res.status(400).json({error: "No such user exist"});
    }
    
    return res.status(200).json({
      message: "User fetched successfully",
      user: isExist
    })
    
  }
  catch (error) {
    console.error(error);
    res.send(500).json({error: "server error",message: error.message});
  }
  
}


exports.logout= async (req,res)=>{
  
  res.clearCookie("token",cookieOptions).json({message: "Logout successfully"});
}


exports.findUser=async(req,res)=>{
  try {
    
    let {query}= req.query;
    const users=await User.find({
      $and:[
        
          {_id:{$ne: req.user._id}},
          {
            $or:[
              {name: {$regex: new RegExp(`^${query}`,"i")}},
              {
                email: {$regex: new RegExp(`^${query}`,"i")}
              }
              ]
          }
        
        ]
    });
    
    return res.status(201).json({
      message: "fetched successfully",
      users: users
    });
    
    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "server error",message:error.message});
  }
  
}


exports.sendFriendRequest=async (req,res)=>{
  
  try {
        const sender = req.user._id;
    const { reciever } = req.body;

    const self = await User.findById(req.user._id);
    const userExist = await User.findById(reciever);

    if (!userExist) {
      return res.status(404).json({ error: "No such user exist" });
    }

    const isAlreadyFriend = self.friends.some(id => id.toString() === reciever);
    if (isAlreadyFriend) {
      return res.status(400).json({ error: "Already friends" });
    }

    const alreadySent = userExist.pending_friends.some(id => id.toString() === sender.toString());
    if (alreadySent) {
      return res.status(400).json({ error: "Already sent request" });
    }

    userExist.pending_friends.push(sender);
    const content = `${self.f_name} has sent you a friend request`;
    const notification = new NotificationModel({ sender, reciever, content, type: "friendRequest" });
    await notification.save();
    await userExist.save();

    return res.status(200).json({ message: "Friend request sent" });

    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "server error",message:error.message});
  }
  
}


exports.acceptFriendRequest=async (req,res)=>{
  
  try {
    const { friendId } = req.body;
    const self = await User.findById(req.user._id);
    const friendData = await User.findById(friendId);

    if (!friendData) {
      return res.status(400).json({ error: "No such user exist" });
    }

    const index = self.pending_friends.findIndex(id => id.toString() === friendId);
    if (index === -1) {
      return res.status(400).json({ error: "No request from such user" });
    }

    self.pending_friends.splice(index, 1);
    self.friends.push(friendId);
    friendData.friends.push(self._id);

    const content = `${self.f_name} has accepted your friend request`;
    const notification = new NotificationModel({ sender: self._id, reciever: friendId, content, type: "friendRequest" });

    await notification.save();
    await friendData.save();
    await self.save();
    return res.status(200).json({ message: "You both are connected now" });

    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "server error",message:error.message});
  }
  
}


exports.getFriendList=async(req,res)=>{
  try {
    
  //  let friendList= await req.user.populate("friends");
    
    let friendList = await User.findById(req.user._id).populate("friends");//change

    return res.status(200).json({
      friends: friendList.friends
    })
    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "server error",message:error.message});
  }
}



exports.getPendingFriendList=async(req,res)=>{
  try {
    
  //  let pendingFriendList= await req.user.populate("pending_friends");
    // let friendList = await User.findById(req.user._id).populate("friends");//change

    // return res.status(200).json({
    //   pendingFriends: pendingFriendList.pending_friends
    // })
    const self = await User.findById(req.user._id).populate("pending_friends");
    return res.status(200).json({
      pendingFriends: self.pending_friends,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "server error",message:error.message});
  }
}



exports.removeFromFriend=async(req,res)=>{
  try {
//     let selfId=req.user._id;
//     const {friendId}= req.params;
    
//     const friendData= await User.findById(friendId);
    
//     const self = await User.findById(req.user._id);
// self.friends.push(friendId);

    
//     if(!friendData){
//       return res.status(400).json({error: "No such user exist"});
//     }
    
//     const index= req.user.friends.findIndex(id=>id.equals(friendId));
//     const friendIndex= friendData.friends.findIndex(id=>id.equals(selfId));
    
//     if(index !== -1){
//       req.user.friends.splice(index,1);
//     }else{
//       return res.status(400).json({error: "No any request from user"});
//     }
    
    
//     if(friendIndex !== -1){
//       friendData.friends.splice(friendIndex,1);
//     }else{
//       return res.status(400).json({error: "No any request from user"});
//     }
    
//     await self.save();
//     await friendData.save();
    
//     return res.status(200).json({
//       message: "You both are disconnected now"
//     });
    
        const selfId = req.user._id;
    const { friendId } = req.params;

    const friendData = await User.findById(friendId);
    const self = await User.findById(selfId);

    if (!friendData) {
      return res.status(400).json({ error: "No such user exist" });
    }

    const index = self.friends.findIndex(id => id.toString() === friendId);
    const friendIndex = friendData.friends.findIndex(id => id.toString() === selfId.toString());

    if (index === -1 || friendIndex === -1) {
      return res.status(400).json({ error: "You are not friends" });
    }

    self.friends.splice(index, 1);
    friendData.friends.splice(friendIndex, 1);

    await self.save();
    await friendData.save();
    
    return res.status(200).json({ message: "You both are disconnected now" });

    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "server error",message:error.message});
  }
}


