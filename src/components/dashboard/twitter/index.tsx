/**
 * Cesar Guerrero
 * 09/19/23
 * @file JSX Element for our Twitter Dashboard
 */

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useNavigate } from "react-router-dom";

//Thunks
import { getTwitterUserDataThunk } from "../../../thunks/twitter-thunk";
import { logoutThunk } from "../../../thunks/authentication-thunk";

//Graph Elements
import LikesRepliesTweetsLine from "./likes_replies_retweets_line_graph";
import PCTRBar from "./pctr_bar_graph";
import ImpressionsLikesLine from "./impressions_likes_scatter";
import ImpressionsLine from "./impressions_line_graph";

/**
 * The dashboard will show all of our user data for Twitter
 * @returns JSX.Element
 */
function TwitterDashboard(): JSX.Element{
    const {twitterUsername, twitterImage, followerCount, followingCount, tweetCount, creationDate, syncDate, syncTime} = useAppSelector(state => state.twitter);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    //Destroy the session on logout
    function logoutClickHandler(): any{
        navigate('/login');
        dispatch(logoutThunk());
    }

    useEffect(() => {
        //We do not want the user to be able to keep pinging the server on refresh
        //21,600,000 seconds is 6 hours
        if(syncTime === null || ((new Date().getTime()) - (21.6*(10**6)) > syncTime)){
            dispatch(getTwitterUserDataThunk());
        }
    }, [dispatch, syncTime])

    return(
        <div className="row mx-auto justify-content-center align-items-center cg-dashboard-row">
            <h1 className="text-center cg-dashboard-main-title">{twitterUsername !== "" && `${twitterUsername}'s`} Twitter Dashboard</h1>
            <h3 className="text-center">Apologies!</h3>
            <h4 className="text-center">
                Unfortunately, due to Twitter's aggressive pricing, we currently cannot show you your tweet data.
                The user information is REAL and indicates that we have successfully completed the OAuth 1.0 Flow.
                However, the graph information is NOT REAL. We included it to showcase what your data would look like.
            </h4>
            <div className="col-12 col-md-4 col-lg-3 my-4 cg-left-side">
                <div className="text-center my-4">
                    {
                        twitterImage !== null ?
                            <img alt='TwitterProfile' src={twitterImage} className="cg-dashboard-image"/>
                        :
                            <img alt='Default' src="/images/twitterx_logo.jpeg" className="cg-dashboard-image"/>
                    }
                </div>
                <div className="text-center">
                    <h5 className='cg-dashboard-titles'>ACCOUNT CREATION</h5>
                        <p className='cg-dashboard-metrics'>{creationDate}</p>
                    <h5 className='cg-dashboard-titles'>TOTAL TWEETS</h5>
                        <p className='cg-dashboard-metrics'>{tweetCount}</p>
                    <h5 className='cg-dashboard-titles'>FOLLOWERS</h5>
                        <p className='cg-dashboard-metrics'>{followerCount}</p>
                    <h5 className='cg-dashboard-titles'>FOLLOWING</h5>
                        <p className='cg-dashboard-metrics'>{followingCount}</p>
                    <h5 className='cg-dashboard-titles'>LAST UPDATE</h5>
                        <p className='cg-dashboard-metrics'>{syncDate}</p>
                    <h6><button className="btn cg-button" onClick={logoutClickHandler}>Logout</button></h6>
                </div>
            </div>
            <div className="col-12 col-md-8 col-lg-9 cg-right-side text-center">
                <ImpressionsLine/>
                <LikesRepliesTweetsLine/>
                <ImpressionsLikesLine/>
                <PCTRBar/>
            </div>
        </div>
    )
}

export default TwitterDashboard