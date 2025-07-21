

import{useState,useEffect} from "react"
import axios from "axios"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const ImageModal=({isCircular,selfData,handleEditFunc})=>{
  
  const [imageLink,setImageLink]= useState(isCircular?selfData?.profilePic:selfData?.cover_pic);
  
  const [loading,setLoading]= useState(false);
  
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
  
  
  const handleSubmitBtn=async()=>{
    let {data}= {...selfData};
    if(isCircular){
      data= {...data,["profilePic"]: imageLink};
    }else{
      data={...data,["cover_pic"]:imageLink};
    }
    
    handleEditFunc(data);
  }
  
  return(
    <div className="p-5 relative flex items-center flex-col h-full">
      
      {
      isCircular ? (
          <img className="rounded-full w-[150px] h-[150px]" src={imageLink} />
      ) : (
          <img className="rounded-xl w-full h-[200px] object-cover" src={imageLink} />
      ) 
      }
      
      <label htmlFor="btn-submit" className="absolute bottom-10 left-0 p-3 bg-blue-900 text-white rounded-2xl cursor-pointer">Upload</label>
      <input onChange={handleChangeImage} type="file" className="hidden" id="btn-submit" />
      
      { loading?<Box sx={{
        display: 'flex'
      }}><CircularProgress /></Box>:<div onClick={handleSubmitBtn} className="absolute bottom-10 right-0 p-3 bg-blue-900 text-white rounded-2xl cursor-pointer">Submit</div>}
      
    </div>
    )
  
}

export default ImageModal