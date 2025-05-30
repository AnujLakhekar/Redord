import { useEffect, useState, useRef } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { io } from "socket.io-client";
// pages
import {useParams} from "react-router-dom"

import { CiMenuKebab } from "react-icons/ci";
import {getSocket} from "../Socket.js"


function Chat() {
  const [message, setMessage] = useState("");
  const {id} = useParams()
  const chatRef = useRef(null)
  const [chat, setChat] = useState([]);
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);
  
  let socket = getSocket();
    
  const {data:loadMsg, isLoading} = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      try {
        const res = await fetch(`https://redordbackend.onrender.com/api/messages/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include'
        })
        
        const data = await res.json()
        
        setChat(data.message)
        
        return data
      }
      catch (e) {
        throw new Error(e.message)
      }
    }
  })



  useEffect(() => {
    if (authUser?._id) {
    
    
      socket.on("receive_message", (msg) => {
       queryClient.invalidateQueries({ queryKey: ['messages'] });
      });
      
      const msgs =  loadMsg;
  
      return () => {
        socket.off("receive_message");
      };
    }
  }, [authUser]);
  
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [message])

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit("send_message", message);
      setMessage("");
    }
  };
  
  const {mutate:deleteMsgFunc, isPending:isDeleting} = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(`https://redordbackend.onrender.com/api/messages/delete/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include'
        })
        
        const data = await res.json()
        
        setChat(data.message)
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        return data
      }
      catch (e) {
        throw new Error(e.message)
      }
    }
  })
  
  
  function deleteMsg(msgId) {
     deleteMsgFunc(msgId)
  }


  return (
    <div className="w-full relatibe">
      <div  className="w-full h-[80vh] overflow-hidden overflow-y-scroll">
        {chat.map((msg, index) => (
          <div key={index} className="duration-300 ease-in  w-full flex columns-1 min-h-[50px] gap-2.5 p-2 bg-base-200 items-center justify-start border  border-transparent border-t-gray-500/30">
          <div className="relative w-full flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
           <img className="w-8 h-8  rounded-full" src={msg?.user.avatar || "./avatar-placeholder.png"} alt={msg?.user.name}/>
           <p style={{color: "msg?.user.?role?.color"}} key={index}>{msg?.user.name}</p>
           </div>
           
          <div className="ml-1 w-full p-2 bg-base-100 rounded-lg">
          <div className="relative flex justify-start items-center" >
          <p>{msg?.content}</p>
          <div className="absolute right-0 flex flex-col">
          {msg?.user?.name == authUser?.username && <div className="group relative">
          <CiMenuKebab />
          <div className="p-2 m-2 absolute left-[-70px] bg-base-300 hidden group-hover:flex flex-col">
          <button  onClick={() => deleteMsg(msg?._id)}>Delete</button>
          </div>
          </div>}
           </div>
          </div>
          
          </div>
          
          {/* timeing and isEdited */}
          <div>
          {msg.isEdited ? <p className="absolute right-0 top-1 text-gray-700">Edited</p> : ""}
          </div> 
          
          </div>
           <div>
          </div>
          </div>
        ))}
        <div ref={chatRef} ></div>
      </div>
      <div className="absolute bottom-0 p-4 bg-base-100 border border-t-primary/50 flex flex-col border-transparent ">
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-base-100 w-[75%] p-1"
          placeholder="Type message"
        />
        <button className="p-2 bg-primary/30 border-2 border-primary rounded-lg text-primary" type="submit">Send</button>
      </form>
      </div>
    </div>
  );
}

export default Chat;
