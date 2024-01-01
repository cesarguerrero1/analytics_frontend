/**
 * Cesar Guerrero
 * 09/09/23
 * 
 * Line Graph Element that will render a Line Graph of Impressions over the last ten tweets
 */

//Import Charts
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip} from 'chart.js';
import { Line } from 'react-chartjs-2';

//Register Chart Elements
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title, Tooltip);

function ImpressionsLine(): JSX.Element{
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Impressions for Last 10 Tweets',
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
                    text:"Impressions"
                }
            }
        },
        maintainAspectRatio: false,
    };

    const data = {
        labels: [1,2,3,4,5,6,7,8,9,10],
        datasets: [
          {
            label: 'Impressions',
            data: [2142, 1321, 2718, 2934, 1498, 2687, 1245, 1987, 1086, 2135],
            borderColor: 'rgb(183, 44, 123)',
            backgroundColor: 'rgba(183, 44, 123, .75)',
          }
        ],
    };
    
    return(
        <div className='cg-graph-elements'>
            <Line options={options} data={data}/>
        </div>
    )
}

export default ImpressionsLine