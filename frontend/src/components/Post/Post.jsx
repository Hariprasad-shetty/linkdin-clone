
import {useState,useEffect} from "react"
import Card from "../Card/Card"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import {ToastContainer,toast} from "react-toastify"
import {Link} from "react-router-dom"
import axios from "axios"



const Post=({profile,item,personalData})=>{
  
  const [seeMore,setSeeMore]= useState(false);
  const [comment,setComment]= useState(false);
  const [commentText,setCommentText]= useState("");
  const [comments,setComments]= useState([]);
  const [liked,setLiked]= useState(false);
  const [noOfLike,setNoOfLike]=useState(item?.likes.length);
  let desc=item?.desc;
  
  
  
   const handleSendComment=async (e)=>{
     e.preventDefault();
     if(commentText.trim().length===0)return toast.error("Please enter comment");
     
     await axios.post("http://localhost:3000/api/comment",{postId: item?._id,comment: commentText},{withCredentials: true}).then(res=>{
       
       setComments([res.data.comment,...comments])
       setCommentText("");//change
     }).catch(err=>{
       console.log(err);
     });
     
   }
  
  useEffect(()=>{
    let selfId= personalData?._id;
    item?.likes?.map((item)=>{
      if(item.toString()===selfId.toString()){
        setLiked(true);
        return ;
      }else{
        setLiked(false);
      }
      
      
    })
  },[])
  
  const handleLikeFunc=async()=>{
    await axios.post("http://localhost:3000/api/post/likeDislike",{postId: item?._id},{withCredentials: true}).then(res=>{
      if(liked){
        setNoOfLike(prev=>prev-1);
        setLiked(false);
      }else{
        setNoOfLike(prev=>prev+1);
        setLiked(true);
      }
      
    }).catch(err=>{
      console.log(err);
      alert("Something went wrong");
    });
  }
  
  
  const handleCommentBoxOpenClose=async ()=>{
    setComment(true);
    await axios.get(`http://localhost:3000/api/comment/${item?._id}`).then(res=>{
      setComments(res.data.comments);
      
    }).catch(err=>{
      console.log(err);
      alert("Something went wrong");
    });
    
    
  }
  
  
  const copyToClipboard=async ()=>{
    try {
      let string= `http://localhost:5173/profile/${item?.user?._id}/activities/${item?._id}`;
      await navigator.clipboard.writeText(string);
      toast.success("Copied to clipboard");
      
    } catch (error) {
      console.error(error);
    }
  }
  
  return(
    <Card padding={0}>
      <div className="flex gap-3 p-4">
        
        <Link to={`/profile/${item?.user?._id}`} className="w-12 h-12 rounded-3xl">
          <img className="rounded-3xl w-12 h-12 border-2 border-white cursor-pointer" src={item?.user?.profilePic} />
        </Link>
        <div>
          <div className="text-lg font-semibold">{item?.user?.f_name}</div>
          <div className="text-xs text-gray-500">{item?.user?.headline}</div>
        </div>
      </div>
      
     
       
        <div className="text-lg p-4 my-3 whitespace-pre-line flex grow">
        {seeMore?desc:desc?.length>50?`${desc.slice(0,50)}...`:`${desc}`} {desc?.length<50? null : <span className="text-gray-500 cursor-pointer" onClick={()=>{setSeeMore(prev=>!prev)}}>{seeMore?"See Less":"See More"}</span>}
      </div>
     
      
      {
        item?.imageLink &&
        <div className="w-[100%] h-300px">
        <img className="w-full h-full" src={item?.imageLink} />
      </div>
        
      }
      
      <div className="my-2 p-4 flex justify-between items-center">
        
        <div className="flex gap-1 items-center">
          <ThumbUpIcon sx={{
            color: 'blue',
            fontSize: 12,
          }} /> <div className="text-sm text-gray-600">{noOfLike} Likes</div>
        </div>
        
        <div className="flex gap-1 items-center">
          <div className="text-sm text-gray-600">{item?.comments} Comments</div>
        </div>
        
      </div>
      { !profile &&
      <div className="flex p-1">
        
        <div onClick={handleLikeFunc} className="w-[33%] justify-center flex gap-2 items-center border-r border-gray-100 p-2 cursor-pointer hover:bg-gray-100">
          {liked?<ThumbUpIcon sx={{fontSize:22,color:"blue"}} />:<ThumbUpOutlinedIcon sx={{fontSize: 22, color: "blue"}} />} <span>{liked?"Liked":"Like"}</span>
        </div>
        <div onClick={handleCommentBoxOpenClose} className="w-[33%] justify-center flex gap-2 items-center border-r border-gray-100 p-2 cursor-pointer hover:bg-gray-100">
          <CommentIcon sx={{fontSize:22}} /> <span>Comment</span>
        </div>
        <div onClick={copyToClipboard} className="w-[33%] justify-center flex gap-2 items-center border-r border-gray-100 p-2 cursor-pointer hover:bg-gray-100">
          <SendIcon sx={{fontSize:22}} /> <span>Share</span>
        </div>
        
      </div>
      }
      {/*Comment section*/}
        {comment && 
      <div className="p-4 w-full">
        <div className="flex gap-2 items-center">
          <img className="rounded-full w-12 h-12 border-2 border-white cursor-pointer" src={personalData?.profilePic} />
          <form className="w-full flex gap-2" onSubmit={handleSendComment}>
            <input value={commentText} onChange={(e)=>setCommentText(e.target.value)} type="text" placeholder="Add a Comment" className="w-full border py-3 px-5 rounded-3xl hover:bg-gray-100" />
            <button type="submit" className="bg-blue-800 text-white cursor-pointer rounded-3xl px-3">Send</button>
          </form>
        </div>
        
        
        <div className="w-full p-4">
          {
            comments.map((item,index)=>{
              return(
                <div className="my-4">
                
                
            <Link to={`/profile/${item?.user?._id}`} className="flex gap-3">
              <img src={item?.user?.profilePic} className="rounded-full w-10 h-10 border-2 border-white cursor-pointer" />
              <div className="cursor-pointer">
                <div className="text-lg">{item?.user?.f_name}</div>
                <div className="text-sm text-gray-500">{item?.user?.headline}</div>
              </div>
            </Link>
            
            
            <div className="px-11 my-2">
            {item?.comment}
          </div>
          </div>
          
          
                );
            })
          }
          
        </div>
      </div>
        }
      <ToastContainer />
    </Card>
    )
  
}

export default Post