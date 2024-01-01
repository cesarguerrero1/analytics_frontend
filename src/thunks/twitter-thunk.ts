/**
 * Cesar Guerrero
 * 09/16/23
 * 
 * @file This file will handle interacting with Redux once the axios call has been returned
 */


//Thunks handle asynchronous updating of the state
import { createAsyncThunk } from "@reduxjs/toolkit";

import * as twitterService from "../services/twitter-service";

/**
 * Ensure that the oauth flow is ready to go for twitter
 */
const loadTwitterOAuthThunk = createAsyncThunk('users/twitter-oauthleg1', async () => {
    const responseObject = await twitterService.loadTwitterOAuth();
    return responseObject
})

/**
 * Complete final leg of OAuth and update our global state -- This should depend on WHICH
 * app was selected by the user hence the need for our enum
 * NOTE: We are leaving this here as our application needs to know what it is interacting with
 */
const authorizeTwitterOAuthThunk = createAsyncThunk('users/twitter-oauthleg3', async ({oauthToken, oauthVerifier}:{oauthToken:String | null, oauthVerifier:String | null}) => {
    const responseObject = await twitterService.authorizeTwitterOAuth(oauthToken, oauthVerifier);
    return responseObject
})

/**
 * Get a Twitter User Payload from the server
 */
const getTwitterUserDataThunk = createAsyncThunk('twitter/user-data', async () => {
    const responseObject = await twitterService.getTwitterUserData();
    return responseObject
})


export {loadTwitterOAuthThunk, authorizeTwitterOAuthThunk, getTwitterUserDataThunk}