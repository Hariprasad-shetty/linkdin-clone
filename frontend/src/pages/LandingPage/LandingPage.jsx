
import GoogleLoginComp from "../../components/GoogleLogin/GoogleLoginComp"
import {Link} from "react-router-dom"

const LandingPage=(props)=>{
  
  
  return(
    
    <div className="my-4 py-[50px] h-[98vh] md:pl-[120px] px-5 md:flex justify-between items-center">
      <div className="md:w-[40%]">
        <div className="text-4xl mx-auto text-gray-500">
          Welcome to your professional community
        </div>
        <div className="my-5 flex mx-auto mt-[20px] bg-white gap-2 rounded-3xl w-[70%] text-black cursor-pointer">
          <GoogleLoginComp changeLoginValue={props.changeLoginValue} />
        </div>
        <Link to="/login" className="flex mx-auto mt-[20px] py-2 px-2 bg-white gap-2 rounded-3xl items-center w-[70%] justify-center text-black hover:bg-gray-100 border-2 cursor-pointer">
          Sign in with email
        </Link>
        <div className="mx-auto mb-4 text-sm w-[70%] mt-6">
          By clicking countinue to join or sign in, you agree to <span className="text-blue-800 cursor-pointer hover:underline">Linkedin's user agreement</span>, <span className="text-blue-800 cursor-pointer hover:underline">Privacy Policy</span>, and <span className="text-blue-800 cursor-pointer hover:underline">Cookie Policy</span>

        </div>
        <Link to="/signup" className="mx-auto text-center mb-6 text-lg w-[70%] mt-4">
          New to linkedin? <span className="text-blue-800 cursor-pointer hover:underline">Join Now</span>
        </Link>
      </div>
      <div className="md:w-1/2 h-120">
        <img src={"https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"} alt="hero image" className="w-full" />
      </div>
    </div>
    
    )
}

export default LandingPage