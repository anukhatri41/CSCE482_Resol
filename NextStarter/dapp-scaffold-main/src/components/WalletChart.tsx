import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";

import React, {Component, useEffect, useState} from 'react';
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

interface balanceType {
  total_swaps: number
  pos_swaps: number
  err_swaps: number
  neg_swaps: number
  init_bal: number
  end_bal: number
  tot_prof: number
}

interface PropType {
  balanceData: balanceType[]
}

function WalletChart(props: PropType) {

  const [balances, setBalances] = useState(props.balanceData);

  useEffect(() => {
    if(props.balanceData !== balances) {
      setBalances(props.balanceData);
    }
  }, [props.balanceData]);

  // useEffect(() => {
  //   fetch("http://localhost:4000/S2S")
  //     .then(data => {
  //       return data.json();
  //     })
  //     .then(data => {
  //       setBalances(data);
  //     })
  //     .catch(err => {
  //       console.log(123123);
  //     });
  // }, []);

  // console.log(balances);
  var endBal = []
  for (let i = 0; i < balances.length ; i++) {endBal.push(balances[i].end_bal)}
  var labels = []
  for (let i = 1; i <= balances.length; i++) {labels.push(i)}
  
  var differenceColor = ((balances[balances.length - 1].end_bal - balances[0].init_bal) > 0) ? 'rgb(99, 255, 222, 0.5)' : 'rgb(255, 99, 132, 0.5)';
  

  const data = {
    labels,
    datasets: [
      {
        label: 'Wallet Balance',
        data: endBal,
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
            <h2>Wallet Balance</h2>
            <Line
            data={data}
            width={400}
            height={400}
            />
      </div>
    );
};

export default WalletChart;