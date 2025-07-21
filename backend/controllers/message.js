const MessageModel= require("../models/message.js");


exports.sendMessage=async(req,res)=>{
  
  try {
    
    let {conversation,message,picture}=req.body;
    let addMessage=new MessageModel({sender: req.user._id,conversation,message,picture}); 
    await addMessage.save();
    
    let populatedMessage=await addMessage.populate("sender");
    
    return res.status(201).json(populatedMessage);
    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "server error",message:error.message});
  }
  
}




exports.getMessage=async(req,res)=>{
  
  try {
    
    let {convId}= req.params;
    let message= await MessageModel.find({
      conversation: convId
    }).populate("sender");
    
    return res.status(200).json({messages: "Fetched message successfully",message})
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "server error",message:error.message});
  }
  
}
