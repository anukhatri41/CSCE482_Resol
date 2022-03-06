import * as web3 from '@solana/web3.js';
import {
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import base58 from 'bs58';

// Fetching credentials from .env
require('dotenv').config()
const details = {
    sender_keypair: process.env.SENDER_KEY as string,
    secret: process.env.SENDER_SECRET as string,
	reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
};

// Code to  create secret key from Keypair array. Just stick the keypair in here.
// const key: Uint8Array = Uint8Array.from();
// console.log(base58.encode(key))

// Creating Keypair object from secret key & reciever pubkey in .env
const sender = web3.Keypair.fromSecretKey(base58.decode(details.secret));
const reciever = new web3.PublicKey(details.reciever);
const devnet = 'https://api.devnet.solana.com';
const mainnet = 'https://api.mainnet-beta.solana.com';

// Choosing with cluster to use.
const ChosenCluster = mainnet;
const amount = 0.01;
// For anyone who might need this later, 0.000005 is the fee to send a transaction
//const amount = 0.245942938 - 0.000005; // Exact amount sending from compromised account minus fee amount

(async () => {
    // Establishing connection, generating necessary Keypair info
	console.log("Connecting to cluster: ", ChosenCluster)
	const connection = new web3.Connection(ChosenCluster, 'confirmed');
	console.log("Connected...")

	// Creating transaction
	console.log("Creating Transaction:");
    console.log("From: ", sender.publicKey.toString())
	console.log("To: ", reciever.toString());
    console.log("Amount Sent: %d SOL", amount)
	// Transaction Code
    const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: sender.publicKey,
          lamports: (LAMPORTS_PER_SOL) * amount,
          toPubkey: reciever 
        }),
      );
      const signature: string = await sendAndConfirmTransaction(connection, transaction, [sender]);
      console.log("tx: ", signature);
})();