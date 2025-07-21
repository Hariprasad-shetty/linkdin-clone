
const express=require("express");
const router=express.Router();
const userController=require("../controllers/user")
const Authentication=require("../authentication/auth")


router.post("/register",userController.register);
router.post("/login",userController.login);
router.post("/google",userController.loginThroughGmail);
router.post("/logout",Authentication.auth,userController.logout);
router.post("/sendFriendReq",Authentication.auth,userController.sendFriendRequest);
router.post("/acceptFriendReq",Authentication.auth,userController.acceptFriendRequest);



router.put("/update",Authentication.auth,userController.updateUser);


router.get("/user/:id",userController.getProfileById);
router.get("/friendList",Authentication.auth,userController.getFriendList);
router.get("/pendingFriendList",Authentication.auth,userController.getPendingFriendList);

router.get("/self",Authentication.auth,(req,res)=>{
  return res.status(200).json({
    user: req.user
  })
});

router.get("/findUser",Authentication.auth,userController.findUser);


router.delete("/removeFromFriendList/:friendId",Authentication.auth,userController.removeFromFriend)

module.exports=router;