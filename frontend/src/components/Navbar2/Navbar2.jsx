
import {useState,useEffect} from "react"
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {useLocation,Link} from "react-router-dom"
import axios from "axios"
import "./Navbar2.css"

const Navbar2=()=>{
  
  const location= useLocation();
 // const [dropDown,setDropDown]=useState(false);
  
  const [userData,setUserData]=useState(null);
  
  const [searchTerm,setSearchTerm]=useState("");
  const [debouncedTerm,setDebouncedTerm]=useState("");
  const [searchUser,setSearchUser]=useState([]);
  const [notificationCount,setNotificationCount]=useState("");
  
  useEffect(()=>{
    const handler= setTimeout(()=>{
      setDebouncedTerm(searchTerm);
    },1000);
    return ()=>{
      clearTimeout(handler);
    }
  },[searchTerm]);
  
 const searchApiCall= async ()=>{
   await axios.get(`http://localhost:3000/api/auth/findUser?query=${debouncedTerm}`,{withCredentials:true}).then(res=>{
    
    
     setSearchUser(res.data.users);
     
   }).catch(err=>{
     console.log(err);
     alert(err?.response?.data?.error)
   });
   
 }
  
  useEffect(()=>{
    if(debouncedTerm){
      searchApiCall();
    }
  },[debouncedTerm]);
  
  
  const fetchNotification=async ()=>{
    await axios.get("http://localhost:3000/api/notification/activeNotification",{withCredentials: true}).then(res=>{
     var count= res.data.count
      setNotificationCount(count)
    }).catch(err=>{
     console.log(err);
     alert(err?.response?.data?.error)
   });
   
   
  }
  
  
  useEffect(()=>{
    const userData= localStorage.getItem("userInfo");
    setUserData(userData?JSON.parse(userData):null);
    
    fetchNotification();
    
  },[location.pathname]);
  
  
  
  
  return(
    
    <div className="bg-white h-13 flex justify-between py-1 px-5 xl:px-52 fixed top-0 w-[100%] z-1000">
      <div className="flex gap-2 items-center">
        <Link to="/feeds">
          <img className="w-8 h-8" src={"https://freelogopng.com/images/all_img/1656994981linkedin-icon-png.png"} alt="Logo" />
        </Link>
        <div className="relative">
          <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} type="text" className="searchInput w-72 bg-gray-100 rounded-sm h-10 px-4" placeholder="Search" />
          {
            searchUser.length > 0 && debouncedTerm.length !==0 && <div className="absolute w-52 left-0 bg-gray-200">
            {
              searchUser?.map((item,index)=>
                {return(
                  <Link to={`profile/${item?._id}`} key={index} onClick={()=>{setSearchTerm("")}} className="flex mb-1 gap-2 items-center p-2 cursor-pointer">
              <div>
                <img className="w-10 h-10 rounded-full" src={item?.profilePic} alt="profile pic" />
               
              </div>
              <div>{item?.f_name}</div>
            </Link>
                  )
                })
            }
          </div>
          }
        </div>
      </div>
      
      <div className="hidden gap-10 md:flex">
       
        <Link to="/feeds" className="flex flex-col items-center cursor-pointer">
          <HomeIcon sx={{
            color: location.pathname==="/feeds" ? "black" : "gray"
          }} />
          <div className={`text-sm text-gray-500 ${location.pathname==="/feeds" ? "border-b-4 border-black" : ""}`}>Home</div>
        </Link>
        
        <Link to="/mynetwork" className="flex flex-col items-center cursor-pointer">
          <GroupIcon sx={{
            color: location.pathname==="/mynetwork" ? "black" : "gray"
          }} />
          <div className={`text-sm text-gray-500 ${location.pathname==="/mynetwork" ? "border-b-4 border-black" : ""}`}>My Network</div>
        </Link>
        
        <Link to="resume" className="flex flex-col items-center cursor-pointer">
          <WorkIcon sx={{
            color: location.pathname==="/resume" ? "black" : "gray"
          }} />
          <div className={`text-sm text-gray-500 ${location.pathname==="/resume" ? "border-b-4 border-black" : ""}`}>Resume</div>
        </Link>
        
        <Link to="/messages" className="flex flex-col items-center cursor-pointer">
          <MessageIcon sx={{
            color: location.pathname==="/messages" ? "black" : "gray"
          }} />
          <div className={`text-sm text-gray-500 ${location.pathname==="/messages" ? "border-b-4 border-black" : ""}`}>Message</div>
        </Link>
        
        <Link to="/notification" className="flex flex-col items-center cursor-pointer">
          <div><NotificationsIcon sx={{
            color: location.pathname==="/notification" ? "black" : "gray"
          }} />
          {
            notificationCount > 0 && 
            <span className="p-1 rounded-full text-sm bg-red-700 text-white">{notificationCount}</span>
          }
          </div>
          <div className={`text-sm text-gray-500 ${location.pathname==="/notification" ? "border-b-4 border-black" : ""}`}>Notification</div>
        </Link>
        
        <Link to={`/profile/${userData?._id}`} className="flex flex-col items-center cursor-pointer">
          <img className="w-8 h-8 rounded-full" src={userData?.profilePic} alt="profile icon" />
          <div className="text-sm text-gray-500">Me</div>
        </Link>
        
      </div>
      
    </div>
    
    )
  
}

export default Navbar2