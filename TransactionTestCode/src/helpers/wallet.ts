// @ts-ignore
import Wallet from "@project-serum/sol-wallet-adapter";
import {
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import EventEmitter from "eventemitter3";

export interface WalletAdapter extends EventEmitter {
    publicKey: PublicKey | null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    connect: () => any;
    disconnect: () => any;
}

const cluster = "http://devnet.solana.com";
const connection = new Connection(cluster, "confirmed");
const wallet: WalletAdapter = new Wallet("https://www.sollet.io", cluster);

export async function sendMoney(destPubkeyStr:string, lamports: number = 500 * 1000000) {
    try{
        const destPubkey = new PublicKey(destPubkeyStr);
        const walletAccountInfo = await connection.getAccountInfo(wallet!.publicKey!);
        console.log("Wallet Account Info: ", walletAccountInfo?.data.length);
        const receiverAccountInfo = await connection.getAccountInfo(destPubkey);
        console.log("Reciever Account Info: ", receiverAccountInfo?.data.length);

        const instruction = SystemProgram.transfer({
            fromPubkey: wallet!.publicKey!,
            toPubkey: destPubkey,
            lamports
        });
        let trans = await setWalletTransaction(instruction);
        let signature = await signAndSendTransaction(wallet, trans);
        let result = await connection.confirmTransaction(signature, "singleGossip");
        console.log("money sent", result);
    } catch (e) {
        console.warn("Failed", e);
}

export async function setWalletTransaction(instruction: TransactionInstruction): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.add(instruction);
    transaction.feePayer = wallet!.publicKey!;
    let hash = await connection.getLatestBlockhash();
    console.log("blockhash", hash);
    transaction.recentBlockhash = hash.blockhash;
    return transaction;
}

export async function signAndSendTransaction(wallet: WalletAdapter, transaction: Transaction): Promise<string> {
    let signedTrans = await wallet.signTransaction(transaction);
    console.log("sign transaction");
    let signature = await connection.sendRawTransaction(signedTrans.serialize());
    console.log("send raw transaction");
    return signature;
}
