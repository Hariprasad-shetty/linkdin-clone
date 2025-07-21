
import {useState,useEffect,useRef} from "react"
import Card from "../../components/Card/Card"
import Conversation from "../../components/Conversation/Conversation"
import Advertisement from "../../components/Advertisement/Advertisement"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ImageIcon from '@mui/icons-material/Image'
import socket from "../../../socket"
import axios from "axios"

const Messages=()=>{
  
  const [conversation,setConversation]=useState([]);
  const [ownData,setOwnData]=useState(null);
  const [activeConvId,setActiveConvId]=useState(null);
  const [selectedConvDetails,setSelectedConvDetails]=useState(null);
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const [imageLink,setImageLink]=useState(null);
  const [messageText,setMessageText]=useState("");
  
  const ref=useRef();
  
  useEffect(()=>{
    ref?.current?.scrollIntoView({behaviour: "smooth"});
  },[messages])
  
  const handleSelectedConv=(id,userData)=>{
    setActiveConvId(id);
    socket.emit("joinConversation",id);
    setSelectedConvDetails(userData);
  }
  
  
  useEffect(()=>{
    const userData= localStorage.getItem("userInfo");
    setOwnData(userData?JSON.parse(userData):null);
    
  },[]);
  
  useEffect(()=>{
    if(ownData){
      fetchConversationOnLoad();
    }
  },[ownData])
  
  useEffect(()=>{
    if(activeConvId){
    fetchMessages();
    }
  },[activeConvId]);
  
  
  useEffect(()=>{
    socket.on("receiveMessage",(response)=>{
      setMessages([...messages,response]);
    })
  },[messages])
  
  
  
  const fetchMessages=async ()=>{
    
    await axios.get(`http://localhost:3000/api/message/${activeConvId}`,{withCredentials: true}).then(res=>{
      console.log(JSON.stringify(res))
      setMessages(res?.data?.message);
    }).catch(err=>{
      console.log(err);
      alert(err?.response?.data?.error);
    })
    
  }
  
  
  
  const fetchConversationOnLoad=async ()=>{
    await axios.get("http://localhost:3000/api/conversation/get-conversation",{withCredentials: true}).then(res=>{
      setConversation(res.data.conversations);
      setActiveConvId(res?.data?.conversations[0]?._id);
      socket.emit("joinConversation",res?.data?.conversations[0]?._id);
      let ownId= ownData?._id;
      
    let arr= res?.data?.conversations[0]?.members?.filter(it=>it._id !== ownId);
    setSelectedConvDetails(arr?.[0]);
   
    }).catch(err=>{
      console.log(err);
      alert(err?.response?.data?.error);
    })
    
  }
  
  const handleChangeImage=async(e)=>{
    const files=e.target.files;
    const data= new FormData();
    data.append("file",files[0]);
    data.append("upload_preset","linkdinClone");
    
    setLoading(true);
    try {
      const response=await axios.post("https://api.cloudinary.com/v1_1/dblfbzzih/image/upload",data);
      const imageUrl=response.data.url;
      
      setImageLink(imageUrl);
      
    } catch (error) {
      alert(error)
      console.error(error);
    }finally{
      setLoading(false);
    }
  }
  
  
  const handleSendMessage= async ()=>{
    await axios.post("http://localhost:3000/api/message",{conversation:activeConvId,message:messageText,picture: imageLink},{withCredentials: true}).then(res=>{
    
      socket.emit("sendMessage",activeConvId,res?.data);
      setMessageText("");
    }).catch(err=>{
      console.log(err);
      alert(err?.response?.data?.error);
    })
  }
  
  
  return(
    <div className="px-5 xl:px-52 py-9 flex gap-5 w-full h-[100vh] mt-5 bg-gray-100">
      
      <div className="w-full justify-between flex pt-5 h-fit">
        {/*Left side*/}
        <div className="w-full md:w-[74%]">
          <Card padding={0}>
            <div className="border-b border-gray-300 px-3 py-2 font-semibold text-lg">
              Messaging
            </div>
            <div className="border-b border-gray-300 px-5 py-2">
              <div className="py-1 px-3 cursor-pointer hover:bg-green-900 bg-green-800 font-semibold flex gap-2 w-fit rounded-2xl text-white">Focused <ArrowDropDownIcon /></div>
            </div>
            {/*div for chat*/}
            <div className="w-full md:flex">
              <div className="h-[590px] overflow-auto w-full md:w-[40%] border-r border-gray-400">
                {/*For each chat*/}
                { 
                  conversation?.map((item,index)=>{
                  return (
                    <Conversation activeConvId={activeConvId} item={item} key={index} ownData={ownData} handleSelectedConv={handleSelectedConv} />
                    )
                })
                  
                  
                }
                
              </div>
              <div className="w-full md:w-[60%] border-gray-400">
                
                  <div className="border-gray-300 px-4 py-2 border-b-2 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold">{selectedConvDetails?.f_name}</p>
                      <p className="text-sm text-gray-400.">{selectedConvDetails?.headline}</p>
                    </div>
                    <div>
                      <MoreHorizIcon />
                    </div>
                </div>
                <div className="h-[360px] overflow-auto border-b border-gray-300">
                  <div className="w-full border-b border-gray-300 gap-3 p-4">
                    <img className="rounded-full w-16 h-16 cursor-pointer" src={selectedConvDetails?.profilePic} />
                    <div className="my-2">
                      <div className="text-lg ">{selectedConvDetails?.f_name}</div>
                      <div className="text-lg text-gray-500">{selectedConvDetails?.headline}</div>
                    </div>
                  </div>
                  <div className="w-full">
                    {/*For each Messages*/}
                    {
                      messages?.map((item,index)=>{
                        return(
                          <div ref={ref} key={index} className="flex w-full cursor-pointer border-gray-300 gap-3 p-4">
                      <div className="shrink-0">
                        <img className="w-8 h-8 rounded-full cursor-pointer" src={item?.sender?.profilePic} />
                      </div>
                      <div className="mb-2 w-full">
                        <div className="text-lg">{item?.sender?.f_name}</div>
                        <div className="text-sm mt-6 hover:bg-gray-200">{item?.message}</div>
                        {
                          item?.picture &&
                          <div className="my-2">
                          <img className="w-[240px] h-[180px] rounded-md" src={item?.picture} />
                        </div>
                        }
                      </div>
                    </div>
                          )
                      })
                    }
                  </div>
                  
                </div>
                
                {/*Space for typing Messages*/}
                <div className="p-2 w-full border-b border-gray-200">
                  <textarea value={messageText} onChange={e=>setMessageText(e.target.value)} rows={4} className="bg-gray-200 outline-0 rounded-xl text-sm w-full p-3" placeholder="write a message"></textarea>
                </div>
                <div className="p-3 flex justify-between">
                  <div>
                    <label htmlFor="messageImage" className="cursor-pointer"><ImageIcon /></label>
                    <input onChange={handleChangeImage} type="file" id="messageImage" className="hidden" />
                  </div>
                  {
                    !loading &&
                    <div onClick={handleSendMessage} className="px-3 py-1 cursor-pointer rounded-2xl border bg-blue-950 text-white">
                    Send
                  </div>
                  }
                </div>
                
              </div>
              
            </div>
          </Card>
        </div>
        
        {/*Right side*/}
        <div className="hidden md:flex md:w-[25%]">
          <div className="sticky top-20">
            <Advertisement />
          </div>
        </div>
        
      </div>
      
    </div>
    )
}

export default Messages