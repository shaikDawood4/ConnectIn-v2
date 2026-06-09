import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./index.module.css";
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { BASE_URL } from '@/config';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch();

 

  
  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAllUsers());
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
    }
  }, [authState.isTokenThere]);

  return (
    <div className="container">
      <div className={styles.homeContainer}>

        {/* LEFT SIDEBAR */}
        <div className={styles.homeContainer_leftBar}>
          <div onClick={() => router.push("/dashboard")} className={styles.sideBarOption}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <p>Scroll</p>
          </div>

          <div onClick={() => router.push("/discover")} className={styles.sideBarOption}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p>Discover</p>
          </div>

          <div onClick={() => router.push("/my_connections")} className={styles.sideBarOption}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <p>My Connections</p>
          </div>
        </div>

        {/* FEED */}
        <div className={styles.homeContainer_feedContainer}>
          {children}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className={styles.homeContainer_extraContainer}>
          <h3>Top Profiles</h3>
          {authState.all_users?.map((profile) => {
            return (
              <div onClick={()=>{router.push(`/view_profile/${profile.userId.name}`)}} style={{display:"flex",cursor:"pointer", margin:"0.5rem"}} key={profile._id} className={styles.extraContainer_profile}>
                <img style={{height:"1.5rem", width:"1.5rem", marginRight:"1rem", borderRadius:"50%"}} src={`${BASE_URL}/${profile.userId.profilePicture}`} alt="" />
                <p>{profile.userId.name}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className={styles.mobileNavBar}>
        <div onClick={() => router.push("/dashboard")} className={styles.singleNavItemHolder_mobileView}>
          <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>

        <div onClick={() => router.push("/discover")} className={styles.singleNavItemHolder_mobileView}>
          <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>

        <div onClick={() => router.push("/my_connections")} className={styles.singleNavItemHolder_mobileView}>
          <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
