

import {useState} from "react"
import ImageIcon from '@mui/icons-material/Image';
import {ToastContainer,toast} from "react-toastify"
import axios from "axios"

const AddModal=(props)=>{
  
  //const cloudName= dblfbzzih;
  //presetName= linkdinClone;
  const [imageUrl,setImageUrl]=useState(null);
  const [desc,setDesc]=useState("");
  
  const handlePost= async()=>{
    if(desc.trim().length === 0 && !imageUrl) return toast.error("Please enter any field");
    
    await axios.post("http://localhost:3000/api/post",{desc: desc,imageLink: imageUrl},{withCredentials:true}).then(res=>{
      
      window.location.reload();
      
    }).catch(err=>{
      console.log(err);
    });
    
  }
  
  
  const handleUploadImage=async(e)=>{
    const files=e.target.files;
    const data= new FormData();
    data.append("file",files[0]);
    data.append("upload_preset","linkdinClone");
    
    try {
      const response=await axios.post("https://api.cloudinary.com/v1_1/dblfbzzih/image/upload",data);
      const imageUrl=response.data.url;
      
      setImageUrl(imageUrl);
      
    } catch (error) {
      alert(error)
      console.error(error);
    }
    
  }
  
  
  
  return(
    <div className="">
      <div className="flex gap-4 items-center">
        <div className="relative">
          <img className="w-16 h-16 rounded-full" alt="img" src={props.personalData?.profilePic} /> 
        </div>
        <div className="text-2xl leading-none">{props.personalData?.f_name}</div>
      </div>
      <div>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={10} placeholder="What do you want to talk about?" className="w-full my-3 outline-0 text-xl p-2"></textarea>
      </div>
      { imageUrl && <div>
        <img className="h-10 w-10 rounded-xl" src={imageUrl} />
      </div>}
      <div className="flex justify-between items-center">
        <div className="my-6">
          <label className="cursor-pointer" htmlFor="inputFile"><ImageIcon /></label>
          <input onChange={handleUploadImage} type="file" className="hidden" id="inputFile" />
        </div>
        <div onClick={handlePost} className="bg-blue-950 text-white py-1 px-5 cursor-pointer rounded-2xl">Post</div>
      </div>
      <ToastContainer />
    </div>
    )
}

export default AddModal