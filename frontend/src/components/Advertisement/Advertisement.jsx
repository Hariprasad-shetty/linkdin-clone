
import {useState,useEffect} from "react"
import Card from "../Card/Card"

const Advertisement=()=>{
  
  const [userData,setUserData]=useState(null);
  useEffect(()=>{
    const userData= localStorage.getItem("userInfo");
    setUserData(userData?JSON.parse(userData):null);
  },[]);
  
  
  return(
    
    <div className="sticky top-20">
      <Card padding={0}>
        <div className="relative h-24">
        <div className="relative w-full h-20 rounded-md">
          <img src="https://images.pexels.com/photos/573130/pexels-photo-573130.jpeg?_gl=1*13qhf3e*_ga*NjQ3MzA5NDM2LjE3NTE4OTkyMDI.*_ga_8JE65Q40S6*czE3NTE4OTkyMDIkbzEkZzAkdDE3NTE4OTkyMDIkajYwJGwwJGgw" className="rounded-t-md h-full w-full" />
        </div>
        <div className="absolute top-14 left-[40%] z-10">
          <img src={userData?.profilePic} className="rounded-full border-2 h-14 w-14 border-white cursor-pointer" />
        </div>
        </div>
        
        <div className="px-5 py-5 my-5 mx-auto">
          <div className="text-sm font-semibold text-center">{userData?.f_name}</div>
          <div className="text-sm my-3 text-center">Get the latest jobs and industry news</div>
          <div className="text-sm my-1 border text-center p-2 rounded-2xl font-bold border-blue-950 text-white bg-blue-800 cursor-pointer">Explore</div>
        </div>
        
      </Card>
      
    </div>
    
    )
    
}

export default Advertisement
