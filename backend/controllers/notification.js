const notificationModel= require("../models/notification");


exports.getNotification=async (req,res)=>{
  try {
    let ownId=req.user._id;
    let notifications=await notificationModel.find({reciever: ownId}).sort({createdAt: -1}).populate("sender reciever");
    
    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications: notifications
    })
    
  } catch (error) {
    console.error(error);
    return res.status(400).json({error: "server error",message:error.message});
  }
}

exports.updateRead=async (req,res)=>{
  try {
    const {notificationId}=req.body;
  const notification= await notificationModel.findByIdAndUpdate(notificationId,{isRead: true});
  
  if(!notification){
    return res.status(404).json({
      error: "Notification not found"
    })
  }
  
  return res.status(200).json({
    message: "Read Notification"
  })
  } catch (error) {
    console.error(error);
    return res.status(400).json({error: "server error",message:error.message});
  }
  
  
}


exports.activeNotify=async (req,res)=>{
  try {
    let ownId=req.user._id;
    let notifications= await notificationModel.find({reciever:ownId,isRead:false});
    
    return res.status(200).json({
      message: "Notification fetched successfully",
      count: notifications.length
    })
    
  } catch (error) {
    console.error(error);
    return res.status(400).json({error: "server error",message:error.message});
  }
}