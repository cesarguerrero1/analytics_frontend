/**
 * Cesar Guerrero
 * 09/16/23
 * 
 * @file This file will handle our Axios calls to the backend for Twitch
 */

import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL; //NOTE: All variables must start with REACT_APP

//Since we are maintaing sessions we need to alter axios
const api = axios.create({
    withCredentials: true
})

/**
 * Ensure the server is ready to begin the twitch oauth_flow
 * @returns - JSON Object
 */
async function loadTwitchOAuth() {
    const response = await api.get(`${BASE_URL}/login/twitch`)
    return response.data
}

/**
 * Send the final arguments to fully authorize the user for Twitch
 * @param code - Code string given by twitch after succesful request
 * @returns - JSON Object
 */
async function authorizeTwitchOAuth(code:String | null){
    const response = await api.get(`${BASE_URL}/callback/twitch?code=${code}`)
    return response.data
}

/**
 * Get user data from Twtich
 * @returns - JSON Object
 */
async function getTwitchUserData(){
    const response = await api.get(`${BASE_URL}/dashboard/twitch/users`)
    return response.data
}

/**
 * Get a Leaderboard of the Top Bits Donaters for the streamer
 * @returns - JSON Obejct
 */
async function getTwitchBitsData(){
    const response = await api.get(`${BASE_URL}/dashboard/twitch/bits`)
    return response.data
}

/**
 * Get the number of followers for the streamer
 * @param id - The ID of the channel you want to get the followers for
 * @returns - JSON Object
 */
async function getTwitchFollowerData(id:string){
    const response = await api.get(`${BASE_URL}/dashboard/twitch/followers?id=${id}`,)
    return response.data
}

/**
 * Get subscriber data for the given streamer
 * @param id - The ID of the channel you want to get the followers for
 * @returns - JSON Object
 */
async function getTwitchSubscriberData(id:string){
    const response = await api.get(`${BASE_URL}/dashboard/twitch/subscribers?id=${id}`)
    return response.data
}

/**
 * Get video data for the given streamer
 * @param id - The ID of the channel you want to get the followers for
 * @returns - JSON Object
 */
async function getTwitchVideoData(id:string){
    const response = await api.get(`${BASE_URL}/dashboard/twitch/videos?id=${id}`)
    return response.data
}


export {loadTwitchOAuth, authorizeTwitchOAuth, getTwitchUserData,
    getTwitchBitsData, getTwitchFollowerData,
    getTwitchSubscriberData, getTwitchVideoData}