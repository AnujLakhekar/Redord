import React, { useState, useEffect } from 'react';


import { useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Settings } from 'lucide-react';
import Cookies from "js-cookie";

// pages

function Sidebar() {
  const [authUser, setAuthUser] = useState(null);
  
  const queryClient = useQueryClient()

  const user = queryClient.getQueryData(["authUser"])
  

  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setAuthUser(user);
    } else {
      setAuthUser(null);
    }
  }, [user]);
  
  
  function handleLogout() {
    Cookies.remove("jwt");
    var isCookieReomved = Cookies.get("jwt"); 
   window.location.reload()
  }
  
  function handleNewServer() {
    
  }
  
  return (
    <>
    <div className="flex p-1 border-r-2 border-r-primary/30 w-20 h-screen flex-col items-center gap-2.5" >
     <div className="flex flex-col  items-center">
     {authUser && (
      <div className="group p-1 h-14">
     <img src={authUser.avatar || "./avatar-placeholder.png"} className="w-10 rounded-full border border-blue-700 border-2 " />
     <div className="flex w-[150px] z-50 fixed bg-base-300 m-2.5 duration-300 ease-in  opacity-0  flex-col group-hover:opacity-100 gap-2.5 p-2 border border-transparent rounded hover:border-primary/30 justify-start items-start">
     <h3 className="p-2 m-2 rounded-lg bg-blue-900">{authUser.username}</h3>
     <div className="flex gap-3 p-2 border border-2 border-gray-400/30  rounded-lg">
     <LogOut className="w-full h-full bg-blue-400 p-2 rounded-full" onClick={handleLogout} color="white" size={10} />
     <Settings  className="rounded-full w-full h-full bg-green-400 p-2"
     color="green"  onClick={() => navigate("/settings")} size={20} />
     </div>
     </div>
     </div>
     )}
     <div className="h-1 bg-gray-700/70 rounded w-full " />
     </div>
     
     <div className="gap-2.5 flex flex-col">
     <div><img src="./Server.png" className="w-10 rounded-full" /></div>
     <div className="h-1 bg-blue-700/70 rounded w-full " />
     </div>
     
     <div className="flex flex-col gap-2.5">
     <div className="p-1">
      <div onClick={handleNewServer} className="flex p-2 w-10 h-auto bg-gray-700/40 justify-center items-center rounded-full"><Plus  color="gray"/></div>
      </div>

      <div className="w-full flex flex-col gap-2.5 p-1 min-h-[160px] max-h-[320px] rounded-full overflow-hidden overflow-y-scroll bg-base-300">
        <div><img src="./Server.png" className="w-10 rounded-full" />
        </div>
      </div>

     </div>
     </div>
    </>
  );
}

export default Sidebar;
