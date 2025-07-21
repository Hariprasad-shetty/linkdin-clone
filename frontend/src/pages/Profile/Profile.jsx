
import {useState,useEffect} from "react"
import Card from "../../components/Card/Card"
import Advertisement from "../../components/Advertisement/Advertisement"
import Post from "../../components/Post/Post"
import Modal from "../../components/Modal/Modal"
import ImageModal from "../../components/ImageModal/ImageModal"
import EditInfoModal from "../../components/EditInfoModal/EditInfoModal"
import AboutModal from "../../components/AboutModal/AboutModal"
import ExpModal from "../../components/ExpModal/ExpModal"
import MessageModal from "../../components/MessageModal/MessageModal"

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import {Link,useParams} from "react-router-dom"
import {ToastContainer,toast} from "react-toastify"
import axios from "axios"

const Profile=()=>{
  
  const {id}=useParams();
  
  
  const [imageModal,setImageModal]= useState(false);
  const [circularImage,setCircularImage]= useState(true)
  const [infoModal,setInfoModal]=useState(false)
  const [aboutModal,setAboutModal]=useState(false)
  const [expModal,setExpModal]=useState(false)
  const [messageModal,setMessageModal]=useState(false)
  const [userData,setUserData]=useState([]);
  const [postData,setPostData]=useState([]);
  const [ownData,setOwnData]=useState(null);
  const [updateExp,setUpdateExp]=useState({clicked:"",id:"",datas:{}});
  
  
  
  
  useEffect(()=>{
    fetchDataOnLoad();
  },[id]);
  
  
  
  const updateExpEdit=(id,data)=>{
    setUpdateExp({...updateExp,clicked: true,id: id,data: data});
    setExpModal(prev=>!prev);
  }
  
  const fetchDataOnLoad=async()=>{
    try{
      
      const [userDatas,postDatas,ownDatas]= await Promise.all([
        axios.get(`http://localhost:3000/api/auth/user/${id}`),
        axios.get(`http://localhost:3000/api/post/getTop5Post/${id}`),
        axios.get(`http://localhost:3000/api/auth/self`,{withCredentials: true})
        
        
        ]);
      
      setUserData(userDatas.data.user);
      setPostData(postDatas.data.posts);
      setOwnData(ownDatas.data.user);
      
      localStorage.setItem("userInfo",JSON.stringify(ownDatas.data.user));
      
    }catch (err) {
     console.error(err);
     toast.error(err?.response?.data?.error);
   }
    
  }
  
  
  const handleImageModalOpenClose=()=>{
    setImageModal(prev=>!prev);
  }
  
  const handleOnEditCover=()=>{
    setImageModal(true)
    setCircularImage(false)
  }
  
  const handleCircularImageOpen=()=>{
    setImageModal(true)
    setCircularImage(true)
  }
  
  const handleInfoModal=()=>{
    setInfoModal(prev=>!prev)
  }
  
  const handleAboutModal=()=>{
    setAboutModal(prev=>!prev)
  }
  
  const handleExpModal=()=>{
    if(expModal){
      setUpdateExp({clicked:"",id:"",datas:{}});
    }
    setExpModal(prev=>!prev)
  }
  
  const handleMessageModal=()=>{
    setMessageModal(prev=>!prev)
  }
  


const handleEditFunc=async (data)=>{
  
  await axios.put("http://localhost:3000/api/auth/update",{user: data},{withCredentials: true}).then(res=>{
    
    
    window.location.reload();
    
  }).catch(err=>{
    console.log(err);
    toast.error("Something went wrong");
  });
  
}


const amIFriend=()=>{
  let arr= userData?.friends?.filter(item=>item===ownData._id);
  return arr?.length;
}

const isInPendingList=()=>{
  let arr= userData?.pending_friends?.filter(item=>item===ownData._id);
  return arr?.length;
}


const isInSelfPendingList=()=>{
  let arr= ownData?.pending_friends?.filter(item=>item===userData._id);
  return arr?.length;
}


const checkFriendStatus=()=>{
  if(amIFriend()){
    return "Disconnect";
  }else if(isInSelfPendingList()){
    return "Approve Request";
  }else if(isInPendingList()){
    return "Request Sent";
  }else{
    return "Connect";
  }
  
  
}


  const handleSendFriendRequest=async ()=>{
    if(checkFriendStatus()==="Request Sent") return;
    
    if(checkFriendStatus()==="Connect"){
      await axios.post("http://localhost:3000/api/auth/sendFriendReq",{reciever: userData?._id},{withCredentials: true}).then(res=>{
        toast.success(res?.data?.message);
        setTimeout(()=>{
          window.location.reload();
        },2000);
        
      }).catch(err=>{
        console.log(err);
        toast.error(err?.response?.data?.error);
      });
      
    }else if(checkFriendStatus()==="Approve Request"){
      
      await axios.post("http://localhost:3000/api/auth/acceptFriendReq",{friendId: userData?._id},{withCredentials: true}).then(res=>{
        
        toast.success(res?.data?.message);
        setTimeout(()=>{
          window.location.reload();
        },2000);
        
      }).catch(err=>{
        console.log(err);
        toast.error(err?.response?.data?.error);
      });
      
    }else{
     
      axios.delete(`http://localhost:3000/api/auth/removeFromFriendList/${userData?._id}`,{withCredentials: true}).then(res=>{
        
        toast.success(res?.data?.message);
        setTimeout(()=>{
          window.location.reload();
        },2000);
        
      }).catch(err=>{
        
        console.log(err);
        toast.error(err?.response?.data?.error);
      });
      
      
//       try {
// const res = await axios.delete(`http://localhost:3000/api/removeFromFriendList/${userData?._id}`, {
// withCredentials: true,
// data: {}, // important for DELETE requests
// });
// toast.success(res?.data?.message);
// setTimeout(() => window.location.reload(), 2000);
// } catch (err) {
// console.error("Error disconnecting:", err);
// toast.error(err?.response?.data?.error || "Disconnect failed");
// }

      
      
      
      
      
    }
    
    
  }


const handleLogout= async ()=>{
  await axios.post("http://localhost:3000/api/auth/logout",{},{withCredentials:true}).then(res=>{
    
    localStorage.clear();
    window.location.reload();
    
  }).catch(err=>{
    console.log(err);
        toast.error(err?.response?.data?.error);
  });
  
}


const copyToClipboard=async ()=>{
    try {
      let string= `http://localhost:5173/profile/${id}`;
      await navigator.clipboard.writeText(string);
      toast.success("Copied to clipboard");
      
    } catch (error) {
      console.error(error);
    }
  }


  
  // if (!userData || !ownData) return <div className="text-center py-10">Loading profile...</div>;




  
  return(
    <div className="px-5 xl:px-52 py-5 mt-5 flex flex-col gap-5 w-full h-[98vh] pt-12 bg-gray-100">
      <div className="flex justify-between">
        
        {/*left side*/}
        <div className="w-full md:w-[70%]">
          <div>
            <Card padding={0}>
              <div className="w-full h-fit">
                <div className="relative w-full h-[200px]">
                
                
                { userData?._id === ownData?._id &&
                  <div className="absolute cursor-pointer top-3 right-3 z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-5 bg-white" onClick={handleOnEditCover}><EditIcon /></div>
                }
                
                  <img src={userData?.cover_pic} className="w-full h-[200px] rounded-tr-lg rounded-tl-lg" />
                  <div className="absolute object-cover top-24 left-6 z-10" onClick={handleCircularImageOpen}>
                    <img src={userData?.profilePic} className="rounded-full border-2 border-white cursor-pointer w-36 h-36" />
                  </div>
                </div>
                
                <div className="mt-10 relative px-8 py-2">
                { userData?._id === ownData?._id &&
                  <div className="absolute cursor-pointer top-0 right-3 z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-5 bg-white" onClick={handleInfoModal}><EditIcon /></div>
                }
                  <div className="w-full">
                    <div className="text-2xl">{userData?.f_name}</div>
                    <div className="text-gray-700">{userData?.headline}</div>
                    <div className="text-gray-500">{userData?.curr_location}</div>
                    <div className="text-lg text-blue-800 w-fit cursor-pointer hover:underline">{userData?.friends?.length} Connections</div>
                    
                    <div className="md:flex w-full justify-between">
                      <div className="my-5 flex gap-1">
                        <div className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold">Open to</div>
                        <div onClick={copyToClipboard} className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold">Share profile</div>
                        
                        { userData?._id === ownData?._id &&
                        <div onClick={handleLogout} className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold">Logout</div>
                        }
                        
                      </div>
                      
                      <div className="my-5 flex gap-1">
                      
                      { amIFriend() ?
                        <div className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold" onClick={handleMessageModal}>Message</div> : null
                      }
                        
                        { userData?._id===ownData?._id ? null :
                        <div onClick={handleSendFriendRequest} className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold">{checkFriendStatus()}</div>
                        }
                        
                      </div>
                      
                    </div>
                    
                  </div>
                </div>
                
              </div>
            </Card>
          </div>
          
          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">About</div>
                
                { userData?._id === ownData?._id &&
                <div className="cursor-pointer" onClick={handleAboutModal}><EditIcon /></div>
                }
                
              </div>
              <div className="text-gray-700 text-lg w-[80%]">{userData?.about}</div>
            </Card>
          </div>
          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Skills</div>
              </div>
              <div className="text-gray-700 text-lg my-2 w-full flex gap-4 flex-wrap">
                
                {
                  userData?.skills?.map((item,index)=>{
                    return(
                      <div key={index} className="py-2 px-3 cursor-pointer bg-blue-800 text-white rounded-lg">{item}</div>
                      )
                  })
                }
               
              </div>
            </Card>
          </div>
          
          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Activities</div>
                </div>
                <div className="cursor-pointer px-3 py-1 w-fit border rounded-3xl bg-green-800 text-white font-semibold">Posts</div>
                {/*Parent div for scrollable activities*/}
                <div className="overflow-x-auto my-2 flex gap-1 overflow-y-hidden w-full">
                  {
                    postData.map((item,index)=>{
                      return(
                        <Link to={`/profile/${id}/activities/${item?._id}`} className="cursor-pointer shrink-0 w-[350px] h-[560px]">
                  <Post profile={1} item={item} personalData={ownData}  />
                  </Link>
                        )
                    })
                  }
                </div>
                
                {
                  postData.length > 5 &&
                  <div className="w-full flex justify-center items-center">
                  <Link to={`/profile/${id}/activities`} className="p-2 rounded-xl cursor-pointer hover:bg-gray-300">Show all posts <ArrowRightAltIcon /></Link>
                </div>
                }
                
            </Card>
          </div>
          
          <div className="mt-5">
            <Card padding={1}>
            <div className="flex justify-between items-center">
                <div className="text-xl">Experience</div>
                
                { userData?._id === ownData?._id &&
                <div className="cursor-pointer" onClick={handleExpModal}><AddIcon /></div>
                }
                
              </div>
              <div className="mt-5">
                
                {
                  userData?.experience?.map((item,index)=>{
                    
                    return(
                      <div className="p-2 border-t border-gray-300 flex justify-between">
                  <div>
                  <div className="text-lg">{item.designation}</div>
                  <div className="text-sm">{item.company_name}</div>
                  <div className="text-sm text-gray-500">{item.duration}</div>
                  <div className="text-sm" text-gray-500>{item.location}</div>
                  </div>
                  
                  { userData?._id === ownData?._id &&
                  <div onClick={()=>updateExpEdit(item._id,item)} className="cursor-pointer"><EditIcon /></div>
                  }
                  
                </div>
                      )
                    
                  })
                }
                
              </div>
              
            </Card>
          </div>
          
        </div>
        
        
        
        
        {/*right side*/}
         <div className="hidden md:flex md:w-[28%]">
           <div className="sticky top-20">
             <Advertisement />
           </div>
         </div>
        
        
      </div>
      {
        imageModal && 
        <Modal title="Upload image" closeModal={handleImageModalOpenClose}>
        <ImageModal handleEditFunc={handleEditFunc} selfData={ownData} isCircular={circularImage} />
      </Modal>
      }
      
      {
        infoModal &&
        <Modal title="Edit info" closeModal={handleInfoModal}>
          <EditInfoModal handleEditFunc={handleEditFunc} selfData={ownData} />
        </Modal>
      }
      
      {
        aboutModal &&
        <Modal title="Edit about" closeModal={handleAboutModal}>
          <AboutModal handleEditFunc={handleEditFunc} selfData={ownData} />
        </Modal>
      }
      
      {
        expModal &&
        <Modal title="Experience" closeModal={handleExpModal}>
          <ExpModal handleEditFunc={handleEditFunc} selfData={ownData} updateExp={updateExp} setUpdateExp={updateExpEdit} />
        </Modal>
      }
      
      {
        messageModal &&
        <Modal title="Send message" closeModal={handleMessageModal}>
          <MessageModal selfData={ownData} userData={userData} />
        </Modal>
      }
      
      <ToastContainer />
      
    </div>
    )
}


export default Profile