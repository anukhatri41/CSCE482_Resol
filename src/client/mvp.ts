// import { readFile } from "mz/fs";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, TokenAccountsFilter } from "@solana/web3.js";
import { executeOrcaSwap } from "./utils/orcaSwap"
import { executeJupiterSwap } from "./utils/jupiterSwap"
import { fetchWalletBalance } from "./utils/shared"
import bs58 from "bs58"
import {
  OXY_MINT_ADDRESS,
} from "./constants";
const sleep = require('./sleep');

// Swapping from OXY -> SOL -> OXY
// const main = async () => {
//   /*** Setup ***/
//   // 1. Read secret key file to get owner keypair
//   // const secretKeyString = await readFile("/Users/gtugwell/.config/solana/id.json", {
//   //   encoding: "utf8",
//   // });
//   // const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
//   // const owner = Keypair.fromSecretKey(secretKey);

//   require('dotenv').config()
//   const details = {
//       sender_keypair: process.env.SENDER_KEY as string,
//       secret: process.env.SENDER_SECRET as string,
//       reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
//       _RPC: process.env.RPC_ENDPOINT as string, // named _RPC because functions were throwing a fit when passing in details.RPC
//   };

//   // if secret key is in .env:
//   const WALLET_PRIVATE_KEY = details.secret
//   const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
//   const owner = Keypair.fromSecretKey(USER_PRIVATE_KEY);

//   const RPC = details._RPC;
//   const devnet = 'https://api.devnet.solana.com';
//   const mainnet = 'https://api.mainnet-beta.solana.com';
//   const serumAPI = 'https://solana-api.projectserum.com';

//   // 2. Initialize Orca object with mainnet connection
//   const connection = new Connection(RPC);

//   // get initial SOL and OXY balances in wallet
//   const initSOLBalance = await connection.getBalance(owner.publicKey);
//   let tokenAccountsFilter: TokenAccountsFilter = {mint: new PublicKey(OXY_MINT_ADDRESS)}
//   const initOXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);
//   console.log("Initial SOL Balance: ", initSOLBalance/LAMPORTS_PER_SOL);
//   console.log("Initial OXY Balance: ", initOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount)
 
  

//   // Execute swap on orca

//   // We will now swap back and forth, between SOL and OXY to try and generate profit.
//   // Info for Orca
//   let tokenIn = 'OXY';
//   let tokenOut = 'SOL';
//   let inAmount = 1;
  
//   console.log("First Swap", inAmount,"OXY for SOL.");
//   // HOW executeOrcaSwap WORKS: pass in connection, owner is your public key, tokenIn: either SOL or OXY, tokenOut: either SOL or OXY
//   // inAmount: needs to be a number small enough to actually be traded out of your account.
//   const resOrca = await executeOrcaSwap({connection, owner, tokenIn, tokenOut, inAmount});

//   const midSOLBalance = await connection.getBalance(owner.publicKey);
//   const midOXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);

//   // error checking for Orca Swap
//   // if resOrca is defined, then executeOrcaSwap returned value from an error catch
//   // also checks if sol balance to trade with jupiter (inAmount) is <= 0 
//   if (resOrca || (midSOLBalance - initSOLBalance)/LAMPORTS_PER_SOL <= 0) {
//     console.log("Error with Orca swap.")
//     // break // (for when a while loop is placed around everything)
//     return
//   }
//   else {
//     console.log("ORCA SWAP FINISHED.");
//   }
  

//   console.log("Amount of SOL recieved: ", (midSOLBalance - initSOLBalance)/LAMPORTS_PER_SOL);
//   console.log("Amount of OXY traded: ", (initOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount 
//                                           - midOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount))
  

//   // // Info for Jupiter
//   tokenIn = 'SOL';
//   tokenOut = 'OXY';
//   inAmount = (midSOLBalance - initSOLBalance) / LAMPORTS_PER_SOL; // Should only trade what we got in exchange for our intial Oxy

//   // HOW executeJupiterSwap WORKS: pass in connection, owner is your public key, tokenIn: either SOL or OXY, tokenOut: either SOL or OXY
//   // inAmount: needs to be a number small enough to actually be traded out of your account.
//   const resJup = await executeJupiterSwap({connection, owner, tokenIn, tokenOut, inAmount});
//   if (resJup) {
//     console.log("Error with Jupiter swap.")
//     // break // (for when a while loop is placed around everything)
//     return
//   }

//   console.log("JUPITER SWAP FINISHED")

