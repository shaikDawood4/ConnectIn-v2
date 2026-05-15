import UserLayout from '@/layout/userLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./styles.module.css";
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';



export default function LoginComponent() {

  const authState = useSelector((state) => state.auth)    // we have auth in store.js > reducers
  const dispatch = useDispatch();
  const router = useRouter();

  const [userLoginMethod, setuserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");     //sending user to dashboard if logged in
    }
  },[authState.loggedIn, router])


  useEffect(()=>{
   if(localStorage.getItem("token")){   // if token exists ===  user logged in already 
    router.push("/dashboard")
   }
  },[])

  useEffect(()=>{
    dispatch(emptyMessage());  //whenever we want to invoke any action, we need to use dispatch 
  },[userLoginMethod])


const handleRegister = async () => {

   const response = await dispatch(
      registerUser({
         username,
         password,
         email,
         name
      })
   );

   console.log(response.payload)

   if(response.payload?.token){

      localStorage.setItem(
         "token",
         response.payload.token
      );

      router.push("/dashboard");
   }

}

  const handleLogin = () =>{
     dispatch(loginUser({email, password }));

  }
  

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading}> {userLoginMethod ? "Sign In" : "Sign Up"}</p>
            <p style={{ color: authState.isError ? "red" : "green" }}>{typeof authState.message === "string"
                                                                             ? authState.message    
                                                                              : authState.message?.message}</p>
            <div className={styles.inputContainer}>
              {!userLoginMethod && <div className={styles.inputRow}>
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder='enter username' className={styles.inputField} />
                <input onChange={(e) => setName(e.target.value)} type="text" placeholder='enter name' className={styles.inputField} />
              </div> }
              <input onChange={(e) => setEmailAddress(e.target.value)} type="text" placeholder='enter email' className={styles.inputField} />
              <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='enter password' className={styles.inputField} />


              <div onClick={() => {
               if(userLoginMethod){
                handleLogin();
               }else{
                handleRegister();
               } 
               
              }} className={styles.buttonWithOutline}>   {/* this is button's opening part and we also defined the styles for it */}
              
                 <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>

            </div>

          </div>
          <div className={styles.cardContainer_right}>
           
             {userLoginMethod ?   <p>Create a new Account</p> :  <p>Already have an Account</p>}
             <div onClick={() => {
                
               setuserLoginMethod(!userLoginMethod);
              }} style={{color : "black", textAlign: "center"}} className={styles.buttonWithOutline}>
                <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
           

          

          </div>
        </div>
      </div>
    </UserLayout>
  )
}
