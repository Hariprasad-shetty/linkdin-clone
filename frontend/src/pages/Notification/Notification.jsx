
import {useState,useEffect} from "react"
import ProfileCard from "../../components/ProfileCard/ProfileCard"
import Advertisement from "../../components/Advertisement/Advertisement"
import Card from "../../components/Card/Card"
import {useNavigate} from "react-router-dom"
import axios from "axios";


const Notification=()=>{
  
  const navigate=useNavigate();
  const [ownData,setOwnData]=useState(null);
  const [notification,setNotification]= useState([]);
  
  
  const fetchNotificationData= async ()=>{
    await axios.get("http://localhost:3000/api/notification",{withCredentials: true}).then(res=>{
      setNotification(res?.data?.notifications);
    }).catch(err=>{
      console.log(err);
      alert(err?.response?.data?.error);
    });
    
  }
  
  
  const handleOnClickNotification=async (item)=>{
    
    await axios.put("http://localhost:3000/api/notification/isRead",{notificationId: item?._id},{withCredentials:true}).then(res=>{
       
      if(item?.type==="comment"){
        navigate(`/profile/${ownData?._id}/activities/${item?.postId}`);
      }else{
        navigate("/myNetwork");
      }
      
    }).catch(err=>{
      console.log(err);
      alert(err?.response?.data?.error);
    })
    
    
    
  }
  
  
  
  
  
  useEffect(()=>{
    const userData= localStorage.getItem("userInfo");
    setOwnData(userData?JSON.parse(userData):null);
    
    fetchNotificationData();
  },[]);
  
  
  
  return(
    <div className="px-5 xl:px-52 py-9 flex gap-5 w-full h-[98vh] mt-5 bg-gray-100">
      {/*left side*/}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5 ">
        <div className="h-fit">
          <ProfileCard data={ownData} />
        </div>
      </div>
      
      
      {/*middle side*/}
      <div className="w-[100%] py-5 sm:w-[50%]">
        
        <div>
          <Card padding={0}>
            <div className="w-full">
              
              {
                notification?.map((item,index)=>{
                  return (
                    <div key={index} 
                      onClick={()=>{handleOnClickNotification(item)}} className={`border-b cursor-pointer flex gap-4 items-center border-gray-300 p-3 ${item?.isRead?"bg-gray-200":"bg-blue-200"}`}>
                
                <img src={item?.sender?.profilePic} className="rounded-full cursor-pointer w-14 h-14" />
                <div>{item?.content}</div>
                
              </div>
                    )
                })
              }
              
            </div>
          </Card>
        </div>
        
      </div>
      {/*right side*/}
      <div className="w-[26%] py-5 hidden md:block">
        
        <div className="my-5 sticky top-20">
          <Advertisement />
        </div>
      </div>
    </div>
    
    )
  
}

export default Notification