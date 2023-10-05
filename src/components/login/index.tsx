/**
 * Cesar Guerrero
 * 08/25/23
 * @returns JSX Element with our login page
 */

import { useEffect, useState } from "react"; //Allow us to perform an action AFTER render and after any update
import { useAppDispatch, useAppSelector } from "../../hooks"; //Allows us to update state
import { useNavigate} from "react-router-dom"; //Allows us to redirect a users browser

//Thunks
import { loadTwitchOAuthThunk } from "../../thunks/twitch-thunk";
import { loadTwitterOAuthThunk } from "../../thunks/twitter-thunk";

function Login(): JSX.Element{
    //Global State Variables
    const {loggedIn} = useAppSelector(state => state.users);
    const {twitterOauthReady, twitterOauthToken} = useAppSelector(state => state.twitter);
    const {twitchOauthReady, twitchClientID} = useAppSelector(state => state.twitch);

    //Local State Variables
    let [twitterState, setTwitterState] = useState(false);
    let [twitchState, setTwitchState] = useState(false);
    const hostname = window.location.hostname;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    //Button Data
    let socialMediaApps: any[] = [
        {
            "name": "Twitter",
            "active": twitterOauthReady,
            "imageSrc": "/images/twitterx_logo.jpeg",
            "href": `https://api.twitter.com/oauth/authorize?oauth_token=${twitterOauthToken}`,
            "background-color": "black"
        },
        {
            "name": "Twitch",
            "active": twitchOauthReady,
            "imageSrc": "/images/twitch_logo.jpeg",
            "href": `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${twitchClientID}&redirect_uri=https://${hostname}/callback/twitch&scope=bits%3Aread%20moderator%3Aread%3Afollowers%20channel%3Aread%3Asubscriptions%20user%3Aread%3Aemail`,
            "background-color": "#6b2497"
        },
    ]
    
    //This will fire on page load and then refire if the variables twitchOauthReady, TwitterOauthReady, or loggedIn change state
    useEffect(() => {
        //If a user is logged in we do not want them on the login page
        if (loggedIn === true){
            navigate("/dashboard")
            return
        }

        //We need to immediately have the backend load up our oauth tokens so the user can then click on the Sign in
        if(!twitchState){
            dispatch(loadTwitchOAuthThunk());
            setTwitchState(true);
        }

        if(!twitterState){
            dispatch(loadTwitterOAuthThunk());
            setTwitterState(true);
        }
    }, [dispatch, navigate, loggedIn, twitchOauthReady, twitterOauthReady])

    return(
        <div className="container-fluid min-vh-100 min-vh-100 cg-login-body ">
            <div className="row mx-auto justify-content-center align-items-center cg-login-container">
                <div className="col cg-login-box">
                    <div className="text-center">
                        <h1 className="cg-login-title">ANALYTICS DASHBOARD</h1>
                    </div>
                    <div>
                        {socialMediaApps.map((app) => {
                            if(app['active'] === true){
                                return(
                                    <a key={app['name']} href={app['href']} target="_self" rel="noreferrer" className = "btn cg-button" style={{backgroundColor:app['background-color']}}>
                                        <img alt={app['name']} src={app['imageSrc']} className="cg-button-image"/>
                                    </a>
                                )
                            }else{
                                return(<></>)
                            }
                        })}
                    </div>
                    <div className="text-center">
                        <h5>A personalized Analytics Dasboard is only a click away!</h5>
                        <h6><i>Authorization access is <b>strictly read only</b></i></h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;