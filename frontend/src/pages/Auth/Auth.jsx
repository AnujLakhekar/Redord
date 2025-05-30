import React, { useState, useRef, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaCannabis } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import { GoogleLogin } from '@react-oauth/google';
import Cookies from "js-cookie";
import { useNavigate, Link } from 'react-router-dom';

function Auth({ type }) {
  const [Type, setType] = useState(null);
  const [googleError, setGoogleError] = useState("");
  const div_form = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setType(type === "login");
  }, [type]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const url = `https://redordbackend.onrender.com/api/auth/${type}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // ✅ fixed
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed");
      return data;
    },
    onSuccess: () => {
      window.location.href = "/"
    }
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(div_form.current);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    mutation.mutate(data);
  };

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('https://redordbackend.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ so cookie will be stored
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok) {
        setGoogleError(data.message || "Google auth failed");
        return;
      }

       window.location.href = "/"
    
    } catch (err) {
      setGoogleError(err.message || "Google login error");
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <form ref={div_form}>
        <div className="w-[300px] rounded-lg p-5 bg-base-200 gap-5 flex flex-col justify-center text-center">
          <div className="flex justify-center items-center gap-2.5 font-bold text-green-500">
            <FaCannabis /> Redord
          </div>

          <div>
            {!Type && (
              <input
                className="bg-base-200 p-2 m-2 outline-none border border-gray-700 focus:border-secondary rounded-lg"
                placeholder="username"
                name="username"
              />
            )}
            <input
              className="bg-base-200 p-2 m-2 outline-none border border-gray-700 focus:border-secondary rounded-lg"
              placeholder="Email"
              name="email"
            />
            <input
              className="bg-base-200 p-2 m-2 outline-none border border-gray-700 focus:border-secondary rounded-lg"
              placeholder="Password"
              type="password"
              name="password"
            />
          </div>

          <div className="flex flex-col gap-4">
            {(mutation.error || googleError) && (
              <p className="text-error">
                {mutation.error?.message || googleError}
              </p>
            )}

            <p>
              {Type ? (
                <Link to="/signup">
                  New here? <span className="font-bold text-primary">Try one</span>
                </Link>
              ) : (
                <Link to="/login">
                  Old one? <span className="font-bold text-primary">Login</span>
                </Link>
              )}
            </p>

            <button
              onClick={handleFormSubmit}
              className={`w-full font-bold p-2 rounded-lg ${mutation.isPending ? "skeleton text-gray-400" : "bg-secondary/70"}`}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Waiting..." : "Connect"}
            </button>
          </div>
        </div>

        <div className="divider" />

        <div className="flex flex-col gap-2 items-center">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => setGoogleError("Google Sign In failed")}
          />
        </div>
      </form>
    </div>
  );
}

export default Auth;
