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
          <img src='/resol_logo.png' alt="Resol" width='55' height='55'/>
        </div>
        <h1 className="text-center text-6xl p-4 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#fa7948] to-[#f9d573]">
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
      </div>
    </div>
  );
};

