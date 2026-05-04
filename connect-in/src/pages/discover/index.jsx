import { BASE_URL } from '@/config'
import { getAllUsers } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css"
import { useRouter } from 'next/router'

export default function DiscoverPage() {

    const authState = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    useEffect(() => {
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUsers())
        }
    }, [])

    const router = useRouter();

    return (
        <UserLayout>
            <DashboardLayout>
                <div>
                    <h1>Discover</h1>
                    <div className={styles.allUserProfile}>
                        {authState.all_profiles_fetched && authState.user?.userId && (
                            authState.all_users
                                .filter((user) => user?.userId?._id !== authState.user.userId._id)
                                .map((user) => {
                                    return (
                                        <div
                                            key={user._id}
                                            onClick={() => {
                                                router.push(`/view_profile/${user.userId.username}`);
                                            }}
                                            className={styles.userCard}
                                        >
                                            <img
                                                className={styles.userCard_image}
                                                src={`${BASE_URL}/${user?.userId?.profilePicture}`}
                                                onError={(e) => (e.target.src = "/default.png")}
                                            />
                                            <div>
                                                <h1>{user?.userId?.name}</h1>
                                                <p>@{user?.userId?.username}</p>
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </UserLayout>
    )
}
