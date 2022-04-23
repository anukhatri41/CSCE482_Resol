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
  import { executeOrcaSwap, getOrcaQuote, orcaTwoWayTrade } from "./utils/orcaSwap";
  import { runUntilProfitV3 } from "./utils/jupiterSwap";
  import { fetchWalletBalance, createWSolAccount, createWSolAccountWallet } from "./utils/shared";
  import { raydiumSwap } from "./utils/raydiumSwap";
  import { Wallet } from "@project-serum/anchor";
  import bs58 from "bs58";
  import {
    closeAccount
  } from "@solana/spl-token2.0";
  import {
    ENV,
    INPUT_MINT_ADDRESS,
    OUTPUT_MINT_ADDRESS,
    SOLANA_RPC_ENDPOINT,
    SOL_MINT_ADDRESS,
    OXY_MINT_ADDRESS,
    mSOL_MINT_ADDRESS,
    STEP_MINT_ADDRESS,
    Token,
    USDC_MINT_ADDRESS,
    stSOL_MINT_ADDRESS,
    oneSOL_MINT_ADDRESS,
    ALL_MINT_ADDRESS,
    SHDW_MINT_ADDRESS,
    sRLY_MINT_ADDRESS,
    USDT_MINT_ADDRESS,
    UXP_MINT_ADDRESS,
    soETH_MINT_ADDRESS,
    UST_MINT_ADDRESS,
    PRT_MINT_ADDRESS
  } from "./constants";
  import fetch from "isomorphic-fetch";
import { exec } from "child_process";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";


  const axios = require('axios');



