import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import Dashboard from '../dashboard'
import DashboardLayout from '@/layout/dashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser } from '@/config/redux/action/authAction'
import styles from "./index.module.css";
import { BASE_URL, clientServer } from '@/config'
import { getAllPosts } from '@/config/redux/action/postAction'
import { current } from '@reduxjs/toolkit'
export default function ProfilePage() {
  const postReducer = useSelector((state) => state.postReducer)
  const authState = useSelector((state) => state.auth);
  const [userProfile, setUserProfile] = useState({});
  const [userPost, setUserPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [inputData, setInputData] = useState({company:"", position:"", years:""})

  const handleWorkInputChange = async(e)=>{
    const {name, value} = e.target
    setInputData({...inputData, [name]: value})
  }


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts({ token: localStorage.getItem("token") }));
  }, [])




  useEffect(() => {
    if (authState?.user?.userId && Array.isArray(postReducer?.posts)) {
      setUserProfile(authState.user);

      const post = postReducer.posts.filter((post) => {
        return post.userId?.username === authState.user?.userId?.username;
      });

      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);



  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post("/update_profile_picture", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }


  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId?.name
    })

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile?.bio,
      currentPost: userProfile?.currentPost,
      pastWork: userProfile?.pastWork,
      education: userProfile?.education
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }


  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId &&
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <div className={styles.backDrop_overlay}>
                <img
                  src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                  alt="profile"
                />
                <label htmlFor='profilePictureUpload' className={styles.editOverlay}>
                  <p>Edit</p>
                </label>
                <input onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }} hidden type="file" id='profilePictureUpload' />
              </div>
            </div>

            <div className={styles.profileContainer_details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <input type="text" className={styles.nameEdit} value={userProfile.userId.name} onChange={(e) => {
                      setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                    }} />
                    <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>
                  </div>





                  <div>
                    <textarea placeholder='Write your bio' onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })} value={userProfile.bio} style={{ width: "100%" , border:'1px solid black'}} rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))} id=""></textarea>
                  </div>

                  <div style={{ flex: "0.2" }}>
                    <h3>Recent Activity</h3>
                    {userPost.map((post) => {
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

                <button className={styles.addWorkButton} onClick={() => {
                  setIsModalOpen(true);
                }}>Add Work</button>
              </div>
            </div>

            {userProfile != authState.user && <div className={styles.updateProfileBtn} onClick={() => {
              updateProfileData()
            }}>
              Update Profile
            </div>}
          </div>
        }

        {isModalOpen &&
          <div onClick={() => {
            setIsModalOpen(false);
          }} className={styles.commentsContainer}>
            <div onClick={(e) => {
              e.stopPropagation();
              
            }} className={styles.allCommentsContainer}>

              <input onChange={(e) => handleWorkInputChange(e)} type="text" name='company' placeholder='Enter Company' className={styles.inputField} />
              <input onChange={(e) => handleWorkInputChange(e)} type="text" name='position' placeholder='Enter Position' className={styles.inputField} />
              <input onChange={(e) => handleWorkInputChange(e)} type="number" name='years' placeholder='Years' className={styles.inputField} />
              <div className={styles.updateProfileBtn} onClick={() => {
                setUserProfile({...userProfile, pastWork : [...userProfile.pastWork, inputData]})
                setIsModalOpen(false);
              }}>
                Add Work
              </div>

            </div>
          </div>}
      </DashboardLayout>
    </UserLayout>
  )
}
