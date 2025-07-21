

import {useState,useEffect} from "react"
import ProfileCard from "../../components/ProfileCard/ProfileCard"
import axios from "axios"


const MyNetwork=()=>{
  
  const [text,setText]=useState("Catch up with friends")
  const [data,setData]=useState([]);
  
  
  const handleFriend=async ()=>{
    setText("Catch up with friends")
  }

  const handlePending=async ()=>{
    setText("Pending Request")
  }
  
  const fetchFriendList=async ()=>{
    await axios.get("http://localhost:3000/api/auth/friendList",{withCredentials: true}).then(res=>{
      
      setData(res.data.friends);
      
    }).catch(err=>{
      console.log(err);
      
    });
  }
  
  
  const fetchPendingList=async ()=>{
    await axios.get("http://localhost:3000/api/auth/pendingFriendList",{withCredentials: true}).then(res=>{
      
      setData(res.data.pendingFriends);
      
    }).catch(err=>{
      console.log(err);
      
    });
  }
  
  useEffect(()=>{
    if(text==="Catch up with friends"){
      fetchFriendList();
    }else{
      fetchPendingList();
    }
  },[text]);
  
  
  return(
     <div className="px-5 xl:px-52 py-9 flex flex-col gap-5 w-full mt-5 bg-gray-100">
       
       <div className="py-4 px-10 border border-gray-400 w-full flex justify-between my-5 text-xl bg-white rounded-xl">
         <div>{text}</div>
         <div className="flex gap-3">
           <button onClick={handleFriend} className={`p-1 cursor-pointer border rounded-lg border-gray-300 ${text==="Catch up with friends"?"bg-blue-800 text-white":""}`}>Friends</button>
           <button onClick={handlePending} className={`p-1 cursor-pointer border rounded-lg border-gray-300 ${text==="Pending Request"?"bg-blue-800 text-white":""}`}>Pending request</button>
         </div>
       </div>
       <div className="flex h-[90vh] w-full gap-7 flex-wrap items-start">
         {
           data.map((item,index)=>{
           return (<div className="md:w-[23%] h-[270px] sm:w-full">
           <ProfileCard data={item} />
         </div>
       )
           })
         }
         
         {
           data.length===0?text==="Catch up with friends"?<div>No any friends yet.</div>:<div>No any  pending friends yet.</div>:null
         }
         
         </div>
     </div>
    )
}

export default MyNetwork