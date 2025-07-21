const express=require("express");
const router=express.Router();
const CommentControllers=require("../controllers/comment");
const Authentication=require("../authentication/auth");


router.post("/",Authentication.auth,CommentControllers.commentPost);

router.get("/:postId",CommentControllers.getCommentByPostId);


module.exports= router;