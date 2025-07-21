
import {useState,useEffect} from "react"
import Navbar1 from "./components/Navbar1/Navbar1"
import Navbar2 from "./components/Navbar2/Navbar2"
import LandingPage from "./pages/LandingPage/LandingPage"
import Footer from "./components/Footer/Footer"
import SignUp from "./pages/SignUp/SignUp"
import Login from "./pages/Login/Login"
import Feeds from "./pages/Feeds/Feeds"
import MyNetwork from "./pages/MyNetwork/MyNetwork"
import Resume from "./pages/Resume/Resume"
import Messages from "./pages/Messages/Messages"
import Profile from "./pages/Profile/Profile"
import AllActivities from "./pages/AllActivities/AllActivities"
import SingleActivity from "./pages/SingleActivity/SingleActivity"
import Notification from "./pages/Notification/Notification"
import {Routes,Route,Navigate} from "react-router-dom"
import './App.css'

function App() {
  
  const [isLogin,setIsLogin]= useState(localStorage.getItem("isLogin"));
  
  
  const changeLoginValue=(val)=>{
    setIsLogin(val);
  }
  
  
  
  // const fetchData=async ()=>{
  //   await axios.post("http://localhost:3000/api/auth/login",{email:"",password:""}).then((res)=>{
  //     alert(res);
  //   });
  // }
  
  // useEffect(()=>{
  //   fetchData()
  // },[])
  
  

  return (
    <>
      <div className="bg-gray-100 w-[100%] h-[100%] box-border">
        {isLogin?<Navbar2 />:<Navbar1 />}
        <Routes>
          <Route path="/" element={isLogin?<Navigate to={"/feeds"} />:<LandingPage changeLoginValue={changeLoginValue} />} />
          <Route path="/signup" element={isLogin?<Navigate to={"/feeds"} />:<SignUp changeLoginValue={changeLoginValue} />} />
          <Route path="/login"  element={isLogin?<Navigate to={"/feeds"} />:<Login changeLoginValue={changeLoginValue} />} />
          <Route path="/feeds" element={isLogin?<Feeds />:<Navigate to={"/login"} />} />
          <Route path="/mynetwork" element={isLogin?<MyNetwork />:<Navigate to={"/login"} />} />
          <Route path="/resume" element={isLogin?<Resume />:<Navigate to={"/login"} />} />
          <Route path="/messages" element={isLogin?<Messages />:<Navigate to={"/login"} />} />
          <Route path="/notification" element={isLogin?<Notification />:<Navigate to={"/login"} />} />
          
          <Route path="/profile/:id" element={isLogin?<Profile />:<Navigate to={"/login"} />} />
          <Route path="/profile/:id/activities" element={isLogin?<AllActivities />:<Navigate to={"/login"} />} />
          <Route path="profile/:id/activities/:postId" element={isLogin?<SingleActivity />:<Navigate to={"/login"} />} />
        </Routes>
        
        <Footer />
      </div>
      
    </>
  )
}

export default App
