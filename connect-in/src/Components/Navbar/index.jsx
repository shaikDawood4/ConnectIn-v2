import React, { useEffect } from 'react'
import styles from "./styles.module.css" 
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';
export default function Navbar() {
    const authState = useSelector((state)=> state.auth);
    const router = useRouter();
    const dispatch = useDispatch();


   

  return (
    <div className={styles.container}> 
    <nav className={styles.navBar}>
         {/* connectIn  */}
    <h1 style={{cursor:"pointer"}} onClick={()=>{
        router.push("/")
    }}>ConnectIn</h1>
         {/* options */}
         <div className={styles.navBarOptionContainer}>

        {authState.isTokenThere && <div>
            <div style={{display:"flex", gap : "1.2rem"}}>
               
        {authState.isTokenThere     &&    <p onClick={()=>{
                router.push("/profile")
            }} style={{fontWeight:"bold", cursor:"pointer"}}>Profile</p>}
             <p onClick={()=>{
                  dispatch(reset()); 
                localStorage.removeItem("token")
                router.push("/")

             }} style={{fontWeight:"bold", cursor:"pointer"}}>Logout</p>
            </div>
            </div>}


            {!authState.profileFetched &&  <div  onClick={()=>{
                 dispatch(reset())
                router.push("/login")
               
            }}  className={styles.buttonJoin} >
                <p>Be A Part</p>

            </div>}
            
         </div>
    </nav>
    </div>
  )
}
