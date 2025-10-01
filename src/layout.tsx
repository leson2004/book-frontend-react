import {useCurrentApp} from '@/components/context/app.context'
import { useEffect } from "react";

import { Outlet } from "react-router-dom";
import Header from "./components/layouts/app.header";
import { fetchAccountApi } from './services/api';
function Layout() {
  const {setUser,isLoading}=useCurrentApp()
  useEffect(()=>{
    const fetchAccountUser =async()=>{
        const res = await fetchAccountApi();
        if(res.data){
          setUser(res.data.user);
        }
    }
    fetchAccountUser()
  },[])
  return (
    <>
       <div>
          
          <Header/>
          <Outlet />
       </div>
      
    </>
  )
}

export default Layout
