

import {useState} from "react"
import axios from "axios"

const MessageModal=({selfData,userData})=>{
  
  const [message,setMessage]=useState("");
  
  
  const handleSendMessage=async ()=>{
    
    await axios.post("http://localhost:3000/api/conversation/add-conversation",{recieverId: userData?._id,message},{withCredentials: true}).then(res=>{
      window.location.reload();
    }).catch(err=>{
      console.log(err);
      alert(err?.response?.data?.error);
    })
    
  }
  
  return(
    <div className="my-5">
      
      <div className="w-full mb-4">
        <textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Enter message" className="p-2 mt-1 w-full border rounded-md" cols={10} rows={10}></textarea>
      </div>
      
      <div onClick={handleSendMessage} className="bg-blue-950 text-white py-1 px-3 w-fit cursor-pointer rounded-3xl">Send</div>
      
    </div>
    )
}

export default MessageModal