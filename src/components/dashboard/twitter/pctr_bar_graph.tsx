/**
 * Cesar Guerrero
 * 09/09/23
 * 
 * Bar Graph of a person's Profile Click Rate from their last ten tweets
 */

import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function PCTRBar(): JSX.Element{

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Profile Click Through Rate (PCTR)',
            },
            legend: {
                display: false,
            },
        },
        scales: {
            x:{
                title:{
                    display:true,
                    text:"Tweet"
                }
            },
            y:{
                title:{
                    display:true,
                    text:"PCTR %"
                }
            }
        },
        maintainAspectRatio: false,
    };

    let impressions = [2142, 1321, 2718, 2934, 1498, 2687, 1245, 1987, 1086, 2135]
    let profileClicks = [279, 437, 151, 367, 285, 439, 254, 324, 355, 121]
    let PCTR = []
    for(let i: number = 0; i < 10; i++){
        PCTR.push((profileClicks[i]/impressions[i])*100)
    }

    const data = {
        labels: [1,2,3,4,5,6,7,8,9,10],
        datasets: [
          {
            label: 'PCTR %',
            data: PCTR,
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

export default PCTRBar;