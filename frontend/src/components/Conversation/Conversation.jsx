

import {useState,useEffect} from "react"

const Conversation=({activeConvId,item,key,ownData,handleSelectedConv})=>{
  
  
  const [memberData,setMemberData]=useState(null);
  
  useEffect(()=>{
    let ownId= ownData?._id;
    let arr= item?.members?.filter(it=>it._id !== ownId);
    
    setMemberData(arr[0]);
    
  },[]);
  
  const handleClickFunc=()=>{
    handleSelectedConv(item?._id,memberData);
  }
  
  return(
    <div onClick={handleClickFunc} key={key} className={`flex items-center w-full cursor-pointer border-b border-gray-300 gap-3 p-4 hover:bg-gray-200 ${activeConvId===item?._id?"bg-gray-200":null}`}>
                  <div className="shrink-0">
                    <img src={memberData?.profilePic} className="h-12 w-12 cursor-pointer rounded-full" />
                  </div>
                  <div>
                    <div className="text-lg">{memberData?.f_name}</div>
                    <div className="text-sm text-gray-500">{memberData?.headline}</div>
                  </div>
                </div>
    )
}

export default Conversation