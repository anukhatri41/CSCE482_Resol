import type { NextPage } from "next";
import Head from "next/head";

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
import StartStop  from "components/StartStop";

import React, { useState, Component } from 'react'
// import 'bootstrap/dist/css/bootstrap.css';

import { AES, enc } from 'crypto-ts';

//import Dropdown from 'react-bootstrap/Dropdown'

import {WalletChart} from "components/WalletChart"


const axios = require('axios');

const saveParams = (amo, walSec) => {

  console.log("wallet secret",walSec)
  const encryptedSec = AES.encrypt(JSON.stringify(walSec), 'secret key crypto');
  console.log("encrypted secret",encryptedSec);


  axios.put('http://localhost:4000/tsx_params/1', {
    amount: amo,
    stop: true,
    walletSecret: encryptedSec
  
  }).then(resp => {
    console.log(resp.data);
  }).catch(error => {
    console.log(error);
  });
};


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

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Wallet Balance',
//       data: endBal,
//       borderColor: 'rgb(255, 99, 132)',
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     }
//   ],
//   options: {
//     scales: {
//       yAxes: [{
//         scaleLabel: {
//           display: true,
//           labelString: 'SOL Balance'
//         }
//       }],
//       xAxes: [{
//         scaleLabel: {
//           display: true,
//           labelString: 'Transaction Iteration'
//         }
//       }],
//     }     
//   }
// };


function Basics ({balanceData}) {

  const [amount, setAmount] = useState(".01");

  const [walletSecret, setWalletSecret] = useState("123456");

  return (
    <div>
      <Head>
        <title>Resol Analytics</title>
        <meta
          name="Trading Analytics"
          content="Trading Analytics"
        />
      </Head>
      <div className="md:hero mx-auto p-4">

    <div className="md:hero-content flex flex-col">
      <h1 className="text-center pb-4 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#fa7948] to-[#f9d573]">
        Analytics
      </h1>

        <h3>Amount of SOL per transaction: </h3>
        <input
          type="text" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{backgroundColor: "black", width: "20%", textAlign: "center" }}
        />


      <h3>Wallet Secret: </h3>
        <input
          type="password" 
          value={walletSecret}
          onChange={(e) => setWalletSecret(e.target.value)}
          style={{backgroundColor: "black", width: "80%", textAlign: "center"}}
        />


      <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#f9d573] to-[#fa7948] hover:from-[#0CC7E8] hover:to-[#0CE87E] ..."
                onClick={() => saveParams(amount, walletSecret)}
      >
                <span>{`${"Save Trading Parameters"}`} </span>
      </button>

      <div>
        {<WalletChart balanceData={balanceData}/> }
      </div>

    </div> 
  </div>
    </div>
  );
};

export default Basics;


export async function getServerSideProps(){
  console.log("howdy");
  const response = await fetch('http://localhost:4000/graph_data')
  const balanceData = await response.json()

  return {
    props: {
      balanceData,
    }
  }
}