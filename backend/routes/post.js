const express=require("express");
const router=express.Router();
const postController=require("../controllers/post")
const Authentication=require("../authentication/auth")


router.post("/",Authentication.auth,postController.addPost);
router.post("/likeDislike",Authentication.auth,postController.likeDislike);

router.get("/getAllPost",postController.getAllPost);
router.get("/getPostById/:postId",postController.getPostByPostId);
router.get("/getTop5Post/:userId",postController.getTop5PostForUser);
router.get("/getAllPostForUser/:userId",postController.getAllPostForUser);




module.exports=router;