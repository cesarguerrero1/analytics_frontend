/**
 * Cesar Guerrero
 * 08/25/23
 * @file JSX Element with our dashboard
 */

import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import { useNavigate } from "react-router-dom";


//Import Charts
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import { Line } from 'react-chartjs-2';

//Register Chart Elements
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);



/**
 * The dashboard will show all of our user data
 * @returns JSX.Element
 */
function Dashboard(): JSX.Element{

    const { currentUser } = useAppSelector(state => state.users);
    const navigate = useNavigate();

    useEffect( () => {
        //If the user is not logged in, don't allow them to be on this page
    }, [navigate])

    return(
        <div className="container-fluid min-vh-100 min-vh-100 cg-dashboard-body">
            <div className="row w-75 mx-auto justify-content-center align-items-center">
                <div className="col-12 col-md-2 cg-left-side">
                    LEFT SIDE
                </div>
                <div className="col-12 col-md-10 cg-right-side">
                    RIGHT SIDE
                </div>
            </div>
        </div>
    )
}

export default Dashboard;


/*
TWITTER: Do to Twitter's Cap, we can only pull 1500 tweets a month. Therefore each request for a user will only be their last 100 tweets


User Object
- Username
- Created At
- Image
- Public Metrics: "followers_count", "following_count", "tweet_count": 3561 --- Average: 700 Followers; Influencers tweet ~150 per month
- 


Last 100 Tweets Object
- tweet.fields = [organic_metrics,promoted_metrics]
 "organic_metrics": {
     "impression_count": 3880,
     "like_count": 8,
     "reply_count": 0,
     "retweet_count": 4
     "url_link_clicks": 3
     "user_profile_clicks": 2
}


 The plan is to show the username, photo, Followers, Following, Tweets on the left side of the page all stacked on top of each other.
 
Dashboard Ideas for last 25 Tweets:
1. Line Graph of Impressions
2. 3 Dataset Line Graph - Likes, Replies, Retweets
3. PCTR = User Profile Clicks/Impressions -- Bar Graph for last 50 Tweets?
4. Engagement Rate % = (Likes + Replies + Retweets)/Impressions * 100 - Bar Graph?
5. Line Chart of Impressions vs Likes? The more people see your tweets the more they should like it?

*/