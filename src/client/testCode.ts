import { 
  Connection, 
  Keypair, 
  LAMPORTS_PER_SOL, 
  PublicKey, 
  Signer,
  sendAndConfirmTransaction,
  TokenAccountsFilter,
  TransactionInstruction,
  Transaction
 } from "@solana/web3.js";
import { executeOrcaSwap, getOrcaQuote } from "./utils/orcaSwap";
import { executeJupiterSwap, retrieveJupRoutes } from "./utils/jupiterSwap";
import { fetchWalletBalance } from "./utils/shared";
import bs58 from "bs58";
import {
  OXY_MINT_ADDRESS,
  SOLANA_RPC_ENDPOINT
} from "./constants";
const sleep = require('./sleep');

const routeOutput = async () => {

  require('dotenv').config()
  const details = {
      sender_keypair: process.env.SENDER_KEY as string,
      secret: process.env.SENDER_SECRET as string,
      reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
      _RPC: process.env.RPC_ENDPOINT as string, // named _RPC because functions were throwing a fit when passing in details.RPC
  };

  // if secret key is in .env:
  const WALLET_PRIVATE_KEY = details.secret
  const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
  const owner = Keypair.fromSecretKey(USER_PRIVATE_KEY);
  // console.log(owner);
  
  const RPC = details._RPC;
  const devnet = 'https://api.devnet.solana.com';
  const mainnet = 'https://api.mainnet-beta.solana.com';
  const serumAPI = 'https://solana-api.projectserum.com';

  // 2. Initialize Orca object with mainnet connection
  const connection = new Connection(SOLANA_RPC_ENDPOINT);

  // Info
  let inAmount1 = 0.01;
  let tokenIn1 = 'SOL';
  let tokenOut1 = 'SOL';

  let inAmount2 = 0.96763;
  let tokenIn2 = 'OXY';
  let tokenOut2 = 'SOL';

  try {
    // while 
  const transactions_1 = await retrieveJupRoutes({connection, inAmount: inAmount1, owner, tokenIn: tokenIn1, tokenOut: tokenOut1});

  // const transactions_2 = await retrieveJupRoutes({connection, inAmount: inAmount2, owner, tokenIn: tokenIn2, tokenOut: tokenOut2});

  // console.log(transactions_2.swapTransaction.instructions);
  
  // let instructions: TransactionInstruction[] = [];
  // let cleanupInstructions: TransactionInstruction[] = [];
  let signers: Signer[] = [owner];
  //let transactionArray: Transaction[] = [transaction.setupTransaction, transaction.swapTransaction, transaction.cleanupTransaction]
  
  const connection_1 = new Connection(RPC);

  let setupTransaction = transactions_1.setupTransaction;
  let swapTransaction = transactions_1.swapTransaction;
  let cleanupTransaction = transactions_1.cleanupTransaction;

  for (let serializedTransaction of [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
    // get transaction object from serialized transaction
    if (serializedTransaction) {

      const txid = await connection_1.sendTransaction(serializedTransaction, signers, {
        skipPreflight: true
      })
      await connection_1.confirmTransaction(txid)
      console.log(`TX1 SOL->SOL: https://solscan.io/tx/${txid}`)
    }
  }
  
  // const { setupTransaction, swapTransaction, cleanupTransaction } = transactions_2;
  // let setupTransaction = transactions_2.setupTransaction;
  // let swapTransaction = transactions_2.swapTransaction;
  // let cleanupTransaction = transactions_2.cleanupTransaction;

  // for (let serializedTransaction of [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
  //   // get transaction object from serialized transaction
  //   if (serializedTransaction) {
  //     // const transaction = Transaction.from(Buffer.from((serializedTransaction.toString(), 'base64')))
  //     // // perform the swap
  //     const txid = await connection.sendTransaction(serializedTransaction, signers, {
  //       skipPreflight: true
  //     })
  //     await connection.confirmTransaction(txid)
  //     console.log(`TX2 OXY->SOL: https://solscan.io/tx/${txid}`)
  //   }
  // }

  //const signature: string = await sendAndConfirmTransaction(connection, transaction.swapTransaction, signers);
  // console.log("tx: ", signature);

  } catch(err) {
    console.warn(err);
  }
}

const main = async () => {
    
  await routeOutput();

  };
    main()
      .then(() => {
  
        console.log("Done");
      })
      .catch((e) => {
        console.error(e);
      });