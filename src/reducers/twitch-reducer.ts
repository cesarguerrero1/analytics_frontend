/**
 * Cesar Guerrero
 * 09/16/23
 * 
 * @file This reducer will keep track of the Twitch data we receive from the server
 */

import {createSlice} from "@reduxjs/toolkit";

import { loadTwitchOAuthThunk, getTwitchUserDataThunk, getTwitchBitsDataThunk,
        getTwitchFollowerDataThunk, getTwitchSubscriberDataThunk,
        getTwitchVideoDataThunk } from "../thunks/twitch-thunk";
        
import { logoutThunk } from "../thunks/authentication-thunk";

let sliceState: any = {
    twitchOauthReady: false,
    twitchClientID: null,
    //Variables below populated once the dashboard loads
    twitchUsername: "",
    twitchImage: null,
    bitsLeaderboardArray: null, //[[name,bitsDonated], etc.]
    followers: 0,
    subscriberPoints: 0,
    subscribers: 0, 
    subscribersTierArray: null,
    videoArray: null, //[[views, durationString], etc.]
    creationDate: "", //This will already be a formatted string
    syncDate: "",
    syncTime: null //Used to ensure that we don't overwhelm the server with requests
}  

const twitchSlice = createSlice({
    name:"twitch",
    initialState:sliceState,
    reducers:{        
    },

    extraReducers: (builder) =>{
        //Ensure that the Oauth Flow is ready to go for Twitch
        builder.addCase(loadTwitchOAuthThunk.fulfilled, (state,action) => {
            state.twitchOauthReady = action.payload['oauth_ready'];
            if(state.twitchOauthReady === true){
                state.twitchClientID = action.payload['client_id'];
            }
        })
        builder.addCase(loadTwitchOAuthThunk.rejected, (state,action) => {
            state.twitchOauthReady = false
            state.twitchClientID = null
            state.twitchUsername = ""
            state.twitchImage = null
            state.bitsLeaderboardArray = null
            state.followers = 0
            state.subscriberPoints = 0
            state.subscribers = 0
            state.subscribersTierArray = null
            state.videoArray = null
            state.creationDate = ""
            state.syncDate =  ""
            state.syncTime = null
        })

        //Log the user out
        builder.addCase(logoutThunk.fulfilled, (state,action) => {
            state.twitchOauthReady = false
            state.twitchClientID = null
            state.twitchUsername = ""
            state.twitchImage = null
            state.bitsLeaderboardArray = null
            state.followers = 0
            state.subscriberPoints = 0
            state.subscribers = 0
            state.subscribersTierArray = null
            state.videoArray = null
            state.creationDate = ""
            state.syncDate =  ""
            state.syncTime = null
        })

        //Get User Information from Twitch
        builder.addCase(getTwitchUserDataThunk.fulfilled, (state,action) => {
            if(action.payload['status_code'] === 200){
                state.twitchUsername = action.payload['username']
                state.twitchImage = action.payload['profile_image_url']
                state.creationDate = action.payload['created_at']

                let newDate = new Date();
    
                state.syncTime = newDate.getTime()
                state.syncDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`
            }
        })
        builder.addCase(getTwitchUserDataThunk.pending, (state,action) => {
            state.twitchUsername = ""
            state.twitchImage = null
            state.creationDate = ""
        })
        builder.addCase(getTwitchUserDataThunk.rejected, (state,action) => {
            state.twitchUsername = ""
            state.twitchImage = null
            state.creationDate = ""
        })
        
        //Get Bit Data
        builder.addCase(getTwitchBitsDataThunk.fulfilled, (state,action) => {
            if(action.payload['status_code'] === 200){
                state.bitsLeaderboardArray = action.payload['bits_array']
            }
        })
        builder.addCase(getTwitchBitsDataThunk.pending, (state,action) => {
            state.bitsLeaderboardArray = null
        })
        builder.addCase(getTwitchBitsDataThunk.rejected, (state,action) => {
            state.bitsLeaderboardArray = null
        })
         
        //Get Follower Data
        builder.addCase(getTwitchFollowerDataThunk.fulfilled, (state,action) => {
            if(action.payload['status_code'] === 200){
                state.followers = action.payload['followers']
            }
        })
        builder.addCase(getTwitchFollowerDataThunk.pending, (state,action) => {
            state.followers = 0
        })
        builder.addCase(getTwitchFollowerDataThunk.rejected, (state,action) => {
            state.followers = 0
        })

        //Get Subscriber Data
        builder.addCase(getTwitchSubscriberDataThunk.fulfilled, (state,action) => {
            if(action.payload['status_code'] === 200){
                state.subscriberPoints = action.payload['subscriber_points']
                state.subscribers = action.payload['subscribers']
                state.subscribersTierArray = action.payload['subscriber_tiers_array']
            }
        })
        builder.addCase(getTwitchSubscriberDataThunk.pending, (state,action) => {
            state.subscriberPoints = 0
            state.subscribers = 0
            state.subscribersTierArray = null
        })
        builder.addCase(getTwitchSubscriberDataThunk.rejected, (state,action) => {
            state.subscriberPoints = 0
            state.subscribers = 0
            state.subscribersTierArray = null
        })

        //Get Video Data
        builder.addCase(getTwitchVideoDataThunk.fulfilled, (state,action) => {
            if(action.payload['status_code'] === 200){
                state.videoArray = action.payload['video_array']
            }
        })
        builder.addCase(getTwitchVideoDataThunk.pending, (state,action) => {
            state.videoArray = null
        })
        builder.addCase(getTwitchVideoDataThunk.rejected, (state,action) => {
            state.videoArray = null
        })
    }

})

export default twitchSlice.reducer