const express=require("express");
const router=express.Router();
const conversationController=require("../controllers/conversation")
const Authentication=require("../authentication/auth")


router.post("/add-conversation",Authentication.auth,conversationController.addConversation);
router.get("/get-conversation",Authentication.auth,conversationController.getConversation);



module.exports= router;