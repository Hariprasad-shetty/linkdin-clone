
const PostModel=require("../models/post");


exports.addPost= async (req,res)=>{
 
 try {
   const {desc,imageLink}= req.body;
   let userId= req.user._id;
   
   const addPost= await PostModel({user:userId,desc,imageLink});
   
   if(!addPost){
     return res.status(400).json({error:"Something went wrong"});
   }
   
   await addPost.save();
   return res.status(200).json({
     message: "Post successfully",
     post: addPost
   })
   
 } catch (error) {
   console.error(error);
   res.status(400).json({error:"server error",message: error.message});
 }
  
}


exports.likeDislike=async (req,res)=>{
  try{
    let selfId =req.user._id;
    let {postId} =req.body;
    let post= await PostModel.findById(postId);
    
    if(!post){
      return res.status(400).json({error: "No such post found"});
    }
    
    const index= await post.likes.findIndex(id=>id.equals(selfId));
    
    if(index !== -1){
      post.likes.splice(index,1);
    }
    else{
      post.likes.push(selfId);
    }
    
    await post.save();
    return res.status(200).json({
      message: index!==-1?"Post unliked":"Post liked",
      likes:post.likes
    })
    
    
  }catch (error) {
   console.error(error);
   res.status(400).json({error:"server error",message: error.message});
 }
 
}


exports.getAllPost= async (req,res)=>{
  try {
    let posts= await PostModel.find().sort({createdAt: -1}).populate("user","-password");
    return res.status(200).json({
      message: "Fetched Data",
      posts: posts
    });
    
  } catch (error) {
    console.error(error);
    res.status(400).json({error:"server error",message: error.message});
  }
}


exports.getPostByPostId=async (req,res)=>{
  try {
    const {postId}=req.params;
    const post=await PostModel.findById(postId).populate("user","-password");
    
    if(!post){
      return res.status(400).json({error: "No such post found"});
    }
    
    return res.status(200).json({
      message: "Fetched Data",
      post: post
    })
    
    
  } catch (error) {
    console.error(error);
    res.status(400).json({error:"server error",message: error.message});
  }
}



  
exports.getTop5PostForUser=async(req,res)=>{
  try {
    
    const {userId}=req.params;
    const posts= await PostModel.find({user: userId}).sort({createdAt:-1}).populate("user","-password").limit(5);
    
    return res.status(200).json({
      message: "Fetched Data",
      posts: posts
    })
    
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"server error",message: error.message});
  }
}



exports.getAllPostForUser=async(req,res)=>{
  try {
    const {userId}=req.params;
    const posts= await PostModel.find({user: userId}).sort({createdAt:-1}).populate("user","-password");
    
    return res.status(200).json({
      message: "Fetched Data",
      posts: posts
    })
    
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"server error",message:error.message})
  }
}