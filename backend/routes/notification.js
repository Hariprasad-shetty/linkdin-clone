const express=require("express");
const router=express.Router();
const NotificationController=require("../controllers/notification");
const Authentication=require("../authentication/auth");

router.get("/",Authentication.auth,NotificationController.getNotification);
router.put("/isRead",Authentication.auth,NotificationController.updateRead);
router.get("/activeNotification",Authentication.auth,NotificationController.activeNotify);


module.exports= router