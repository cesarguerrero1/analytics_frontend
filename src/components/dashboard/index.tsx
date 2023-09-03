/**
 * Cesar Guerrero
 * 08/25/23
 * @file JSX Element with our dashboard
 */

import { useEffect } from "react";
import { useAppSelector } from "../../hooks";
import { useNavigate } from "react-router";

/**
 * The dashboard will show all of our user data
 * @returns JSX.Element
 */
function Dashboard(): JSX.Element{

    const { currentUser } = useAppSelector(state => state.users);

    const navigate = useNavigate();

    useEffect( () => {
        //If the user is not logged in, don't allow them to be on this page
        if(currentUser === null){
            navigate('/login')
        }
    }, [navigate, currentUser])

    return(
        <div>
            Dashboard
        </div>
    )
}

export default Dashboard;