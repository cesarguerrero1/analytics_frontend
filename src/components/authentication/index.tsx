/**
 * Cesar Guerrero
 * 08/25/23
 * 
 * @file Settitng the initial state based on the Provider Store before anything else is rendered
 */

//Import State Tools
import { useEffect } from "react"; //Allow us to perform an action AFTER render and any update
import { useAppDispatch } from "../../hooks"; //Allows us to update state

//We will need to call our Thunk
import { isLoggedInThunk } from "../../thunks/authentication-thunk";

/**
 * This function will always be run on a refresh of our site as it will determine whether or not 
 * a session exists
 * @returns JSX.Element
 */
function CheckUser(): JSX.Element{
    const dispatch = useAppDispatch();
    
    //After rendering of the page, immediately check if a session exists
    useEffect( () =>{
        dispatch(isLoggedInThunk());
    }, [dispatch])
    
    return(<></>);
}

export default CheckUser;