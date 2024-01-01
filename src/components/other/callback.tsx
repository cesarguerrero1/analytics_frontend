/**
 * Cesar Guerrero
 * 08/25/23
 * @returns JSX Element with our callback page
 * 
 */

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { useNavigate, useSearchParams, useParams} from "react-router-dom";

//Thunk Imports
import { authorizeTwitterOAuthThunk } from "../../thunks/twitter-thunk";
import { authorizeTwitchOAuthThunk } from "../../thunks/twitch-thunk";

//Import ENUM
import {authorizationStatus} from "../../reducers/users-reducer"


function Callback(): JSX.Element{

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    //Global State Variables
    let {authorizationStatusMessage, authorizationApproved} = useAppSelector(state => state.users)

    //Local State Variables
    let [thunkCalled, setThunkCalled] = useState(false);

    //Path Keys
    let {appname} = useParams();

    //We can't access these values as PATHNAMES so we are expecting QUERY PARAMETERS
    let [searchParams] = useSearchParams();

    //Twitter
    const denied = searchParams.get('denied');
    const oauthToken = searchParams.get('oauth_token');
    const oauthVerifier = searchParams.get('oauth_verifier');

    //Twitch
    const code = searchParams.get('code');
    const error = searchParams.get('error');


    useEffect(() => {
        //If we have approved the authorization token then go to the dashboard
        if(authorizationApproved === authorizationStatus.APPROVED){
            setTimeout(() => {
                navigate('/dashboard')
            }, 3000)
            
        }else if(authorizationApproved === authorizationStatus.REJECTED){
            //If we denied authorization OR it was rejected then go to the login page to reset everything and try again
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        }else{
            //We need to determine whether or not we need to make a call to the backend
            if(thunkCalled === false){
                //Attempting to authorize Twitch
                if(appname === "twitch"){

                    //There is no error query so ping the server
                    if(error === null){
                        if(code){
                            dispatch(authorizeTwitchOAuthThunk(code));
                            setThunkCalled(true)
                        }
                    }else{
                        setTimeout(() => {
                            navigate('/login')
                        }, 3000)
                    }

                //Attempting to authorize Twitter
                }else if(appname === "twitter"){

                    //There is no denied query so ping the server
                    if(denied === null){
                        if(oauthToken && oauthVerifier){
                            dispatch(authorizeTwitterOAuthThunk({oauthToken, oauthVerifier}))
                            setThunkCalled(true)
                        }
                    }else{
                        setTimeout(() => {
                            navigate('/login')
                        }, 3000)
                    }
                    
                }else{
                    navigate('/error')
                }
            }
        }

        
    }, [dispatch, navigate, authorizationApproved])

    return(
        <div className="container-fluid min-vh-100 min-vh-100 cg-callback-body">
            <div className="row mx-auto justify-content-center align-items-center cg-callback-container">
                <div className="col text-center">
                {
                    appname === "twitter" && 
                    (denied === null ? 
                        <div>
                            <h1>Attempting to authorize your Twitter account</h1>
                            <h6>Authorization Status: {authorizationStatusMessage}</h6>
                            {authorizationApproved === authorizationStatus.APPROVED && <p>Redirecting you to the dashboard momentarily</p>}
                            {authorizationApproved === authorizationStatus.REJECTED && <p>Redirecting you to the login page momentarily</p>}
                        </div>
                        : 
                        <div>
                            <h5>You have DENIED our authorization attempt</h5>
                            <h6>Redirecting you back to the login page momentarily</h6>
                        </div>
                    )
                }
                {
                    appname === "twitch" && 
                    (error === null ? 
                        <div>
                            <h1>Attempting to authorize your Twitch account</h1>
                            <h6>Authorization Status: {authorizationStatusMessage}</h6>
                            {authorizationApproved === authorizationStatus.APPROVED && <p>Redirecting you to the dashboard momentarily</p>}
                            {authorizationApproved === authorizationStatus.REJECTED && <p>Redirecting you to the login page momentarily</p>}
                        </div>
                        : 
                        <div>
                            <h5>You have DENIED our authorization attempt</h5>
                            <h6>Redirecting you back to the login page momentarily</h6>
                        </div>
                    )
                }
                </div>
            </div>
        </div>
    )
}

export default Callback;