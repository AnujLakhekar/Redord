import react,{ useState, useEffect } from 'react'
import { useQueryClient } from "@tanstack/react-query";


function HomePage() {
  const [authUser, setAuthUser] = useState(null)
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["authUser"]);
  
  var isAnyServerOpen = false;
  
  useEffect(() => {
    setAuthUser(user);
  }, [user])

  return (
    <>
   <div className="w-full">
   {authUser && (
   <div> 
   {isAnyServerOpen ? "" : (
     <div className="flex flex-col text-center w-full justify-center items-center h-screen">
        <div className="flex text-center font-bold flex text-4xl ">
         <p className="animate-pulse">[</p>
         <p className="animate-pulse  animate-bounce">-</p>
         <p className="animate-pulse  animate-bounce">_</p>
         <p className="animate-pulse  animate-bounce">-</p>
         <p className="animate-pulse">]</p>
        </div>
       <h3 className="font-bold text-gray-400 m-2.5">open chats & server</h3>
     </div>
     )}
   </div>
   )}
   </div>
    </>
  )
}

export default HomePage
