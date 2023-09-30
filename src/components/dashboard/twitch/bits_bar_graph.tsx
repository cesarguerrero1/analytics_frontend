/**
 * Cesar Guerrero
 * 09/20/23
 * 
 * Bar Graph of the Top 10 Bits Leaderboard for a Twitch Streamer
 */

import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function BitsBar({bitsArray}:{bitsArray: any}): JSX.Element{

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Bits Leaderboard Top 10',
            },
        },
        scales: {
            x:{
                title:{
                    display:true,
                    text:"Rank"
                }
            },
            y:{
                title:{
                    display:true,
                    text:"Bits Cheered"
                }
            }
        },
        maintainAspectRatio: false,
    };
    
    const data = {
        labels: bitsArray.map((bitsData:any) => {return bitsData[0]}),
        datasets: [
          {
            label: 'Bits Cheered',
            data: bitsArray.map((bitsData:any) =>{return bitsData[1]}),
            borderColor: 'rgb(16, 68, 165)',
            backgroundColor: 'rgba(16, 68, 165, .75)',
          }
        ],
    };

    return(
        <div className='cg-graph-elements'>
            <Bar options={options} data={data}/>
        </div>
    )
}

export default BitsBar;