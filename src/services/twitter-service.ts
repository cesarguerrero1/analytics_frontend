/**
 * Cesar Guerrero
 * 09/16/23
 * 
 * @file This file will handle our Axios calls to the backend for Twitter
 */

//Axios allows us to make calls to our backend
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL; //NOTE: All variables must start with REACT_APP

//Since we are maintaing sessions we need to alter axios
const api = axios.create({
    withCredentials: true
})

/**
 * Ensure the server is ready to begin the twitter oauth_flow
 * @returns - JSON Object
 */
async function loadTwitterOAuth() {
    const response = await api.get(`${BASE_URL}/login/twitter`)
    return response.data
}

/**
 * Send the final arguments to fully authorize the user for Twitter
 * @param oauthToken - Token given by Twitter after completing second leg of Oauth 
 * @param oauthVerifier - Verifier is needed to complete authorization string for final leg of Oauth
 * @returns - JSON Object
 */
async function authorizeTwitterOAuth(oauthToken:String | null, oauthVerifier:String | null){
    const response = await api.get(`${BASE_URL}/callback/twitter?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`)
    return response.data
}

/**
 * Request that the server talk to Twitter and return a data object with user data from Twitter
 */
async function getTwitterUserData(){
    const response = await api.get(`${BASE_URL}/dashboard/twitter/users`);
    return response.data
}

export {loadTwitterOAuth, authorizeTwitterOAuth, getTwitterUserData}