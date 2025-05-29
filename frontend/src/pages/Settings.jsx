import react,{ useState, useEffect, useRef } from 'react'
import { useQueryClient } from "@tanstack/react-query";
import {X} from "lucide-react"

import {formatMemberSinceDate} from "../utilits/Date.js"
import {TopBar} from "../components/"

function Settings() {
  const queryClient = useQueryClient();
  const [authUser, setAuthUser] = useState(null)
  const [editPanel, setEditPanelOpen] = useState(false)
  const [Image, setImage] = useState(null)
  const user = queryClient.getQueryData(["authUser"])
  const logo = useRef(null)
  
  useEffect(() => {
    if (user) {
      setAuthUser(user)
    } else {
      setAuthUser(null)
    }
  }, [user])
  
  function handleChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader()
    
    let imagUrl;
    
    reader.onload = (e) => {
       imagUrl = e.target.result;
       const ImageArr = {
         src: imagUrl,
         name: file.name.split(".")[0],
         type: file.type.split("/")[1]
       }
      setImage(ImageArr);
    }
    
    
    
    reader.readAsDataURL(file)
  }
  
  if (!authUser) return <div>...loading </div>
  
  return (
    <div className="flex flex-col">
    <TopBar path="/" />
    <div className="m-2.5 ">
     <div className="p-3 skeleton bg-base-300 w-[250px] h-auto rounded-lg flex flex-col gap-2.5 justify-center items-center">
     <div className="flex gap-5">
     <img src={authUser?.avatar || "./avatar-placeholder.png" || "undefined"} className="rounded-full w-16 h-16 border border-4 border-blue-700" />
      <div className="flex flex-col gap-2.5">
       <h3>{authUser?.username || "undefined"}</h3>
       <p className="text-sm text-gray-600">{formatMemberSinceDate(authUser?.createdAt || "undefined")}</p>
      </div>
      </div>
      <div className="flex w-full mt-5 gap-5">
       <button className="p-2 duration-200 ease-in hover:bg-red-600 w-[120px] font-bold  text-red-300 bg-red-600/60 hover:text-red-100 rounded-lg">Delete</button>
       <button onClick={() => setEditPanelOpen(!editPanel)} className="p-2 duration-200 ease-in hover:bg-blue-600 text-blue-300 font-bold hover:text-blue-100 w-[120px] bg-blue-600/60 rounded-lg">Edit</button>
      </div>
     </div>
      {editPanel && 
  <div className="fixed backdrop-blur-md  left-0 top-0 flex justify-center items-center z-50  w-full h-screen">
      <div 
      className="p-3 rounded-lg border-2 border-blue-700/30 backdrop-blur-md w-[300px] h-[380px] bg-base-100" 
      >
      <div className="flex flex-col gap-2.5">
      <div className="relative right-[-90%]" onClick={() => setEditPanelOpen(false)} ><X /></div>
      <div>
       <div>
        <input ref={logo} className="hidden" onChange={handleChange} accept="image/*" type="file" />
        <div>
        {Image ?  <div className="relative border flex overflow-scroll  justify-center items-center object-cover  rounded-lg border-2 border-gray-700/30 " >
        <img className="w-12  h-12 m-2 rounded-full  h-auto" src={Image.src} />
        <div  >
        <h3 className="text-[10px]">{Image?.name}</h3>
        <h3 className="text-sm">{Image?.type}</h3>
        </div>
        <div className="absolute bg-amber-50 top-0 right-0 rounded-full p-1" >
        <X color="black" onClick={() => setImage(null)} />
        </div>
        </div> : <div className="w-full border rounded-lg border-2 border-gray-700/30 h-32 flex justify-center items-center text-gray-500" onClick={() => logo.current.click()}>logo</div> }
        </div>
       </div>
       
       <div className="m-2.5">
        <form >
       <div className="grid gap-2 grid-rows-4 grid-cols-2">
         <input className="bg-base-300 rounded-lg p-1 border-2 border-blue-700/30 " placeholder="username" id="username" name="username" />
         <input className="bg-base-300 rounded-lg p-1 border-2 border-blue-700/30 " placeholder="old password" id="old_password" name="old_password"/>
         <input className="bg-base-300 rounded-lg p-1 border-2 border-blue-700/30 " placeholder="new password" name="new_password" id="new_password" />
         <input className="bg-base-300 rounded-lg p-1 border-2 border-blue-700/30 " placeholder="status" id="status" name="status" />
         <input className="bg-base-300 rounded-lg p-1 border-2 border-blue-700/30 " placeholder="email" id="email" name="email" />
         <input type="number" className="bg-base-300 rounded-lg p-1 border-2 border-blue-700/30 " placeholder="mobile number" id="number" name="number" />
       </div>
       <button className="w-full bg-blue-700/70 p-1 rounded-lg font-bold">update</button>
        </form >
       </div>
       
      </div>
      </div>
      </div>
    </div>
      }
    </div>
    </div>
    )
}


export default Settings