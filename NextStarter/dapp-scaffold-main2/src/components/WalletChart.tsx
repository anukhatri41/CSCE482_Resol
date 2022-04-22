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
import { Col, Container, Row } from 'reactstrap';

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
  graph_param: string
}

function WalletChart(props: PropType) {

  const [balances, setBalances] = useState(props.balanceData);
  const [graph_param, setGraphParam] = useState(props.graph_param);

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

  var graph_data = []
  
  var labels = []
  for (let i = 1; i <= balances.length; i++) {labels.push(i)}
  
  var differenceColor = 'rgb(99, 255, 222, 0.5)';
  ((balances[balances.length - 1].end_bal - balances[0].init_bal) > 0) ? 'rgb(99, 255, 222, 0.5)' : 'rgb(255, 99, 132, 0.5)';
  
  if (graph_param == "init_bal"){
    for (let i = 0; i < balances.length ; i++) {graph_data.push(balances[i].init_bal)}
    var differenceColor = ((balances[balances.length - 1].end_bal - balances[0].init_bal) > 0) ? 'rgb(99, 255, 222, 0.5)' : 'rgb(255, 99, 132, 0.5)';
  } else if (graph_param == "total_swaps") {
    for (let i = 0; i < balances.length ; i++) {graph_data.push(balances[i].total_swaps)}
    var differenceColor = ((balances[balances.length - 1].total_swaps - balances[0].total_swaps) > 0) ? 'rgb(99, 255, 222, 0.5)' : 'rgb(255, 99, 132, 0.5)';
  } else if(graph_param == "pos_swaps") {
    for (let i = 0; i < balances.length ; i++) {graph_data.push(balances[i].pos_swaps)}
  } else if(graph_param == "err_swaps") {
    for (let i = 0; i < balances.length ; i++) {graph_data.push(balances[i].err_swaps)}
    var differenceColor = 'rgb(255, 99, 132, 0.5)';
  } else if(graph_param == "neg_swaps") {
    for (let i = 0; i < balances.length ; i++) {graph_data.push(balances[i].neg_swaps)}
    var differenceColor = 'rgb(255, 99, 132, 0.5)';
  } else if(graph_param == "tot_prof") {
    for (let i = 0; i < balances.length ; i++) {graph_data.push(balances[i].tot_prof)}
    var differenceColor = ((balances[balances.length - 1].tot_prof - balances[0].tot_prof) > 0) ? 'rgb(99, 255, 222, 0.5)' : 'rgb(255, 99, 132, 0.5)';
  } else {
    for (let i = 0; i < balances.length ; i++) {graph_data.push(balances[i].end_bal)}
    var differenceColor = ((balances[balances.length - 1].end_bal - balances[0].init_bal) > 0) ? 'rgb(99, 255, 222, 0.5)' : 'rgb(255, 99, 132, 0.5)';
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Wallet Balance',
        data: graph_data,
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
        <div className="flex items-center justify-center p-5 space-x-5"> 
            <div>
                <h2>Wallet Balance</h2>
                    <Line
                    data={data}
                    width={400}
                    height={400}
                />
            </div>
                        
            <div>
                <div >
                    Initial Balance: {balances[0].init_bal}
                </div>
                <div>
                    End Balance: {balances[balances.length - 1].end_bal}
                </div>
                <div>
                    Positive Swaps: {balances[balances.length - 1].pos_swaps}
                </div>
                <div>
                    Negative Swaps: {balances[balances.length - 1].neg_swaps}
                </div>
                <div>
                    Error Swaps: {balances[balances.length - 1].err_swaps}
                </div>
                <div>
                    Total Swaps: {balances[balances.length - 1].total_swaps}
                </div>
                <div>
                    Total Profit: {balances[balances.length - 1].tot_prof}
                </div>
            </div>
      </div>
    );
};

export default WalletChart;