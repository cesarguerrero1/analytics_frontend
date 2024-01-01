/**
 * Cesar Guerrero
 * 09/16/23
 * 
 * @file This file will handle interacting with Redux once the axios call has been returned
 */


//Thunks handle asynchronous updating of the state
import { createAsyncThunk } from "@reduxjs/toolkit";

import * as twitchService from "../services/twitch-service";

/**
 * Ping the backend to get our Twitch Client-id to begin OAuth2 flow 
 */
const loadTwitchOAuthThunk = createAsyncThunk('users/twitch-oauthleg1', async () => {
    const responseObject = await twitchService.loadTwitchOAuth();
    return responseObject;
})

/**
 * Ping the backend to Authorize our Twitch Access Token -- This completes the final
 * leg of Oauth2
 */
const authorizeTwitchOAuthThunk = createAsyncThunk('users/twitch-oauthleg3', async (code: String|null) => {
    const responseObject = await twitchService.authorizeTwitchOAuth(code);
    return responseObject;
})

//Get User Data
const getTwitchUserDataThunk = createAsyncThunk('twitch/user-data', async () => {
    const responseObject = await twitchService.getTwitchUserData();
    return responseObject
})

//Get Bits Leaderboard
const getTwitchBitsDataThunk = createAsyncThunk('twitch/bits-leaderboard', async () => {
    const responseObject = await twitchService.getTwitchBitsData();
    return responseObject
})

//Get Followers Information
const getTwitchFollowerDataThunk = createAsyncThunk('twitch/follower-data', async (id:string) => {
    const responseObject = await twitchService.getTwitchFollowerData(id);
    return responseObject
})

//Get Subscribers Information
const getTwitchSubscriberDataThunk = createAsyncThunk('twitch/subscriber-data', async (id:string) => {
    const responseObject = await twitchService.getTwitchSubscriberData(id);
    return responseObject
})

//Get Video Information
const getTwitchVideoDataThunk = createAsyncThunk('twitch/video-data', async (id:string) => {
    const responseObject = await twitchService.getTwitchVideoData(id);
    return responseObject
})


export {loadTwitchOAuthThunk, authorizeTwitchOAuthThunk, getTwitchUserDataThunk, 
    getTwitchBitsDataThunk, getTwitchFollowerDataThunk, 
    getTwitchSubscriberDataThunk, getTwitchVideoDataThunk}