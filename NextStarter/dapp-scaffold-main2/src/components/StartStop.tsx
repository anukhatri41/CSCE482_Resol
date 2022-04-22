import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback, useState } from 'react';
import { notify } from "../utils/notifications";

export const StartStop: FC = () => {
    const [status, setStatus] = useState(false);

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        setStatus(!status);

        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }

        let signature: TransactionSignature = '';
        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: Keypair.generate().publicKey,
                    lamports: 1,
                })
            );

            signature = await sendTransaction(transaction, connection);

            await connection.confirmTransaction(signature, 'confirmed');
            notify({ type: 'success', message: 'Transaction successful!', txid: signature });
        } catch (error: any) {
            notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
            console.log('error', `Transaction failed! ${error?.message}`, signature);
            return;
        }
    }, [publicKey, notify, connection, sendTransaction]);

    return (
        <div>
            <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#fa8b50] to-[#f9d472] hover:from-[#3DA5EB] hover:to-[#2CBDD4]..."
                onClick={onClick}
            >
                <span>{`${status ? "Stop Trading" : "Start Trading"}`} </span>
            </button>
        </div>
    );
};