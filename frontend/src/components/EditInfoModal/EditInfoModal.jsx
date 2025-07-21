

import {useState} from "react"

const EditInfoModal=({handleEditFunc,selfData})=>{
  
  const [data,setData]= useState({f_name:selfData.f_name,headline:selfData.headline,curr_company:selfData.curr_company,curr_location: selfData.curr_location});
  
  const handleOnChange=(e,key)=>{
    setData({...data,[key]:e.target.value});
  }
  
  
  const handleSaveBtn=async()=>{
    let newData= {...selfData,...data};
    handleEditFunc(newData);
  }
  
  
  return(
    <div className="mt-8 w-full h-[350px] overflow-auto">
      <div className="w-full mb-4">
        <label>Full name*</label>
        <br />
        <input type="text" value={data.f_name} onChange={(e)=>{handleOnChange(e,"f_name")}} className="p-2 mt-1 w-full border rounded-md" placeholder="Enter full name"  />
      </div>
      
      <div className="w-full mb-4">
        <label>Headline*</label>
        <br />
        <textarea value={data.headline} onChange={(e)=>{handleOnChange(e,"headline")}} className="p-2 mt-1 w-full border rounded-md" cols={10} rows={3}></textarea>
      </div>
      
      <div className="w-full mb-4">
        <label>Current company*</label>
        <br />
        <input type="text" value={data.curr_company} onChange={(e)=>{handleOnChange(e,"curr_company")}} className="p-2 mt-1 w-full border rounded-md" placeholder="Enter current company"  />
      </div>
      
      <div className="w-full mb-4">
        <label>Current location*</label>
        <br />
        <input type="text" value={data.curr_location} onChange={(e)=>{handleOnChange(e,"curr_location")}} className="p-2 mt-1 w-full border rounded-md" placeholder="Enter current location"  />
      </div>
      
      <div onClick={handleSaveBtn} className="bg-blue-950 text-white py-1 px-3 w-fit cursor-pointer rounded-3xl">Save</div>
      
    </div>
    )
}

export default EditInfoModal