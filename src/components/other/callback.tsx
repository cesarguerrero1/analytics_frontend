/**
 * Cesar Guerrero
 * 08/25/23
 * @returns JSX Element with our callback page
 * 
 */

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { useNavigate, useSearchParams} from "react-router-dom";

//Thunk Imports
import { authorizeOAuthThunk } from "../../services/thunks/authentication-thunk";

//Import ENUM
import {authorizationStatus} from "../../reducers/users-reducer"


function Callback(): JSX.Element{
    //Global State Variables
    const {authorizationStatusMessage, authorizationApproved} = useAppSelector(state => state.users)

    //Local State Variables
    let [thunkCalled, setThunkCalled] = useState(false);

    //Query Keys
    let [searchParams] = useSearchParams();
    const denied = searchParams.get('denied');
    const oauthToken = searchParams.get('oauth_token');
    const oauthVerifier = searchParams.get('oauth_verifier');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        //We don't want people on this page if they are logged in or they have authorized our application
        if(authorizationApproved === authorizationStatus.APPROVED){
            setTimeout(() => {
                navigate('/dashboard')
            }, 3000)
            return
        }

        if(authorizationApproved === authorizationStatus.REJECTED){
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        }

        //We did not find a denied param in the url so attempt to authorize the credentials
        if(denied === null && thunkCalled === false){
            if(oauthToken && oauthVerifier){
                dispatch(authorizeOAuthThunk({oauthToken, oauthVerifier}))
                setThunkCalled(true)
            }
            return
        }
        
    }, [dispatch, navigate, thunkCalled, denied, oauthToken, oauthVerifier, authorizationApproved])

    return(
        <div className="container-fluid min-vh-100 min-vh-100 cg-callback-body">
            <div className="row w-75 mx-auto justify-content-center align-items-center">
                <div className="col text-center">
                    {denied === null ? <div><h1>Attempting to authorize your account</h1> <h6>Authorization Status: {authorizationStatusMessage}</h6></div> : 
                        <div><h5>AUTHORIZATION DENIED</h5><h6>Redirecting you back to the login page momentarily</h6></div>}
                    {authorizationApproved === authorizationStatus.APPROVED && <div><h5>AUTHORIZATION APPROVED</h5>Redirecting you to the dashboard momentarily</div>}
                </div>
            </div>
        </div>
    )
}

export default Callback;