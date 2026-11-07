import {useNavigate , useRoutes  } from "react-router-dom";
import { Profiler, useEffect } from "react";
//Page List

import Dashboard  from "./components/dashBoard/DashBoard";
import UserProfile from "./components/user/Profil"
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";

// Auth Context


import { useAuth } from "./authContext";

const ProjectRoutes = () =>{
  const {currUser , setCurrUser} = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    const userIdFormStorage = localStorage.getItem("userId")
     if(userIdFormStorage && ! currUser){
      setCurrUser(userIdFormStorage)
     }
  
     if(!userIdFormStorage && !["/auth","/signup"].includes(window.location.pathname)){
      navigate("/auth")
     }
     if(userIdFormStorage && window.location.pathname== "/auth"){
      navigate("/")
     }
  },[setCurrUser , navigate , currUser]);

  let element = useRoutes(
    [
      {
        path:"/",
        element:<Dashboard/>
      },
      
      {
        path:"/auth",
        element:<Login/>
      },
      {
        path:"/signup",
        element:<SignUp/>
      },
      {
        path:"/profile",
        element:<UserProfile/>
      }

    ]
  )
  return element;

}
export default ProjectRoutes;