// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet

// Components
import pkg from '../../../package.json';

// Store

export const HomeView: FC = ({ }) => {

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className="text-center">
          <img src='/resol_logo.png' alt="Resol" width='150' height='150'/>
        </div>
        <h1 className="text-center text-6xl px-4 pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#fa7948] to-[#f9d573]">
          Resol
        </h1>    
        <div className="text-center text-4xl p-4">
            A new way for arbitrage on the Solana Blockchain
        </div>
        <div className="text-center">
          <Link href="/analytics">
            <div className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#f9d573] to-[#fa7948] hover:from-[#0CC7E8] hover:to-[#0CE87E] ...">
              Launch App
            </div>
          </Link>
        </div>
        <div className='text-center w-3/5 pt-12'>
          <div>
            <div className='text-3xl font-semibold pb-4'>
              About Us
            </div>
            <p className='text-md pb-2'>
              Resol was created in 2022 as part of CSCE 482 - Senior Capstone at Texas A&amp;M University.
            </p>
            <p className='text-md pb-2'>
              The team found there was a gap in the market for cryptocurrency arbitrage software that was user-friendly with a good UI. The team then created an application that lets the user input their private wallet key and start trading automatically with the ability to start and stop trading, see trading analytics, and make a profit!
            </p>
            <p className='text-md'>
              Jupiter Aggregator's price routing feature was utilized to find the most profitable swaps. From there, atomic transactions were created to swap the tokens on the Solana Blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