const routeOutputV3 = async () => {
  
    require('dotenv').config()
    // const details = {
    //     sender_keypair: process.env.SENDER_KEY as string,
    //     secret: process.env.SENDER_SECRET as string,
    //     reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
    //     _RPC: process.env.RPC_ENDPOINT as string, // named _RPC because functions were throwing a fit when passing in details.RPC
    //     ENV: process.env.NODE_ENV as string
    //   };


    let response = await fetch('http://localhost:4000/tsx_params/1')
    let tsx_params = await response.json()

    var iter = tsx_params.iterations;
    var amountToTrade = tsx_params.amount;

    // for (let i = 0; i < iter; i++) {
    //   const stop_response = await fetch('http://localhost:4000/tsx_params/1')
    //   const stop_flag = await stop_response.json();

    //   if(stop_flag.stop == true){
    //     break;
    //   }
    //}

    let inAmount: number = +amountToTrade;
    let iterations: number = +iter;
  
    require('dotenv').config()
    // const details = {
    //     sender_keypair: process.env.SENDER_KEY as string,
    //     secret: process.env.SENDER_SECRET as string,
    //     reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
    //     _RPC: process.env.RPC_ENDPOINT as string, // named _RPC because functions were throwing a fit when passing in details.RPC
    //     ENV: process.env.NODE_ENV as string
    //   };
  
    // if secret key is in .env:
    const WALLET_PRIVATE_KEY = "4m931s47cehpTu24sVifJza3nEHD4jLKRAqDQiciNiVeqWeAMjGFmwNhYGJRmhjkNws7AcAVLpXyL2CiKFicy3px";
    const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
    const owner = Keypair.fromSecretKey(USER_PRIVATE_KEY);
    //const wrappedOwner = new PublicKey("72rqCZRbzJY27CnMeAV1tgV4YbfvgSo99cb7i81SEGU5");
    //const env = details.ENV;
    // const wallet = new Wallet(Keypair.fromSecretKey(USER_PRIVATE_KEY));
    // console.log(wallet.payer);
  
    const RPC = "https://still-red-tree.solana-mainnet.quiknode.pro/4824354cd8b2aa36d1b297cf55b13096b022a5e9/";
    const devnet = 'https://api.devnet.solana.com';
    const mainnet = 'https://api.mainnet-beta.solana.com';
    const serumAPI = 'https://solana-api.projectserum.com';
  
    // 2. Initialize Orca object with mainnet connection
    const connectionRPC = new Connection(RPC);
    const connection = new Connection(mainnet);

    //let inAmount = 0.1;
    let tokenIn = 'SOL';
    let tokenOut = 'SOL';
    let cont = true;
    let totalProfit = 0;

    console.time("Ran for");

    
    
    let totSwaps = 0;
    let positiveSwaps = 0;
    let negativeSwaps = 0;
    let swapsErr = 0;

    let stop_flag_triggered = false;
    let wSOLAddress = await createWSolAccount({connection, owner});
    let initSOLBalance = await connection.getBalance(owner.publicKey);
    let initwSOLBalance = await connection.getBalance(wSOLAddress);
    let initTotalBalance = initSOLBalance + initwSOLBalance
    let beginningSOLBal = initTotalBalance;

    while ((totSwaps < iterations) && !stop_flag_triggered) {
      try {

        if (totSwaps != 0) {
          wSOLAddress = await createWSolAccount({connection, owner});
        }

        totSwaps++;
        initSOLBalance = await connection.getBalance(owner.publicKey);
        initwSOLBalance = await connection.getBalance(wSOLAddress);
        initTotalBalance = initSOLBalance + initwSOLBalance
        console.log("Initial SOL Balance: ", (await connection.getBalance(owner.publicKey) + (await connection.getBalance(wSOLAddress)))/LAMPORTS_PER_SOL);
        
        let token1 = SOL_MINT_ADDRESS;
        let token2 = [
          STEP_MINT_ADDRESS, 
          SHDW_MINT_ADDRESS, 
          sRLY_MINT_ADDRESS, 
          oneSOL_MINT_ADDRESS,
          ALL_MINT_ADDRESS, 
          UXP_MINT_ADDRESS, 
          USDC_MINT_ADDRESS, 
          USDT_MINT_ADDRESS,
          soETH_MINT_ADDRESS,
          OXY_MINT_ADDRESS,
          mSOL_MINT_ADDRESS,
          stSOL_MINT_ADDRESS,
          UST_MINT_ADDRESS,
          PRT_MINT_ADDRESS];

        let transactions = await runUntilProfitV3({connection: connectionRPC, inAmount, owner, token1, token2});
        stop_flag_triggered = transactions.stop_flag_triggered;
        if (stop_flag_triggered == true) {
          continue;
        }

        if (transactions.transactions1.swapTransaction) {

          let signers: Signer[] = [owner];

          console.log("Initial SOL Balance: ", initSOLBalance/LAMPORTS_PER_SOL);

          const payload = new Transaction();

          console.log(transactions.transactions1.swapTransaction.instructions);
          payload.add(transactions.transactions1.swapTransaction);
          payload.add(transactions.transactions2.swapTransaction);

          /////////// COMMENT OUT BETWEEN TO STOP SWAP ////////////////////////////////////////////////////
          for (let serializedTransaction of [payload].filter(Boolean)) {
            // get transaction object from serialized transaction
            if (serializedTransaction) {
        
              const txid = await connectionRPC.sendTransaction(serializedTransaction, signers, {
                skipPreflight: true
              })
              await connectionRPC.confirmTransaction(txid)
              console.log(`TX${serializedTransaction.toString()}: https://solscan.io/tx/${txid}`)
            }
          }
        }
        /////////// COMMENT OUT BETWEEN TO STOP SWAP ////////////////////////////////////////////////////
        
        // const finalSOLBalance = await connection.getBalance(owner.publicKey);
        // initSOLBalance = await connection.getBalance(owner.publicKey);
        // initwSOLBalance = await connection.getBalance(wSOLAddress);
        const finalwSOLBalance = await connection.getBalance(wSOLAddress);
        const finalSOLBalance = await connection.getBalance(owner.publicKey)
        const finalTotalBalance = (finalwSOLBalance+finalSOLBalance)
        console.log("SOL Balance After Most Recent Swap: ", (finalwSOLBalance+finalSOLBalance)/LAMPORTS_PER_SOL);
        console.log("Profit?: ", (finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL);
        if ((finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL > 0) {
          positiveSwaps++;
        } else if ((finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL == 0) {
          swapsErr++;
        } else {
          negativeSwaps++;
        }

        totalProfit += (finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL;

    
      } catch(err) {
        try {
          exec("sleep 5")
          const finalwSOLBalance = await connection.getBalance(wSOLAddress);
          const finalSOLBalance = await connection.getBalance(owner.publicKey)
          const finalTotalBalance = (finalwSOLBalance+finalSOLBalance)
          console.log("SOL Balance After Most Recent Swap: ", (finalwSOLBalance+finalSOLBalance)/LAMPORTS_PER_SOL);
          console.log("Profit?: ", (finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL);
          if ((finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL > 0) {
            positiveSwaps++;
          } else if ((finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL == 0) {
            swapsErr++;
          } else {
            negativeSwaps++;
          }
        }
        catch (error) {
          console.log("error error")
        }

        console.warn(err);
      }
    }

    console.log("closing account")
    await closeAccount(connection, owner, wSOLAddress, owner.publicKey, owner);

    const endingSOLBalance = await connection.getBalance(owner.publicKey);

    console.log("FINAL META: ");
    console.timeEnd("Ran for");
    console.log("Total Swaps: ", totSwaps);
    console.log("Positive Swaps: ", positiveSwaps);
    console.log("Errored Swaps: ", swapsErr);
    console.log("Negative Swaps: ", negativeSwaps);
    console.log("Beginning Balance: ",beginningSOLBal/LAMPORTS_PER_SOL);
    console.log("Ending Balance: ",endingSOLBalance/LAMPORTS_PER_SOL);
    console.log("Total Profit: ", (endingSOLBalance-beginningSOLBal)/LAMPORTS_PER_SOL);
  }
  
export { routeOutputV3};