//   const finalSOLBalance = await connection.getBalance(owner.publicKey);
//   const finalOXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);
//   console.log("Final SOL Balance: ", finalSOLBalance/LAMPORTS_PER_SOL);
//   console.log("Final OXY Balance: ", finalOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount)

//   let profit = (finalSOLBalance - initSOLBalance)/LAMPORTS_PER_SOL;
//   console.log("SOL Profit Made: ", profit)
  
// };

// Swapping from SOL -> OXY -> SOL
const main = async () => {
    /*** Setup ***/
    // 1. Read secret key file to get owner keypair
    // const secretKeyString = await readFile("/Users/gtugwell/.config/solana/id.json", {
    //   encoding: "utf8",
    // });
    // const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    // const owner = Keypair.fromSecretKey(secretKey);

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

    // get initial SOL and OXY balances in wallet
    const initSOLBalance = await connection.getBalance(owner.publicKey);
    let tokenAccountsFilter: TokenAccountsFilter = {mint: new PublicKey(OXY_MINT_ADDRESS)}
    const initOXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);
    console.log("Initial SOL Balance: ", initSOLBalance/LAMPORTS_PER_SOL);
    console.log("Initial OXY Balance: ", initOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount)
   
    

    // Execute swap on orca

    // We will now swap back and forth, between SOL and OXY to try and generate profit.
    // Info for Orca
    // let tokenIn = 'OXY';
    // let tokenOut = 'SOL';
    // let inAmount = 1;

    let tokenIn = 'SOL';
    let tokenOut = 'OXY';
    let inAmount = 0.01;
    
    console.log("First Swap", inAmount,"SOL for OXY.");
    // HOW executeOrcaSwap WORKS: pass in connection, owner is your public key, tokenIn: either SOL or OXY, tokenOut: either SOL or OXY
    // inAmount: needs to be a number small enough to actually be traded out of your account.
    const resOrca = await executeOrcaSwap({connection, owner, tokenIn, tokenOut, inAmount});

    const midSOLBalance = await connection.getBalance(owner.publicKey);
    const midOXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);

    // error checking for Orca Swap
    // if resOrca is defined, then executeOrcaSwap returned value from an error catch
    // also checks if sol balance to trade with jupiter (inAmount) is <= 0 
    // if (resOrca || (initOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount 
    //   - midOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount) <= 0) {
    //   console.log("Error with Orca swap.")
    //   // break // (for when a while loop is placed around everything)
    //   return
    // }
    // else {
    //   console.log("ORCA SWAP FINISHED.");
    // }
    

    console.log("Amount of SOL traded: ", (initSOLBalance - midSOLBalance)/LAMPORTS_PER_SOL);
    console.log("Amount of OXY recieved: ", (midOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount
      - initOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount));
    

    // // Info for Jupiter
    // tokenIn = 'SOL';
    // tokenOut = 'OXY';
    // inAmount = (midSOLBalance - initSOLBalance) / LAMPORTS_PER_SOL; // Should only trade what we got in exchange for our intial Oxy

    tokenIn = 'OXY';
    tokenOut = 'SOL';
    inAmount = (midOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount
      - initOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount); // Should only trade what we got in exchange for our intial Oxy

    // HOW executeJupiterSwap WORKS: pass in connection, owner is your public key, tokenIn: either SOL or OXY, tokenOut: either SOL or OXY
    // inAmount: needs to be a number small enough to actually be traded out of your account.
    const resJup = await executeJupiterSwap({connection, owner, tokenIn, tokenOut, inAmount});
    if (resJup) {
      console.log("Error with Jupiter swap.")
      // break // (for when a while loop is placed around everything)
      return
    }

    console.log("JUPITER SWAP FINISHED");

      //console.log("Did we wait?");
      // const finalSOLBalance = await connection.getBalance(owner.publicKey);
      // const finalOXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);
      // console.log("Final SOL Balance: ", finalSOLBalance/LAMPORTS_PER_SOL);
      // console.log("Final OXY Balance: ", finalOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount)
    // const finalBalance = await fetchWalletBalance({connection, owner, tokenAccountsFilter});

    // let solProfit = (finalBalance[0] - initSOLBalance)/LAMPORTS_PER_SOL;
    // let oxyProfit = (finalBalance[1] - initOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount);
    // console.log("SOL Profit Made: ", solProfit);
    // console.log("OXY Profit Made: ", oxyProfit);
    
  };
  
  main()
    .then(() => {

      console.log("Done");
    })
    .catch((e) => {
      console.error(e);
    });