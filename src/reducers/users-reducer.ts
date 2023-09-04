/**
 * Cesar Guerrero
 * 08/26/23
 * 
 * @file This reducer will keep track of whether the user is logged in
 */

import {createSlice} from "@reduxjs/toolkit";

//Import pertinent Thunks
import { authorizeOAuthThunk, isLoggedInThunk, loadOAuthThunk, logoutThunk } from "../services/thunks/authentication-thunk";

export enum authorizationStatus{
    REJECTED,
    PENDING,
    APPROVED
}

//NOTE: Address why we have to define this initial state as type: any... Doesn't make sense
let sliceState: any = {
    currentUser: null,
    oauthReady: false,
    oauthToken: null,
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
                state.currentUser = null;
            }else{
                state.currentUser = action.payload['current_user']
            }
        })

        builder.addCase(isLoggedInThunk.rejected, (state,action) => {
            state.currentUser = null
        })



        //Ensure that the OAuth Flow is ready to go
        builder.addCase(loadOAuthThunk.fulfilled, (state,action) => {
            state.oauthReady = action.payload['oauth_ready'];
            if(state.oauthReady === true){
                state.oauthToken = action.payload['oauth_token'];
                state.authorizationApproved = authorizationStatus.PENDING;
                state.authorizationStatusMessage = 'PENDING';
            }
        })

        builder.addCase(loadOAuthThunk.rejected, (state,action) => {
            state.oauthReady = false;
            state.oauthToken = null;
            state.authorizationApproved = authorizationStatus.PENDING;
            state.authorizationStatusMessage = '...';
        })



        //Complete the authorization
        builder.addCase(authorizeOAuthThunk.fulfilled, (state,action) => {
            state.authorizationApproved = authorizationStatus.APPROVED ? action.payload['oauth_approved'] === true : authorizationStatus.REJECTED
            if(state.authorizationApproved === authorizationStatus.APPROVED){
                state.currentUser = action.payload['current_user']
                state.authorizationStatusMessage = 'APPROVED'
            }else{
                state.currentUser = null
                state.authorizationStatusMessage = 'REJECTED'
            }
        })

        builder.addCase(authorizeOAuthThunk.pending, (state,action) => {
            state.currentUser =  null
            state.authorizationApproved = authorizationStatus.PENDING
            state.authorizationStatusMessage = 'PENDING'
        })

        builder.addCase(authorizeOAuthThunk.rejected, (state,action) => {
            state.currentUser = null
            state.authorizationApproved = authorizationStatus.REJECTED
            state.authorizationStatusMessage = 'REJECTED'

        })
        


        //Log the user out
        builder.addCase(logoutThunk.fulfilled, (state,action) => {
            state.currentUser = null
            state.oauthReady = false
            state.oauthToken = null
            state.authorizationApproved = authorizationStatus.PENDING
            state.authorizationStatusMessage = '...'
        })
    }
})

export default userSlice.reducer