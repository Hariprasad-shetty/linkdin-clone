const express=require("express");
const router=express.Router();
const messageController=require("../controllers/message");
const Authentication=require("../authentication/auth");



router.post("/",Authentication.auth,messageController.sendMessage);
router.get("/:convId",Authentication.auth,messageController.getMessage);

module.exports= router;