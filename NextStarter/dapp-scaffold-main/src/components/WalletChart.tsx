import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";

import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



// export function render() {
//     return(
    
//     <div>
//         {this.state.readDataLoaded ? <h1>dasdas</h1> : null}
//     </div>  
       
//     )
//   }




  


//---------------------------------

export const WalletChart = (props) => {

//   var balance_data = readData();
//   console.log(balance_data);

    // if(this.state.readDataLoaded == true){
    //     console.log('f')

    // }

    var bal = []
    for (let i = 0; i < props.balanceData.length ; i++) {bal.push(props.balanceData[i].totalBalance)}
    var labels = []
    for (let i = 1; i <= props.balanceData.length; i++) {labels.push(i)}

    var differenceColor = ((props.balanceData[props.balanceData.length - 1].totalBalance - props.balanceData[0].totalBalance) > 0) ? 'rgb(99, 255, 222, 0.5)' : 'rgb(255, 99, 132, 0.5)';







    const data = {
    labels,
    datasets: [
        {
        label: 'Wallet Balance',
        data: bal,
        borderColor: differenceColor,
        backgroundColor: differenceColor,
        }
    ],
    options: {
        scales: {
        yAxes: [{
            scaleLabel: {
            display: true,
            labelString: 'SOL Balance'
            }
        }],
        xAxes: [{
            scaleLabel: {
            display: true,
            labelString: 'Transaction Iteration'
            }
        }],
        }     
    }
    };

    return (
        <div>
            <br/>
            <br/>
            <br/>
            <Line
            data={data}
            width={400}
            height={400}
            />
        </div>
    );
};