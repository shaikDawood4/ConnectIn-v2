import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/dashboardLayout';
import UserLayout from '@/layout/userLayout';
import React, { useEffect, useState } from 'react';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionsRequest, getMyconnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("none");
  // "none" | "pending" | "connected"



  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getAllPosts());
      dispatch(getConnectionsRequest({ token }));
      dispatch(getMyconnectionRequests({token}))
    }
  }, []);

  useEffect(() => {
    if (!postReducer?.posts || !router.query.username) return;

    const post = postReducer.posts.filter((post) => {
      return post.userId?.username === router.query.username;
    });

    setUserPosts(post);
  }, [postReducer.posts, router.query.username]);

  useEffect(() => {
  if (!userProfile?.userId?._id) return;

  const sentConnection = authState.connections?.find(
    (user) => user.connectionId?._id === userProfile.userId._id
  );

  const receivedConnection = authState.connectionRequest?.find(
    (user) => user.userId?._id === userProfile.userId._id
  );

  console.log("sentConnection:", sentConnection);
  console.log("receivedConnection:", receivedConnection);

  if (
    sentConnection?.status_accepted === true ||
    receivedConnection?.status_accepted === true
  ) {
    setConnectionStatus("connected");
  } 
  else if (sentConnection || receivedConnection) {
    setConnectionStatus("pending");
  } 
  else {
    setConnectionStatus("none");
  }

}, [authState.connections, authState.connectionRequest, userProfile?.userId?._id]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="profile"
            />
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>
                </div>

                <div style={{ display: "flex" , alignItems:"center", gap:"1.2rem"}}>
                  {connectionStatus === "connected" ? (
                    <button className={styles.connectedButton}>Connected</button>
                  ) : connectionStatus === "pending" ? (
                    <button className={styles.connectedButton}>Pending</button>
                  ) : (
                    <button
                      className={styles.connectBtn}
                      onClick={() => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            user_id: userProfile.userId._id,
                          })
                        );
                      }}
                    >
                      Connect
                    </button>
                  )}
        
                  <div onClick={async()=>{
                    const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`)
                    window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                  }} style={{cursor:"pointer"}}>
                    
                    <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <p>Save To PDF</p>
                  </div>
                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>

                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img src={`${BASE_URL}/${post.media}`} alt="post" />
                          ) : (
                            <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                          )}
                        </div>

                        <p>{post.body}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {userProfile.pastWork.map((work, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>{work.company} - {work.position}</p>
                    <p>{work.years}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: {
      username: context.query.username,
    },
  });

  return { props: { userProfile: request.data.profile } };
}