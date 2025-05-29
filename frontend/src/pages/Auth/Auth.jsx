import react,{ useState, useRef, useEffect } from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaCannabis } from "react-icons/fa6";
import {useMutation, useQuery} from "@tanstack/react-query"
import { GoogleLogin } from '@react-oauth/google';
import Cookies from "js-cookie";
import { useNavigate, Link } from 'react-router-dom';

function Auth({type}) {
  const [authUser, setAuthUser] = useState(null)
  const [Type, setType] = useState(null)
  const [isPending, setIspending] = useState(false);
  const [isAuthing, setIsAuthing] = useState(false);
  const [form, setForm] = useState(false);
  const [googleError, setGoogleError] = useState(false);
  const div_form = useRef(null)
  const googleRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const boolean = type == "login";
    setType(boolean)
  }, [type])
  
  const {mutate:findAndLoginAccount, isPending:isLogging, error:loginError} = useMutation({
    mutationFn: async () => {
      try {
  
        const url = `https://redordbackend.onrender.com/api/auth/${type}`
        
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form)
        })
        
          const data = await res.json()
         
        if (!res.ok) {
          throw new Error(data.message)
        }
        
        const token = data.message.client.token;
        
        Cookies.set("jwt",  token, {
          expires: 15, // days
          secure: true,
          sameSite: "None"
          })
        
        
        return data;
      } catch (e) {
        throw new Error(e.message)
        console.log(e.message)
      }
    },
    onError: (e) => {
      throw new Error(e.message)
    },
    onSuccess: () => {
      window.location.reload()
    }
  })
  
  async function handlelogin(e) {
    e.preventDefault();
  const formTemplate = new FormData(div_form.current);
  const newForm = {}
  for ( let [key, value] of formTemplate.entries()) {
    newForm[key] = value;
  }
  setForm(newForm)
  
  findAndLoginAccount()
  }
  async function handleSignin(e) {
    e.preventDefault();
  const formTemplate = new FormData(div_form.current);
  const newForm = {}
  for ( let [key, value] of formTemplate.entries()) {
    newForm[key] = value;
  }
  setForm(newForm)
  
  if (isLogging) {
    throw new Error("Login or signup failed due to multiple requests")
    }
  
  findAndLoginAccount()
  }
  
  function googleAuth(e) {
    e.preventDefault()
    googleRef.current.click()
  }
  
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('https://redordbackend.onrender.com/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      

      const data = await res.json();
      if (!res.ok) {
        setGoogleError(data.message)
      }
      
      const token = data.message.client.token;
      
      Cookies.set("jwt",  token, {
          expires: 15, // days
          secure: true,
          sameSite: "None"
          })
        
      window.location.reload()
    } catch (err) {
      setGoogleError(err)
    }
  };

  return (
    <>
   <div className="flex duration-150 ease-in  w-full h-screen justify-center items-center">
     <form ref={div_form} >
     <div className="w-[300px] duration-300 ease-in rounded-lg p-5 bg-base-200 gap-5 flex flex-col justify-center text-center h-[auto]">
     <div className=" flex justify-center  items-center  gap-2.5 font-bold text-green-500" ><FaCannabis /> Redord</div>
       <div >
        {Type ? "" : <input className="bg-base-200 p-2 m-2 outline-none border border-gray-700 focus:border-secondary rounded-lg" placeholder="username" id="username" name="username" />}
               
        <input className="bg-base-200 p-2 m-2 outline-none border border-gray-700  focus:border-secondary rounded-lg" placeholder="Email" id="email" name="email" />
        <input className="bg-base-200 p-2 m-2 outline-none border border-gray-700 focus:border-secondary rounded-lg" placeholder="password" id="password" name="password" />
        
       </div>
       <div className="flex flex-col gap-4">
       {loginError || googleError && <p className="text-error">{loginError?.message || googleError?.message}</p>}
       <p>{type == "login" ? (<Link to="/signup">New here? <span className="font-bold text-primary">Try one</span></Link>) : (<Link to="/login">Old one? <span className="font-bold text-primary">login</span></Link>)}</p>
       {isLogging ? (<button className="skeleton w-full text-gray-400 font-bold p-2 rounded-lg"  disabled>waiting</button>) : (<button
        onClick={handlelogin}
        className="w-full bg-secondary/70 font-bold p-2 rounded-lg" >{type}</button>)}
       </div>
       </div>
      <div className="divider" />
       <div>
       {isAuthing ? (
       <div className="flex p-2.5 justify-center items-center skeleton rounded-lg m-2 border border-transparent duration-150 ease-in  gap-2.5 font-bold text-gray-400">
        <button disabled>connecting</button>
        </div>
         ) : (<div className="">
        <div>
        <GoogleLogin   onSuccess={handleLoginSuccess} />
        </div>
        </div>)}
       </div>
     </form>
   </div>
    </>
  )
}

export default Auth
