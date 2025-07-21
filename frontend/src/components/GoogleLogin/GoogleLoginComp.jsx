

import { GoogleLogin } from '@react-oauth/google';
import {useNavigate} from "react-router-dom"
import axios from "axios"

const GoogleLoginComp=(props)=>{
  
  const navigate=useNavigate();
  const handleOnSuccess=  async (credResponse)=>{
    const token= credResponse.credential;
    const res= await axios.post("http://localhost:3000/api/auth/google",token,{withCredentials:true});
    
    props.changeLoginValue(true);
    localStorage.setItem("isLogin",true);
    localStorage.setItem("userInfo",JSON.stringify(res.data.user));
    navigate("/feeds");
  }
  
  return(
    
    <div className="w-full">
      <GoogleLogin
      onSuccess={(credentialResponse) =>{handleOnSuccess(credentialResponse)}}
  onError={() => {
    console.log('Login Failed');
  }}
      />
    </div>
    
    )
}

export default GoogleLoginComp