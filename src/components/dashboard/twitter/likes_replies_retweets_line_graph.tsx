/**
 * Cesar Guerrero
 * 09/09/23
 * 
 * Line Graph Element that will render a Line Graph of 3 lines - Likes, Replies, Retweets - of data from the last 10 tweets
 */

//Import Charts
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip} from 'chart.js';
import { Line } from 'react-chartjs-2';

//Register Chart Elements
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title, Tooltip);

function LikesRepliesTweetsLine(): JSX.Element{
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Likes/Replies/Retweets for Last 10 Tweets',
            },
        },
        scales: {
          x:{
              title:{
                  display:true,
                  text:"Tweet"
              }
          },
      },
        maintainAspectRatio: false,
    };

    const data = {
        labels: [1,2,3,4,5,6,7,8,9,10],
        datasets: [
          {
            label: 'Likes',
            data: [2687, 2399, 2856, 2175, 2056, 2257, 2734, 2972, 2321, 2134],
            borderColor: 'rgb(183, 44, 123)',
            backgroundColor: 'rgba(183, 44, 123, .75)',
          },
          {
            label: 'Replies',
            data: [427, 682, 247, 853, 156, 719, 432, 601, 322, 764],
            borderColor: 'rgb(98, 14, 90)',
            backgroundColor: 'rgba(98, 14, 90, .75)',
          },
          {
            label: 'Retweets',
            data: [1685, 2079, 1813, 2357, 2226, 1542, 2250, 2391, 1938, 1656],
            borderColor: 'rgb(16, 68, 165)',
            backgroundColor: 'rgba(16, 68, 165, .75)',
          }
        ],
    };
    
    return(
        <div className='cg-graph-elements'>
            <Line options={options} data={data}/>
        </div>
    )
}

export default LikesRepliesTweetsLine
