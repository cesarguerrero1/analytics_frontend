/**
 * Cesar Guerrero
 * 08/26/23
 * 
 * @file This file will handle interacting with Redux once the axios call has been returned
 */

//Thunks handle asynchronous updating of the state
import { createAsyncThunk } from "@reduxjs/toolkit";

//Services
import * as authService from "../services/authentication-service";

/**
 * Check if a a session exists
 */
const isLoggedInThunk = createAsyncThunk('users/isLoggedIn', async () => {
    const responseObject = await authService.isLoggedIn();
    return responseObject;
})

/**
 * Destroy the session for the given user
 */
const logoutThunk = createAsyncThunk('users/logout', async () => {
    const responseObject = await authService.logout();
    return responseObject
})

export {isLoggedInThunk, logoutThunk}