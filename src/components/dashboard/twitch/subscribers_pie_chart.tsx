/**
 * Cesar Guerrero
 * 09/20/23
 * 
 * Pie Chart of the subscriber tiers for a Twitch Streamer
 */

import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function SubscribersPie({subscribersTierArray}:{subscribersTierArray:any}): JSX.Element{
    const options = {
        response: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Subscriber Tiers',
            },
        }
    }
    
    const data = {
        labels: ['Tier 1', 'Tier 2', 'Tier 3'],
        datasets: [
            {
                label: 'Subscriber Tier',
                data: subscribersTierArray,
                backgroundColor: [
                    'rgba(183, 44, 123, .75)',
                    'rgba(98, 14, 90, .75)',
                    'rgba(16, 68, 165, .75)',
                ],
                borderColor: [
                    'rgb(183, 44, 123)',
                    'rgb(98, 14, 90)',
                    'rgb(16, 68, 165)',
                ],
                borderWidth: 1,
            },
        ],
    };

  return(
    <div className='cg-graph-elements'>
        {<Pie options= {options} data={data}/>}
    </div>
  )
}

export default SubscribersPie;