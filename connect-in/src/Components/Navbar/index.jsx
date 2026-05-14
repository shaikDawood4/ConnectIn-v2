import React, { useEffect, useState } from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

export default function Navbar() {

    const router = useRouter();
    const dispatch = useDispatch();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        dispatch(reset());
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/");
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