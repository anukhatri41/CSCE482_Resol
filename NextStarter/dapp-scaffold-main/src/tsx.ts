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
  import { executeJupiterSwap, retrieveJupRoutes, runUntilProfit, runUntilProfitV2, runUntilProfitV3 } from "./utils/jupiterSwap";
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
    soETH_MINT_ADDRESS
  } from "./constants";


function ret_t_2() {
    return 'returning from file';
}


const routeOutputV3 = async () => {
  
    require('dotenv').config()
    // const details = {
    //     sender_keypair: process.env.SENDER_KEY as string,
    //     secret: process.env.SENDER_SECRET as string,
    //     reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
    //     _RPC: process.env.RPC_ENDPOINT as string, // named _RPC because functions were throwing a fit when passing in details.RPC
    //     ENV: process.env.NODE_ENV as string
    //   };


    const details = {
        // sender_keypair: process.env.SENDER_KEY as string,
        secret: '2akQvj31HKvSajosHcfVKnjAcXmnzogqczcmDetGCQhgPWuygiPbYoEut8a6usKvMaiaoCXsNya3YZvrQ56P9pN7',
        reciever: '8g9jTe3uQCpXa3CnRgs1WuDzQStL9UBv6FKVGN7dxrVf',
        _RPC: 'https://still-red-tree.solana-mainnet.quiknode.pro/4824354cd8b2aa36d1b297cf55b13096b022a5e9/', // named _RPC because functions were throwing a fit when passing in details.RPC
        ENV: 'production'
    };
  
  
    // if secret key is in .env:
    const WALLET_PRIVATE_KEY = details.secret
    const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
    const owner = Keypair.fromSecretKey(USER_PRIVATE_KEY);
    const wrappedOwner = new PublicKey("72rqCZRbzJY27CnMeAV1tgV4YbfvgSo99cb7i81SEGU5");
    const env = details.ENV;
    const wallet = new Wallet(Keypair.fromSecretKey(USER_PRIVATE_KEY));
    console.log(wallet.payer);
  
    const RPC = details._RPC;
    const devnet = 'https://api.devnet.solana.com';
    const mainnet = 'https://api.mainnet-beta.solana.com';
    const serumAPI = 'https://solana-api.projectserum.com';
  
    // 2. Initialize Orca object with mainnet connection
    const connectionRPC = new Connection(RPC);
    const connection = new Connection(SOLANA_RPC_ENDPOINT);

    let inAmount = 0.01;
    let tokenIn = 'SOL';
    let tokenOut = 'SOL';
    let cont = true;
    let totalProfit = 0;

    console.time("Ran for");
    let initSOLBalance = await connection.getBalance(owner.publicKey);
    let beginningSOLBal = initSOLBalance;
    let totSwaps = 0;
    let positiveSwaps = 0;
    let negativeSwaps = 0;
    let swapsErr = 0;

    while (totSwaps < 500) {
      try {

        await createWSolAccount({connection, owner});

        totSwaps++;
        initSOLBalance = await connection.getBalance(owner.publicKey);
        console.log("Initial SOL Balance: ", initSOLBalance/LAMPORTS_PER_SOL);
        let token1 = SOL_MINT_ADDRESS;
        let token2 = [
          STEP_MINT_ADDRESS, 
          SHDW_MINT_ADDRESS, 
          sRLY_MINT_ADDRESS, 
          oneSOL_MINT_ADDRESS, 
          UXP_MINT_ADDRESS, 
          USDC_MINT_ADDRESS, 
          USDT_MINT_ADDRESS,
          soETH_MINT_ADDRESS,
          OXY_MINT_ADDRESS,
          mSOL_MINT_ADDRESS,
          stSOL_MINT_ADDRESS];
        let transactions = await runUntilProfitV3({connection, inAmount, owner, token1, token2, wrappedOwner, wallet});

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
        /////////// COMMENT OUT BETWEEN TO STOP SWAP ////////////////////////////////////////////////////
        
        const finalSOLBalance = await connection.getBalance(owner.publicKey);
        console.log("Final SOL Balance: ", finalSOLBalance/LAMPORTS_PER_SOL);
        console.log("Profit?: ", (finalSOLBalance-initSOLBalance)/LAMPORTS_PER_SOL);
        if ((finalSOLBalance-initSOLBalance)/LAMPORTS_PER_SOL > 0) {
          positiveSwaps++;
        } else if ((finalSOLBalance-initSOLBalance)/LAMPORTS_PER_SOL == 0) {
          swapsErr++;
        } else {
          negativeSwaps++;
        }

        totalProfit += (finalSOLBalance-initSOLBalance)/LAMPORTS_PER_SOL;

    
      } catch(err) {
        const finalSOLBalance = await connection.getBalance(owner.publicKey);
        console.log("Final SOL Balance: ", finalSOLBalance/LAMPORTS_PER_SOL);
        console.log("Profit?: ", (finalSOLBalance-initSOLBalance)/LAMPORTS_PER_SOL);
        totalProfit += (finalSOLBalance-initSOLBalance)/LAMPORTS_PER_SOL;
        if ((finalSOLBalance-initSOLBalance)/LAMPORTS_PER_SOL > 0) {
          positiveSwaps++;
        } else if ((finalSOLBalance-initSOLBalance)/LAMPORTS_PER_SOL == 0) {
          swapsErr++;
        } else {
          negativeSwaps++;
        }

        console.warn(err);
      }
    }
    const endingSOLBalance = await connection.getBalance(owner.publicKey);

    console.log("FINAL META: ");
    console.timeEnd("Ran for");
    console.log("Total Swaps: ", totSwaps);
    console.log("Positive Swaps: ", positiveSwaps);
    console.log("Errored Swaps: ", swapsErr);
    console.log("Negative Swaps: ", negativeSwaps);
    console.log("Beginning Balance: ",beginningSOLBal/LAMPORTS_PER_SOL);
    console.log("Ending Balance: ",endingSOLBalance/LAMPORTS_PER_SOL);
    console.log("Total Profit: ", totalProfit);
  }
  



export {ret_t_2, routeOutputV3};