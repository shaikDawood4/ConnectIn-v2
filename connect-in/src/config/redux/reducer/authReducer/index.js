//business logic 


import { createSlice } from "@reduxjs/toolkit"
import { getAboutUser, getAllUsers, getConnectionsRequest, getMyconnectionRequests, loginUser,registerUser, searchUser } from "../../action/authAction"

//1
const initialState = {
    user : {},
    isError : false,
    isSuccess : false,
    isLoading : false,
    loggedIn : false,
    message : "",
    isTokenThere : false,
    profileFetched : false,
    connections : [],
    connectionRequest : [],
    all_users : [],
    searchedUsers : [],
    searchedUser : false,
    all_profiles_fetched: false
}


// 2
const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers :{
        reset : ()=> initialState,
        handleLoginUser : (state) =>{
            state.message = "hello"
        },
        emptyMessage : (state) =>{
            state.message =""
        },
        setTokenIsThere : (state)=>{
            state.isTokenThere = true
        },
        setTokenIsNotThere : (state)=>{
            state.isTokenThere = false
        },
        clearSearchedUsers : (state)=>{
           state.searchedUsers = []
}
    },
    extraReducers :(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading = true,
            state.message = "knocking the door..."
        })

        .addCase(loginUser.fulfilled,(state,action) =>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "login is successful"
        })

        .addCase(loginUser.rejected, (state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload
        })

        .addCase(registerUser.pending, (state)=>{
           state.isLoading= true;
           state.message = "registering you...."
        })
        .addCase(registerUser.fulfilled, (state,action)=>{
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "Registeration is successful"
        })
        .addCase(registerUser.rejected, (state,action)=>{
            state.isError = true,
            state.isLoading = false,
            state.message = action.payload;
        })

        .addCase(getAboutUser.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload.userProfile
        })
        .addCase(getAllUsers.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.all_profiles_fetched = true;
            state.all_users = action.payload.profiles
        })
        .addCase(getConnectionsRequest.fulfilled,(state,action)=>{
            state.connections = action.payload
        })
        .addCase(getConnectionsRequest.rejected,(state,action)=>{
            state.message = action.payload
        })
        .addCase(getMyconnectionRequests.fulfilled, (state,action)=>{
            state.connectionRequest = action.payload
        })
        .addCase(getMyconnectionRequests.rejected, (state,action)=>{
            state.message = action.payload
        })
        .addCase(searchUser.fulfilled,(state,action)=>{
            state.searchedUsers = action.payload.userProfiles;
            state.searchedUser = true
            state.isLoading = false;
        })
        .addCase(searchUser.pending, (state)=>{
            state.isLoading = true;
            state.searchedUser = true
            state.message = "searching..."
        })
        .addCase(searchUser.rejected, (state,action)=>{
            state.message = action.payload
            state.searchedUser = true
            state.isLoading = false;
        })
    }
})

export const {reset,emptyMessage, setTokenIsThere, setTokenIsNotThere,clearSearchedUsers} = authSlice.actions  // what are we even doing ? 


export default authSlice.reducer // authSlice ke undar ka mamlaaaa