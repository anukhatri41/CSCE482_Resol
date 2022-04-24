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
    graph_param: string
    totalSwaps: number
    initBal: number
    endBal: number
    posSwaps: number
    negSwaps: number
    errSwaps: number
    totProf: number
  }


//---------------------------------

export const WalletChart = (props: PropType) => {
    const [balances, setBalances] = useState(props.balanceData);
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
                <div>
                    Total Profit: {props.totProf}
                </div>
                <div>
                    Total Swaps: {props.totalSwaps}
                </div>
                <div>
                    Positive Swaps: {props.posSwaps}
                </div>
                <div>
                    Negative Swaps: {props.negSwaps}
                </div>
                <div>
                    Error Swaps: {props.errSwaps}
                </div>
            </div>
      </div>
    );
};