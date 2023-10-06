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

function VideoLineGraph({videoArray}:{videoArray: any}): JSX.Element{
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'VOD View Count for Last 10 VODs',
            },
            legend: {
                display: false,
            },
        },
        scales: {
            x:{
                title:{
                    display:true,
                    text:"Video"
                }
            },
            y:{
                title:{
                    display:true,
                    text:"Views"
                }
            }
        },
        maintainAspectRatio: false,
    };

    const data = {
        labels: videoArray.map((videoData:any) =>{return videoData[1]}),
        datasets: [
          {
            label: 'Views',
            data: videoArray.map((videoData:any) =>{return videoData[0]}),
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

export default VideoLineGraph