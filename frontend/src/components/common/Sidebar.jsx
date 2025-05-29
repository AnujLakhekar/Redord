import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { LogOut, Plus, Settings } from 'lucide-react';
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import {getSocket} from "../../Socket.js"

function Sidebar() {
  const [authUser, setAuthUser] = useState(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["authUser"]);
  const navigate = useNavigate();


   let socket = getSocket();
    

  useEffect(() => {

    setAuthUser(user);

    socket.emit("online_users", user);

    socket.on("online_users_found", (users) => {
      setOnlineUsers(users)
    });

    return () => {
      socket.off("online_users_found");
    };
  });

  const handleLogout = () => {
    Cookies.remove("jwt");
    window.location.reload();
  };

  const handleNewServer = () => {
    console.log("Create new server");
  };

  if (!authUser) return null;

  return (
    <div className="flex p-1 border-r-2 border-r-primary/30 w-20 h-[90vh] flex-col items-center overflow-hidden gap-2.5">
      <div className="flex flex-col items-center">
        <div onClick={() => setSettingsOpen(!isSettingsOpen)} className=" overflow-hidden p-1 h-14">
          <img
            src={authUser.avatar || "./avatar-placeholder.png"}
            className="w-10 rounded-full border-2 border-blue-700"
            alt="avatar"
          />
          <div className={`flex w-[150px] z-50 fixed bg-base-300 m-2.5 duration-300 ease-in ${isSettingsOpen ? "flex opacity-1" : "hidden opacity-0"} flex-col group-hover:opacity-100 gap-2.5 p-2 border border-transparent rounded hover:border-primary/30 justify-start items-start`}>
            <h3 className="p-2 m-2 rounded-lg bg-blue-900 text-white">
              {authUser.username}
            </h3>
            <div className="flex gap-3 p-2 border-2 border-gray-400/30 rounded-lg">
              <LogOut
                className="w-full h-full bg-blue-400 p-2 rounded-full"
                onClick={handleLogout}
                color="white"
                size={10}
              />
              <Settings
                className="rounded-full w-full h-full bg-green-400 p-2"
                color="green"
                onClick={() => navigate("/settings")}
                size={20}
              />
            </div>
          </div>
        </div>
        <div className="h-1 bg-gray-700/70 rounded w-full" />
      </div>

      <div className="gap-2.5 flex flex-col">
      {onlineUsers?.map((user, index) => {
        return (
        <div key={index}>
        <Link to={`/chat/${user.googleId}`}>
          <img src={user.avatar || "./Server.png"} className="w-10 rounded-full" alt="server" />
          </Link>
        </div>
          )
      })}
        <div className="h-1 bg-blue-700/70 rounded w-full" />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="p-1">
          <div
            onClick={handleNewServer}
            className="flex p-2 w-10 h-auto bg-gray-700/40 justify-center items-center rounded-full"
          >
            <Plus color="gray" />
          </div>
        </div>

        <div className="w-full flex flex-col gap-2.5 p-1 min-h-[160px] max-h-[320px] overflow-y-scroll bg-base-300">
          <div>
            <Link to="/chat/id">
              <img src="./Server.png" className="w-10 rounded-full" alt="server icon" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
