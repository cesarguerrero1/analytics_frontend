/**
 * Cesar Guerrero
 * 08/25/23
 * @returns JSX Element with our login page
 */

import { useEffect } from "react"; //Allow us to perform an action AFTER render and after any update
import { useAppDispatch, useAppSelector } from "../../hooks"; //Allows us to update state
import { useNavigate } from "react-router"; //Allows us to redirect a users browser

//Thunks
import {loadOAuthThunk} from "../../services/thunks/authentication-thunk"

function Login(): JSX.Element{

    const {currentUser, oauthReady, oauthToken} = useAppSelector(state => state.users);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    let socialMediaApps: any[] = [
    {
        "name": "Twitter",
        "active":true,
        "imageSrc": "/images/twitterx_logo.jpeg",
        "oauthlink": `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`,
        "background-color": "black"
    },
    {
        "name": "Instagram",
        "active":false,
        "imageSrc": "/images/instagram_logo.jpeg",
        "oauthlink": ``,
        "background-color": "#813db2"
    },
    {
        "name": "Pinterest",
        "active":false,
        "imageSrc": "/images/pinterest_logo.jpeg",
        "oauthlink": ``,
        "background-color": "red"
    },
    {
        "name": "Tiktok",
        "active":false,
        "imageSrc": "/images/tiktok_logo.jpeg",
        "oauthlink": ``,
        "background-color": "black"
    }]
    
    useEffect(() => {
        //If a user is logged in we do not want them on the login page
        if (currentUser !== null){
            navigate("/dashboard")
            return
        }
        //We need to immediately have the backend load up our oauth tokens so the user can then click on the Sign in
        dispatch(loadOAuthThunk());
    }, [dispatch, navigate, currentUser])

    return(
        <div className="container-fluid min-vh-100 min-vh-100 cg-login-body ">
            <div className="row w-50 mx-auto justify-content-center align-items-center">
                <div className="col cg-login-box">
                    <div className="text-center">
                        <h1 className="cg-login-title">ANALYTICS DASHBOARD</h1>
                    </div>
                    <div className="cg-button-container">
                        {oauthReady ?
                            socialMediaApps.map((app) => {
                                if(app['active'] === true){
                                    return <a key={app['name']} href={app["oauthlink"]} target="_blank" rel="noreferrer" className = "btn cg-button" style={{backgroundColor:app['background-color']}}><img alt="Company Logo" src={app['imageSrc']} className="cg-image"/></a>
                                }
                                return null
                            })
                            : <h3 className="text-center">Loading...</h3>
                        }
                    </div>
                    <div className="text-center">
                        <h5> A personalized Analytics Dasboard is only a click away!</h5>
                        <h6>NOTE - All authorization access is <b>strictly read only</b></h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;