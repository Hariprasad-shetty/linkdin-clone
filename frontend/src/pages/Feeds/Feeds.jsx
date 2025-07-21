
import {useState,useEffect} from "react"
import Card from "../../components/Card/Card"
import ProfileCard from "../../components/ProfileCard/ProfileCard"
import Advertisement from "../../components/Advertisement/Advertisement"
import Post from "../../components/Post/Post"
import Modal from "../../components/Modal/Modal"
import AddModal from "../../components/AddModal/AddModal"
import VideoCallIcon from '@mui/icons-material/VideoCall';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ArticleIcon from '@mui/icons-material/Article';
import axios from "axios"
import {ToastContainer,toast} from "react-toastify"


const Feeds=()=>{
  
  const [personalData,setPersonalData]=useState(null);
  const [post,setPost]= useState([]);
  const [addPostModal,setAddPostModal]= useState(false)
  
  const handleOpenPostModel=()=>{
    setAddPostModal(prev=>!prev)
  }
  
  
  const fetchData=async ()=>{
   try {
     const [userData,postData]= await Promise.all([axios.get("http://localhost:3000/api/auth/self",{withCredentials: true}),
    axios.get("http://localhost:3000/api/post/getAllPost")
    ]);
    
    setPersonalData(userData.data.user);
    localStorage.setItem("userInfo",JSON.stringify(userData.data.user));
    setPost(postData.data.posts);
    
    
   } catch (err) {
     console.error(err);
     toast.error(err?.response?.data?.error);
   }
    
  }
  
  useEffect(()=>{
    fetchData();
  },[])
  
  
  return(
    
    <div className="px-5 xl:px-52 py-9 flex gap-5 w-full h-[98vh] mt-5 bg-gray-100">
      {/*left side*/}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5 ">
        <div className="h-fit">
          <ProfileCard data={personalData} />
        </div>
        <div className="w-full my-5">
          <Card padding={1}>
            <div className="w-full flex justify-between">
              <div>Profile viewers</div>
              <div className="text-blue-900">23</div>
            </div>
            <div className="w-full flex justify-between">
              <div>Post impression</div>
              <div className="text-blue-900">90</div>
              </div>
          </Card>
        </div>
        
      </div>
      {/*middle side*/}
      <div className="w-[100%] py-5 sm:w-[50%]">
        
        <div>
          <Card padding={1}>
            <div className="flex gap-2 items-center">
              <img src={personalData?.profilePic} className="rounded-3xl border-2 w-14 h-14 border-white cursor-pointer" />
              <div onClick={()=>setAddPostModal(true)} className="w-full border py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-100">
                Start a post
              </div>
              
            </div>
            <div className="w-full flex mt-5">
              <div onClick={()=>setAddPostModal(true)} className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100"><VideoCallIcon sx={{
                color: 'green',
              }} />Video</div>
              <div onClick={()=>setAddPostModal(true)} className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100"><InsertPhotoIcon sx={{
              color: "blue"
              }} 
              />Image</div>
              <div onClick={()=>setAddPostModal(true)} className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100"><ArticleIcon sx={{
              color:"orange"
              }} />Article</div>
            </div>
          </Card>
        </div>
        
        <div className="border-b border-gray-400 w-[100%] my-5" />
        
        <div className="w-full flex flex-col gap-5">
        
        { post.map((item,index)=>{
          
          return <Post item={item} key={index} personalData={personalData} />
          })
          
        }
          
        </div>
        
      </div>
      {/*right side*/}
      <div className="w-[26%] py-5 hidden md:block">
        
        <div>
          <Card padding={1}>
            <div className="text-xl">Linkedin News</div>
            <div className="text-gray-600">Top stories</div>
            <div className="my-1">
              <div className="text-lg">Buffet to remain Berkshire chair</div>
              <div className="text-xs text-gray-400">2h ago</div>
            </div>
            
            <div className="my-1">
              <div className="text-lg">Forigen investment surge again</div>
              <div className="text-xs text-gray-400">3h ago</div>
            </div>
            
          </Card>
        </div>
        
        <div className="my-5 sticky top-20">
          <Advertisement />
        </div>
        
      </div>
      
      {addPostModal && (<Modal closeModal={handleOpenPostModel} title={""}>
        <AddModal personalData={personalData} />
      </Modal>)
      }
      
      <ToastContainer />
    </div>
    
    )
}

export default Feeds