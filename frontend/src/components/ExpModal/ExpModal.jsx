

import {useState} from "react"


const ExpModal=({handleEditFunc,selfData,updateExp,setUpdateExp})=>{
  
  
  const [data,setData]=useState({
  designation: updateExp?.clicked ? updateExp?.data?.designation : "",
  company_name: updateExp?.clicked ? updateExp?.data?.company_name : "",
  duration: updateExp?.clicked ? updateExp?.data?.duration : "",
  location: updateExp?.clicked ? updateExp?.data?.location : ""});
  
  const onChangeHandle=(e,key)=>{
    setData({...data,[key]:e.target.value});
  }
  
  const updateExpSave=()=>{
    let newFilteredData= selfData?.experience.filter((item)=>item._id !== updateExp?.data?._id);
    let newArr=[...newFilteredData,data];
    let newData={...selfData,experience: newArr};
    handleEditFunc(newData);
  }
  
  const handleOnSave=()=>{

    if(updateExp?.clicked) return updateExpSave();
    
    const prevExp = Array.isArray(selfData?.experience) ? selfData.experience : [];

    // Add new experience entry
    const updatedExperience = [...prevExp, data];

    // Update selfData with new experience
    const newData = { ...selfData, experience: updatedExperience };

    
    handleEditFunc(newData);
  }
  
  
  const handleOnDelete=()=>{
    let newFilteredData= selfData?.experience.filter((item)=>item._id !== updateExp?.data?._id);
    let newData={...selfData,experience: newFilteredData};
    handleEditFunc(newData);
  }
  
  
  return(
    <div className="mt-8 w-full h-[350px] overflow-auto">
      <div className="w-full mb-4">
        <label>Role*</label>
        <br />
        <input value={data.designation} onChange={(e)=>{onChangeHandle(e,"designation")}} type="text" className="p-2 mt-1 w-full border rounded-md" placeholder="Enter role"  />
      </div>
      
      <div className="w-full mb-4">
        <label>Company*</label>
        <br />
        <input value={data.company_name} onChange={(e)=>{onChangeHandle(e,"company_name")}} type="text" className="p-2 mt-1 w-full border rounded-md" placeholder="Enter company name"  />
      </div>
      
      <div className="w-full mb-4">
        <label>Duration*</label>
        <br />
        <input value={data.duration} onChange={(e)=>{onChangeHandle(e,"duration")}} type="text" className="p-2 mt-1 w-full border rounded-md" placeholder="Enter Duration"  />
      </div>
      
      <div className="w-full mb-4">
        <label>Place*</label>
        <br />
        <input value={data.location} onChange={(e)=>{onChangeHandle(e,"location")}} type="text" className="p-2 mt-1 w-full border rounded-md" placeholder="Enter company location"  />
      </div>
      
      <div className="flex justify-between">
      <div onClick={handleOnSave} className="bg-blue-950 text-white py-1 px-3 w-fit cursor-pointer rounded-3xl">Save</div>
      {  updateExp?.clicked &&
        <div onClick={handleOnDelete} className="bg-blue-950 text-white py-1 px-3 w-fit cursor-pointer rounded-3xl">Delete</div>
        
      }
      </div>
    </div>
    )
}

export default ExpModal