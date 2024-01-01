/**
 * Cesar Guerrero
 * 08/26/23
 * 
 * @file This file will handle our Axios calls to the backend
 */

import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL; //NOTE: All variables must start with REACT_APP

//Since we are maintaining sessions we need to alter axios to send our session cookie back and forth
const api = axios.create({
    withCredentials: true
})

/**
 * We want to ping the server and see if a session exists for the person visiting our site
 * @returns - JSON Object
 */
async function isLoggedIn() {
    const response = await api.get(`${BASE_URL}/profile`)
    return response.data
}

/**
 * Tell the server to close the session related to this user
 * @returns - JSON Object
 */
async function logout() {
    const response = await api.get(`${BASE_URL}/logout`)
    return response.data
}

export {isLoggedIn, logout}