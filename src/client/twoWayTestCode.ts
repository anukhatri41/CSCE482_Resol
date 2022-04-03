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
  
    const RPC = details._RPC;
    const devnet = 'https://api.devnet.solana.com';
    const mainnet = 'https://api.mainnet-beta.solana.com';
    const serumAPI = 'https://solana-api.projectserum.com';
  
    // 2. Initialize Orca object with mainnet connection
    const connection = new Connection(RPC);
  
    // Info
    let inAmount = 0.1;
    let tokenIn = 'SOL';
    let tokenOut = 'OXY';
  
    try {

    const quoteInfo = await getOrcaQuote({connection, tokenIn, tokenOut, inAmount})
    console.log("QUOTE FOR AMT OF OXY FOR 0.1 SOL: ", quoteInfo);

    const transactionSO = await retrieveJupRoutes({connection, inAmount, owner, tokenIn, tokenOut});
    console.log(transactionSO.swapTransaction.instructions);
  
    inAmount = quoteInfo;
    tokenIn = 'OXY';
    tokenOut = 'SOL';
  
    const transactionOS = await retrieveJupRoutes({connection, inAmount, owner, tokenIn, tokenOut});
    console.log(transactionOS.swapTransaction.instructions);
    
    // let instructions: TransactionInstruction[] = [];
    // let cleanupInstructions: TransactionInstruction[] = [];
    let signers: Signer[] = [owner];
    //let transactionArray: Transaction[] = [transaction.setupTransaction, transaction.swapTransaction, transaction.cleanupTransaction]
    let setupTransaction = transactionOS.setupTransaction;
    let swapTransaction = transactionOS.swapTransaction;
    let cleanupTransaction = transactionOS.cleanupTransaction;
    //const { setupTransaction, swapTransaction, cleanupTransaction } = transactions
    // transaction.swapTransaction.instructions.forEach((curr) => {
    //   // signers = signers.concat(curr)
    // });
    // transaction.swapTransaction.sign(owner)
  
    // signers.concat(transaction.swapTransaction.signatures);
  
    //console.log(transaction.swapTransaction.signatures);
    // const txid = await connection.sendTransaction(transactionSO.swapTransaction, signers, {
    //       skipPreflight: true
    //     });
    //     await connection.confirmTransaction(txid)
    //   console.log(`https://solscan.io/tx/${txid}`)
  
      console.log("SEARLIZING");
      const payload = new Transaction();
      if (setupTransaction) {
        console.log('setupTransaction: ', setupTransaction);
        payload.add(setupTransaction);
      }
      payload.add(transactionSO.swapTransaction);
      payload.add(swapTransaction);
      if (cleanupTransaction) {
        console.log('cleanupTransaction: ', cleanupTransaction);
        payload.add(cleanupTransaction);
      }

      const txid = await connection.sendTransaction(payload, signers, {
        skipPreflight: true
      })

      await connection.confirmTransaction(txid)
      console.log(`TX1 SOL->OXY: https://solscan.io/tx/${txid}`)

      // for (let serializedTransaction of [setupTransaction, transactionSO.swapTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
      //   // get transaction object from serialized transaction
      //   if (serializedTransaction) {
    
      //     const txid = await connection.sendTransaction(serializedTransaction, signers, {
      //       skipPreflight: true
      //     })
      //     await connection.confirmTransaction(txid)
      //     console.log(`TX1 SOL->OXY: https://solscan.io/tx/${txid}`)
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