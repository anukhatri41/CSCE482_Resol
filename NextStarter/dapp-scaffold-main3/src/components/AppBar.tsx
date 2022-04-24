import { FC } from 'react';
import Link from "next/link";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAutoConnect } from '../contexts/AutoConnectProvider';

export const AppBar: FC = props => {
  const { autoConnect, setAutoConnect } = useAutoConnect();

  return (
    <div>

      {/* NavBar / Header */}
      <div className="navbar flex flex-row md:mb-1 shadow-lg bg-neutral text-neutral-content">
        <div className="navbar-start">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost">

            <svg className="inline-block w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        
          <div className="hidden sm:inline w-22 h-22 md:p-2">
            <div className="mx-auto  flex flex-row p-2 text-center items-center bg-neutral text-neutral-content">
                <div className="grid-flow-col pr-1 gap-4 text-center">
                  <img src='/resol_logo.png' alt="Resol" width='55' height='55'/>
                </div>
                <div >
                  <h2 className='font-semibold text-lg pl-1'>Resol</h2>
                </div>

              </div>

          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:inline md:navbar-center">
          <div className="flex items-stretch">
            <Link href="/">
              <a className="btn btn-ghost btn-sm rounded-btn">Home</a>
            </Link>
            <Link href="/analytics">
              <a className="btn btn-ghost btn-sm rounded-btn">Analytics</a>
            </Link>
            <Link href="/trading">
              <a className="btn btn-ghost btn-sm rounded-btn">Trade</a>
            </Link>
          </div>
        </div>

        {/* Wallet & Settings */}
        <div className="navbar-end">
          <div className="dropdown">
          </div>
        </div>
      </div>
      {props.children}
    </div>
  );
};