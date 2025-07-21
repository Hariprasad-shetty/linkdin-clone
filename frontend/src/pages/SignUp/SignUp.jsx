
import {useState} from "react"
import GoogleLoginComp from "../../components/GoogleLogin/GoogleLoginComp"
import {Link,useNavigate} from "react-router-dom"
import {ToastContainer,toast} from "react-toastify"
import axios from "axios"

const SignUp=(props)=>{
  
  const navigate=useNavigate();
  
  const [registerField,setRegisterField]= useState({email: "",password: "", f_name:""});
  
  const handleInputField=(e,key)=>{
    setRegisterField({...registerField,[key]:e.target.value});
  }
  
  
  const handleRegister=async ()=>{
    if(registerField.email.trim().length===0 || registerField.password.trim().length===0 || registerField.f_name.trim().length===0){
      
      return toast.error("Please fill all details");
    }else{
      axios.post("http://localhost:3000/api/auth/register",registerField).then(res=>{
        
        toast.success("You have registered successfully");
        setRegisterField({...registerField,email:"",password:"",f_name:""});
        navigate("/login");
      }).catch(err=>{
        console.log(err);
        toast.error(err?.response?.data?.error);
      });
      
    }
    
    
  }
  
  
  
  return (
    <div className="w-full h-[98vh] flex flex-col items-center justify-center">
      <div className="text-4xl mb-5">Make the most of your professional life</div>
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-sm box p-10">
        
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="email">Email</label>
            <input type="text" value={registerField.email} onChange={(e)=>handleInputField(e,"email")} className="w-full text-xl border-2 rounded-lg px-5 py-1" placeholder="Email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" value={registerField.password} onChange={(e)=>handleInputField(e,"password")} className="w-full text-xl border-2 rounded-lg px-5 py-1" placeholder="Password" />
          </div>
          <div>
            <label htmlFor="f_name">First name</label>
            <input type="text" value={registerField.f_name} onChange={(e)=>handleInputField(e,"f_name")} className="w-full text-xl border-2 rounded-lg px-5 py-1" placeholder="First name" />
          </div>
          <div onClick={handleRegister} className="w-full hover:bg-blue-900 bg-blue-800 text-white py-3 px-4 rounded-xl text-center text-xl cursor-pointer">
            Register
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="border border-b-1 border-gray-400 w-[45%]"></div>
          <div>or</div>
          <div className="border border-b-1 border-gray-400 w-[45%] my-6"></div>
        </div>
        <div>
          <GoogleLoginComp changeLoginValue={props.changeLoginValue} />
        </div>
      </div>
      
      <div className="mt-4 mb-10">
        Already on linkedin? <Link to="/login" className="text-blue-800 cursor-pointer">Sign in</Link>
      </div>
      <ToastContainer />
    </div>
    
    )
}

export default SignUp