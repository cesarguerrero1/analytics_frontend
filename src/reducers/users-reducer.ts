/**
 * Cesar Guerrero
 * 08/26/23
 * 
 * @file This reducer will keep track of whether the user is logged in
 */

import {createSlice} from "@reduxjs/toolkit";

//Import pertinent Thunks
import { isLoggedInThunk, logoutThunk } from "../thunks/authentication-thunk";
import { authorizeTwitchOAuthThunk } from "../thunks/twitch-thunk";
import { authorizeTwitterOAuthThunk } from "../thunks/twitter-thunk";

//We are using this to ensure our callback page is able to redirect accordingly
export enum authorizationStatus{
    REJECTED,
    PENDING,
    APPROVED
}

//Add more apps as needed -- Used for redirecting to the correct dashboard
export enum selectedApp{
    TWITTER,
    TWITCH
}

//NOTE: Address why we have to define this initial state as type: any... Doesn't make sense
let sliceState: any = {
    loggedIn: false,
    app: null,
    authorizationApproved: authorizationStatus.PENDING, //After we redirected the user, did they approve our app
    authorizationStatusMessage: "..."
}

const userSlice = createSlice({
    name:"users",
    initialState:sliceState,
    reducers:{
    },

    //Handle Async Calls
    extraReducers: (builder) => {

        //Check if user is logged in
        builder.addCase(isLoggedInThunk.fulfilled, (state,action) => {
            if(action.payload['is_logged_in'] === false){
                state.loggedIn = false;
                state.app = null;
                state.authorizationApproved = authorizationStatus.PENDING
            }else{
                state.loggedIn = true;
                state.authorizationApproved = authorizationStatus.APPROVED
                if(action.payload['app'] === "Twitch"){
                    state.app = selectedApp.TWITCH
                }else if(action.payload['app'] === "Twitter"){
                    state.app = selectedApp.TWITTER
                }
                
            }
        })

        builder.addCase(isLoggedInThunk.rejected, (state,action) => {
            state.loggedIn = false
            state.app = null
            state.authorizationApproved = authorizationStatus.PENDING
        })


        //Complete the authorization for TWITTER
        builder.addCase(authorizeTwitterOAuthThunk.fulfilled, (state,action) => {
            if(action.payload['oauth_approved'] === true){
                state.loggedIn = true
                state.app = selectedApp.TWITTER
                state.authorizationApproved = authorizationStatus.APPROVED
                state.authorizationStatusMessage = 'APPROVED'
            }else{
                state.loggedIn = false
                state.app = null
                state.authorizationApproved = authorizationStatus.REJECTED
                state.authorizationStatusMessage = 'REJECTED'
            }
        })

        builder.addCase(authorizeTwitterOAuthThunk.pending, (state,action) => {
            state.loggedIn = false
            state.app = null
            state.authorizationApproved = authorizationStatus.PENDING
            state.authorizationStatusMessage = 'PENDING'
        })

        builder.addCase(authorizeTwitterOAuthThunk.rejected, (state,action) => {
            state.loggedIn = false
            state.app = null
            state.authorizationApproved = authorizationStatus.REJECTED
            state.authorizationStatusMessage = 'REJECTED'

        })


        //Complete the authorization for TWITCH
        builder.addCase(authorizeTwitchOAuthThunk.fulfilled, (state,action) => {
            if(action.payload['oauth_approved'] === true){
                state.loggedIn = true
                state.app = selectedApp.TWITCH
                state.authorizationApproved = authorizationStatus.APPROVED
                state.authorizationStatusMessage = 'APPROVED'
            }else{
                state.loggedIn = false
                state.app = null
                state.authorizationApproved = authorizationStatus.REJECTED
                state.authorizationStatusMessage = 'REJECTED'
            }
        })

        builder.addCase(authorizeTwitchOAuthThunk.pending, (state,action) => {
            state.loggedIn =  false
            state.app = null
            state.authorizationApproved = authorizationStatus.PENDING
            state.authorizationStatusMessage = 'PENDING'
        })

        builder.addCase(authorizeTwitchOAuthThunk.rejected, (state,action) => {
            state.loggedIn = false
            state.app = null
            state.authorizationApproved = authorizationStatus.REJECTED
            state.authorizationStatusMessage = 'REJECTED'

        })
        

        //Log the user out
        builder.addCase(logoutThunk.fulfilled, (state,action) => {
            state.loggedIn = false
            state.app = null
            state.authorizationApproved = authorizationStatus.PENDING
            state.authorizationStatusMessage = '...'
        })
    }
})

export default userSlice.reducer