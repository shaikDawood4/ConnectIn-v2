import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
    "user/login",  // why user/login  
    async(user, thunkAPI) =>{
        try{
            const response = await clientServer.post("/login",{  // why only /login ?
                email : user.email,
                password : user.password
            });

            if(response.data.token){
                localStorage.setItem("token", response.data.token)
            }else{
                return thunkAPI.rejectWithValue({  // kinda action hai, action ke undar payload hota hai. 
                    message: "token not provided"
                })
            }

            return thunkAPI.fulfillWithValue(response.data);   ///kinda action hai and ye humara payload 
        }catch(err){
            return thunkAPI.rejectWithValue(err.response?.data?.message  || "Something went wrong") ;  // if reponse hai tho if data hai tho ? uske undar message.
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async(user,thunkAPI)=>{  // function ready 
        try{
         const request = await clientServer.post("/register" ,{
            username : user.username,
            password : user.password,
            email:user.email,
            name:user.name
            
         })
         
         
          return thunkAPI.fulfillWithValue(request.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Something went wrong")
        }

    }
)



export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user, thunkAPI)=>{
        try{
         const response = await clientServer.get("/get_user_and_profile",   {  params : {token : user.token }   } );
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)



export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async(_, thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/get_all_users")
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const  sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.post("/user/send_connection_request",{
                token : user.token,
                connectionId : user.user_id
            })
            thunkAPI.dispatch(getConnectionsRequest({token:user.token}));
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.message.data.message);
        }
    }
)

export const getConnectionsRequest = createAsyncThunk(
    "user/getConnectionsRequest",
    async(user, thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/getConnectionRequests",{
                params : {
                    token : user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data.connections);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
)


export const getMyconnectionRequests = createAsyncThunk(
    "user/getMyconnectionRequests",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/user_connection_request",{
                params : {
                    token : user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data.connections);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
)


export const AcceptConnection = createAsyncThunk(
    "user/acceptConnection", 
    async(user, thunkAPI)=>{
        try{
            const response = await clientServer.post("/user/accept_connection_request", {
                token : user.token,
                requestId : user.connectionId,
                actionType : user.actionType
                
            })
            thunkAPI.dispatch(getMyconnectionRequests({token : user.token}))  // for quick refresh 
            thunkAPI.dispatch(getConnectionsRequest({token : user.token}))

            return thunkAPI.fulfillWithValue(response.data)
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
)