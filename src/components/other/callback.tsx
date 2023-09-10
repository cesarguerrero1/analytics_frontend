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
        //If we have approved the authorization token then go to the dashboard
        if(authorizationApproved === authorizationStatus.APPROVED){
            setTimeout(() => {
                navigate('/dashboard')
            }, 3000)
            
        }else if(authorizationApproved === authorizationStatus.REJECTED || denied !== null){
            //If we denied authorization OR it was rejected then go to the login page to reset everything and try again
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        }

        //We should only attempt to authorize credentials IFF there is no 'denied' query param and we have not REJECTED the authorization
        if(denied === null && thunkCalled === false && authorizationApproved === authorizationStatus.PENDING){
            if(oauthToken && oauthVerifier){
                dispatch(authorizeOAuthThunk({oauthToken, oauthVerifier}))
                setThunkCalled(true)
            }
        }
        
    }, [dispatch, navigate, authorizationApproved])

    return(
        <div className="container-fluid min-vh-100 min-vh-100 cg-callback-body">
            <div className="row w-75 mx-auto justify-content-center align-items-center">
                <div className="col text-center">
                    {denied === null ? 
                        <div>
                            <h1>Attempting to authorize your account</h1>
                            <h6>Authorization Status: {authorizationStatusMessage}</h6>
                            {authorizationApproved === authorizationStatus.APPROVED && <p>Redirecting you to the dashboard momentarily</p>}
                            {authorizationApproved === authorizationStatus.REJECTED && <p>Redirecting you to the login page momentarily</p>}
                        </div>
                        : 
                        <div>
                            <h5>AUTHORIZATION DENIED</h5>
                            <h6>Redirecting you back to the login page momentarily</h6>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Callback;