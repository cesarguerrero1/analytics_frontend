/**
 * Cesar Guerrero
 * 09/09/23
 * 
 * Line Graph Element that will render a Line Graph of Impressions against Likes for a persons 10 latest tweets
 */

//Import Charts
import {Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

//Register Chart Elements
ChartJS.register(LinearScale,PointElement,LineElement,Title, Tooltip);

function ImpressionsLikesLine(): JSX.Element{
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Impressions vs Likes for Last 10 Tweets',
            },
            legend: {
                display: false,
            },
        },
        scales: {
            x:{
                title:{
                    display:true,
                    text:"Likes"
                }
            },
            y:{
                title:{
                    display:true,
                    text:"Impressions"
                }
            }
        },
        maintainAspectRatio: false,
    };

    let impressions = [2142, 1321, 2718, 2934, 1498, 2687, 1245, 1987, 1086, 2135]
    let likes = [2687, 2399, 2856, 2175, 2056, 2257, 2734, 2972, 2321, 2134]
    let scatterPairs = []
    for(let i: number = 0; i < 10; i++){
        scatterPairs.push({x: impressions[i], y: likes[i]})
    }

    const data = {
        datasets: [
          {
            label: '<Impressions, Likes>',
            data: scatterPairs,
            borderColor: 'rgb(98, 14, 90)',
            backgroundColor: 'rgba(98, 14, 90, .75)',
          }
        ],
    };
    return(
        <div className='cg-graph-elements'>
            <Scatter options={options} data={data}/>
        </div>
    )
}

export default ImpressionsLikesLine;