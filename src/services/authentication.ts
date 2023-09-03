/**
 * Cesar Guerrero
 * 08/26/23
 * 
 * @file This file will handle our Axios calls to the backend
 */

//Axios allows us to make calls to our backend
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL; //NOTE: All variables must start with REACT_APP

//Since we are maintaing sessions we need to alter axios
const api = axios.create({
    withCredentials: true
})

/**
 * We want to ping the server and see if a session exists for the person visiting our site
 */
async function isLoggedIn() {
    const response = await api.get(`${BASE_URL}/profile`)
    return response.data
}

/**
 * Ensure the server is ready to begin the oauth_flow
 */
async function loadOAuth() {
    const response = await api.get(`${BASE_URL}/login`)
    return response.data
}

/**
 * Send the final arguments to fully authorize the user
 * @param oauthToken - Token given by Twitter after completing second leg of Oauth 
 * @param oauthVerifier - Verifier is needed to complete authorization string for final leg of Oauth
 * @returns JSON Object
 */
async function authorizeOAuth(oauthToken:String | null, oauthVerifier:String | null){
    const response = await api.get(`${BASE_URL}/callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`)
    return response.data
}

/**
 * Tell the server to close the session related to this user
 */
async function logout() {
    const response = await api.post(`${BASE_URL}/logout`)
    return response.data
}

export {isLoggedIn, loadOAuth, authorizeOAuth, logout}