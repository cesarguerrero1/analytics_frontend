/**
 * Cesar Guerrero
 * 08/26/23
 * 
 * @file This file will handle interacting with Redux once the axios call has been returned
 */

//Thunks handle asynchronous updating of the state
import { createAsyncThunk } from "@reduxjs/toolkit";

import * as authService from "../authentication";

/**
 * Check if a a session exists
 */
const isLoggedInThunk = createAsyncThunk('users/isLoggedIn', async () => {
    const userObject = await authService.isLoggedIn();
    return userObject;
})

/**
 * Ensure that the oauth flow is ready to go
 */
const loadOAuthThunk = createAsyncThunk('users/oauthleg1', async () => {
    const oauthReadiness = await authService.loadOAuth();
    return oauthReadiness
})

/**
 * Complete final leg of OAuth and update our global state
 */
const authorizeOAuthThunk = createAsyncThunk('users/oauthleg3', async ({oauthToken, oauthVerifier}:{oauthToken:String | null, oauthVerifier:String | null}) => {
    const oauthAuthorization = await authService.authorizeOAuth(oauthToken, oauthVerifier);
    return oauthAuthorization
})

/**
 * Destroy the session for the given user
 */
const logoutThunk = createAsyncThunk('users/logout', async () => {
    const response = await authService.logout();
    return response
})


export {isLoggedInThunk, loadOAuthThunk, authorizeOAuthThunk, logoutThunk}