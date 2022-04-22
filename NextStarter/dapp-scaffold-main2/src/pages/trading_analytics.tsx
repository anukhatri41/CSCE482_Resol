import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from 'next/router';

import {Chart, Line} from 'react-chartjs-2';
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
import { StartStop } from "components/StartStop";
import WalletChart from "components/WalletChart";
//import reRender from "hooks/reRender";
import {useEffect, useState} from 'react';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import {
//   Dropdown,
//   DropdownMenu,
//   DropdownToggle,
//   DropdownItem, 
//   ButtonDropdown} from 'reactstrap';
import { produceWithPatches } from "immer";
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


/*const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];


export const data = {
  labels,
  datasets: [
    {
      label: 'Wallet Balance',
      data: endBal,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
};*/

// export const reRender = () =>{
//   const router = useRouter()

//   useEffect(() => {
//       const interval = setInterval(() => {
//         reRender();
//       }, 1000);
  
//       return () => clearInterval(interval);
//     }, []);
//   // call this method whenever you want to refresh server-side props
//   const refreshData = () => router.replace(router.asPath);
// }



function Basics ({balanceData}) {
  const [balances, setBalances] = useState(balanceData)
  const [param, setParam] = useState('end_bal')
  const [open, setOpen] = useState(false)


    useEffect(() => {
      fetch('http://localhost:4000/S2S')
        .then((res) => res.json())
        .then((data) => {
          setBalances(data)
        })
    }, []) 
  
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <div className="md:hero mx-auto p-4">
    <div className="md:hero-content flex flex-col">
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#fa8b50] to-[#f9d472] pb-4">
        Trading Analytics
      </h1>
      <StartStop />
      <WalletChart key={balances} balanceData={balances} graph_param={param} />
    </div> 
  </div>
    </div>
  );
};

export default Basics;

export async function getServerSideProps(){
  const response = await fetch('http://localhost:4000/S2S')
  const balanceData = await response.json()

  return {
    props: {
      balanceData,
    }
  }
}