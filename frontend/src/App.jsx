import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate, Navigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {Sidebar} from "./components/"
import { io } from "socket.io-client";
// pages
import {initSocket} from "./Socket.js"
import { HomePage, Auth, Settings, Chat } from './pages';

function App() {
  const [authUser, setAuthUser] = useState(null);

   let socket;

  
  const { data, isLoading, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch('https://redordbackend.onrender.com/api/auth/me', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          },
        credentials: 'include', // needed to send cookies
      });

      const data = await res.json();
      if (!res.ok || data.error) return null;
      
      initSocket(data._id)

      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setAuthUser(data);
    } else {
      setAuthUser(null);
    }
  }, [data]);
   
  


  if (isLoading) return <div className="w-full h-screen flex justify-center items-center"><span className="loader loader-lg"></span></div>;

  return (
    <>
      <div>
      <main className="text-gray-200">
          <Routes>
      <Route path="/" element={authUser ? (
      <div className="flex">
      <Sidebar  />
      <HomePage />
      </div>) : <Navigate to="login" />} />
            <Route path="/login" element={authUser ? <Navigate to="/" /> : <Auth type="login" />} />
            <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Auth type="signup" />} />
            <Route path="*" element={<h3>No Page found</h3>} />
      <Route path="/chat/:id" element={authUser ? (
      <div className="flex">
      <Sidebar />
      <Chat />
      </div>) : <Navigate to="/login" />} />
            <Route path="/settings" element={
            <div className="flex">
            {authUser &&             <Sidebar />}
            <Settings />
            </div>} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
