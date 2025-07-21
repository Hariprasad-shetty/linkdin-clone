
const ConversationModel=require("../models/conversation");
const MessageModel=require("../models/message");



exports.addConversation=async(req,res)=>{
  
  try {
    let senderId=req.user._id;
    let {recieverId,message}= req.body;
    let isConvExist= await ConversationModel.findOne({
      members: {$all: [senderId,recieverId]}
    });
    
    if(!isConvExist){
      let newConversation= new ConversationModel({
        members: [senderId,recieverId]
      });
      await newConversation.save();
      let addMessage= new MessageModel({sender: req.user._id,conversation: newConversation,message});
      await addMessage.save();
    }else{
      let addMessage= new MessageModel({sender: req.user._id,conversation: isConvExist._id,message});
      await addMessage.save();
    }
    
    return res.status(200).json({message: "Message sent"});
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "server error",message:error.message});
  }
  
  
}


exports.getConversation=async (req,res)=>{
  
  try {
    
    let loggedInId= req.user._id;
    let conversation= await ConversationModel.find({
      members:{$in: [loggedInId]}
    }).populate("members","-password").sort({createdAt: -1});
    
    return res.status(200).json({
      message: "Fetched successfully",
      conversations: conversation
    })
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "server error",message:error.message});
  }
  
}

