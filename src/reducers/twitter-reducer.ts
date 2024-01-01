/**
 * Cesar Guerrero
 * 09/16/23
 * 
 * @file This reducer will keep track of the Twitter data we receive from the server
 */

import {createSlice} from "@reduxjs/toolkit";

import { loadTwitterOAuthThunk, getTwitterUserDataThunk} from "../thunks/twitter-thunk";
import { logoutThunk } from "../thunks/authentication-thunk";

let sliceState: any = {
    twitterOauthReady: false,
    twitterOauthToken: null,
    //Variables below populated once the dashboard loads
    twitterUsername: "",
    twitterImage: null,
    followerCount: 0,
    followingCount: 0,
    tweetCount: 0,
    creationDate: "", //This will already be a formatted string
    syncDate: "",
    syncTime: null, //We don't want to overwhelm the server so we need to keep track of the last ping
}

const twitterSlice = createSlice({
    name:"twitter",
    initialState:sliceState,
    reducers:{        
    },

    extraReducers: (builder) =>{
        //Ensure that the OAuth Flow is ready to go for twitter
        builder.addCase(loadTwitterOAuthThunk.fulfilled, (state,action) => {
            state.twitterOauthReady = action.payload['oauth_ready'];
            if(state.twitterOauthReady === true){
                state.twitterOauthToken = action.payload['oauth_token'];
            }
        })

        builder.addCase(loadTwitterOAuthThunk.rejected, (state,action) => {
            state.twitterOauthReady = false;
            state.twitterOauthToken = null;
            state.twitterUsername = "";
            state.twitterImage = null;
            state.followerCount = 0;
            state.followingCount = 0;
            state.tweetCount = 0;
            state.creationDate = "";
            state.syncDate = "";
            state.syncTime = null;

        })

        //Log the user out
        builder.addCase(logoutThunk.fulfilled, (state,action) => {
            state.twitterOauthReady = false;
            state.twitterOauthToken = null;
            state.twitterUsername = "";
            state.twitterImage = null;
            state.followerCount = 0;
            state.followingCount = 0;
            state.tweetCount = 0;
            state.creationDate = "";
            state.syncDate = "";
            state.syncTime = null;
        })

        //Get the User Data for a Twitter User
        builder.addCase(getTwitterUserDataThunk.fulfilled, (state,action) => {
            if(action.payload['status_code'] === 200){
                state.twitterUsername = action.payload['username']
                state.twitterImage = action.payload['profile_image_url']
                state.followerCount = action.payload['following_count']
                state.followingCount = action.payload['followers_count']
                state.tweetCount = action.payload['tweet_count']
                state.creationDate = action.payload['created_at']
                
                let newDate = new Date();
    
                state.syncTime = newDate.getTime()
                state.syncDate = `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`
            }
        })

        builder.addCase(getTwitterUserDataThunk.pending, (state,action) => {
            state.twitterUsername = ""
            state.twitterImage = null
            state.followerCount = 0
            state.followingCount = 0
            state.tweetCount = 0
            state.creationDate = ""
        })

        builder.addCase(getTwitterUserDataThunk.rejected, (state,action) => {
            state.twitterUsername = ""
            state.twitterImage = null
            state.followerCount = 0
            state.followingCount = 0
            state.tweetCount = 0
            state.creationDate = ""
        })
    }
})

export default twitterSlice.reducer