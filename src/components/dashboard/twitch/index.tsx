/**
 * Cesar Guerrero
 * 09/19/23
 * @file JSX Element for our Twitch Dashboard
 */

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";

//Thunks
import { logoutThunk } from "../../../thunks/authentication-thunk";
import { getTwitchUserDataThunk, getTwitchBitsDataThunk, getTwitchFollowerDataThunk, 
    getTwitchSubscriberDataThunk, getTwitchVideoDataThunk} from "../../../thunks/twitch-thunk";

//Graph Elements
import BitsBar from "./bits_bar_graph";
import SubscribersPie from "./subscribers_pie_chart";
import VideoLineGraph from "./video_line_graph";

/**
 * The dashboard will show all of our user data for Twitter
 * @returns JSX.Element
 */
function TwitchDashboard(): JSX.Element{

    const dispatch = useAppDispatch(); 

    //Global State Variables
    const {twitchUsername, twitchImage, bitsLeaderboardArray, followers, subscribersTierArray,
        subscribers, subscriberPoints, videoArray, creationDate, 
        syncDate, syncTime} = useAppSelector(state => state.twitch);
        
    function logoutClickHandler(): any{
        dispatch(logoutThunk());
    }

    //Some of the API calls are dependent on information from a singular API call
    //300,000ms = 5 Minutes
    async function collectData(){
        if(syncTime === null || ((new Date().getTime()) - 300000 > syncTime)){
            //Call all thunks that do not require a user-id
            dispatch(getTwitchBitsDataThunk());

            //Wait for our backend to update with the user-id before calling
            const result = await dispatch(getTwitchUserDataThunk());
            if(result['payload']['status_code'] === 200){
                dispatch(getTwitchFollowerDataThunk(result['payload']['twitch_id']));
                dispatch(getTwitchSubscriberDataThunk(result['payload']['twitch_id']));
                dispatch(getTwitchVideoDataThunk(result['payload']['twitch_id']));
            }
        }
    }

    useEffect(() => {
        collectData();
    }, [collectData])


    return(
        <div className="row mx-auto justify-content-center align-items-center cg-dashboard-row">
            <h1 className="text-center cg-dashboard-main-title">{twitchUsername !== "" && `${twitchUsername}'s`} Twitch Dashboard</h1>
            <div className="col-12 col-md-4 col-lg-3 my-4 cg-left-side">
                <div className="text-center my-4">
                {
                        twitchImage !== null ?
                            <img alt='Default' src={twitchImage} className="cg-dashboard-image"/>
                        :
                            <img alt='Default' src="/images/twitch_logo.jpeg" className="cg-dashboard-image"/>
                    }
                </div>
                <div className="text-center">
                    <h5 className='cg-dashboard-titles'>ACCOUNT CREATION</h5>
                    <p className='cg-dashboard-metrics'>{creationDate}</p>
                    <h5 className='cg-dashboard-titles'>SUBSCRIBERS</h5>
                    <p className='cg-dashboard-metrics'>{subscribers}</p>
                    <h5 className='cg-dashboard-titles'>SUBSCRIBER POINTS</h5>
                    <p className='cg-dashboard-metrics'>{subscriberPoints}</p>
                    <h5 className='cg-dashboard-titles'>FOLLOWERS</h5>
                    <p className='cg-dashboard-metrics'>{followers}</p>
                    <h5 className='cg-dashboard-titles'>LAST UPDATE</h5>
                    <p className='cg-dashboard-metrics'>{syncDate}</p>
                    <h6><button className="btn cg-button" onClick={logoutClickHandler}>Logout</button></h6>
                </div>
            </div>
            <div className="col-12 col-md-8 col-lg-9 cg-right-side">
                {
                    bitsLeaderboardArray === null ? <div className='cg-graph-elements text-center'><h4>Loading Data...</h4></div>:
                    bitsLeaderboardArray.length === 0 ? <div className='cg-graph-elements text-center'><h4>There is no data to display for your Bits Leaderboard Graph</h4></div> :
                    <BitsBar bitsArray={bitsLeaderboardArray}/>
                }
                <div className="row mx-auto justify-content-center align-items-center">
                    <div className="col-12 col-md-6 my-4">
                        {
                            subscribersTierArray === null ? <div className='cg-graph-elements text-center'><h4>Loading Data...</h4></div>:
                            subscribersTierArray[0] === 0 && subscribersTierArray[1] === 0 && subscribersTierArray[2] === 0 
                            ? <div className='cg-graph-elements text-center'><h4>There is no data to display for your Subscribers Pie Chart</h4></div> :
                            <SubscribersPie subscribersTierArray={subscribersTierArray} />
                        }
                    </div>
                    <div className="col-12 col-lg-6 my-4">
                        {
                            videoArray === null ? <div className='cg-graph-elements text-center'><h4>Loading Data...</h4></div>:
                            videoArray.length === 0 ? <div className='cg-graph-elements text-center'><h4>There is no data to display for your VOD View Count Graph</h4></div> :
                            <VideoLineGraph videoArray={videoArray}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TwitchDashboard