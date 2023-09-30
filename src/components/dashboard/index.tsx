/**
 * Cesar Guerrero
 * 08/25/23
 * @file JSX Element with our dashboard
 */

import { useEffect } from "react";
import { useAppSelector } from "../../hooks";
import { useNavigate } from "react-router-dom";

//Enum
import { selectedApp } from "../../reducers/users-reducer";

//Dashboard Components
import TwitterDashboard from "./twitter";
import TwitchDashboard from "./twitch";

/**
 * The dashboard will show all of our user data
 * @returns JSX.Element
 */
function Dashboard(): JSX.Element{

    const { loggedIn, app } = useAppSelector(state => state.users);
    const navigate = useNavigate();

    useEffect( () => {
        //If the user is not logged in, don't allow them to be on this page
        if(loggedIn === false){
            navigate('/login')
        }
    }, [navigate, loggedIn, app])

    return(
        <div className="container-fluid min-vh-100 min-vh-100 cg-dashboard-body">
            {app === selectedApp.TWITTER &&
                <TwitterDashboard/>
            }
            {app === selectedApp.TWITCH &&
                <TwitchDashboard/>
            }
        </div>
    )
}

export default Dashboard;