import React, { useEffect, useState } from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { clearSearchedUsers, reset } from '@/config/redux/reducer/authReducer';
import { searchUser } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';

export default function Navbar() {

    const router = useRouter();
    const dispatch = useDispatch();
    
    const isExcludedPage = router.pathname === "/" || router.pathname === "/signup"  ||  router.pathname === "/login";
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setIsLoggedIn(true);
        }
    }, []);
    const authState = useSelector(state => state.auth);

    
    const handleLogout = () => {
        dispatch(reset());
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/");
    }
const [searchName,setSearchName] = useState("");
const search= ()=>{
    
    dispatch(searchUser({name : searchName}))
}

const searchedProfile = (username)=>{
    router.push(`/view_profile/${username}`)
}

    return (
        <div className={styles.container}>
            <nav className={styles.navBar}>

                <h1
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        router.push("/")
                    }}
                >
                    ConnectIn
                </h1>







             
             
           {!isExcludedPage &&  <div className={styles.searchBox}>
                <input type="text" placeholder=' Search' onChange={(e)=>{setSearchName(e.target.value)}} />
                {authState.searchedUsers.length > 0 &&  <div className={styles.dropBox}>
                    {authState.searchedUsers.map((user)=>{
                        return (
                            <div className={styles.searchedUser} onClick={()=>{searchedProfile(user.userId.username); dispatch(clearSearchedUsers())}}>
                        
                        <img  src={`${BASE_URL}/${user?.userId?.profilePicture}`} className={styles.searchedUserImg} alt="" />
                        <p>{user.userId.username}</p>
                        </div>
                        ) 
                    })}
                </div>}
                
                <button onClick={()=>{search()}}>Search</button>
            </div>}


           





















                <div className={styles.navBarOptionContainer}>

                    {isLoggedIn ? (

                        <div
                            style={{
                                display: "flex",
                                gap: "1.2rem",
                                alignItems: "center"
                            }}
                        >

                            <p
                                onClick={() => {
                                    router.push("/profile")
                                }}
                                style={{
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                My Profile
                            </p>

                            <p
                                onClick={handleLogout}
                                style={{
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    color: "red"
                                }}
                            >
                                Logout
                            </p>

                        </div>

                    ) : (

                        <div
                            onClick={() => {
                                router.push("/login")
                            }}
                            className={styles.buttonJoin}
                        >
                            <p>Be A Part</p>
                        </div>

                    )}

                </div>

            </nav>
        </div>
    )
}
