import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback, useState } from 'react';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

export const StartStop: FC = () => {
    const [status, setStatus] = useState(false);

    return (
        <div>
            <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={() => setStatus(!status)}
            >
                <span>{`${status ? "Stop Trading" : "Start Trading"}`} </span>
            </button>
        </div>
    );
};