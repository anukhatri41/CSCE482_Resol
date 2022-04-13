// import { readFile } from "mz/fs";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, TokenAccountsFilter } from "@solana/web3.js";
//import { NATIVE_MINT, closeAccount, getAssociatedTokenAccount } from "@solana/spl-token";
import { executeOrcaSwap, getOrcaQuote } from "./utils/orcaSwap";
import { executeJupiterSwap } from "./utils/jupiterSwap";
import { raydiumSwap } from "./utils/raydiumSwap";
import { fetchWalletBalance } from "./utils/shared";
import bs58 from "bs58";
import {
  OXY_MINT_ADDRESS,
} from "./constants";
const sleep = require('./sleep');

// Swapping from OXY -> SOL -> OXY
const oxyTOsol = async () => {
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
  let tokenIn = 'OXY';
  let tokenOut = 'SOL';
  let inAmount = 2;
  
  console.log("First Swap", inAmount,"OXY for SOL.");
  // HOW executeOrcaSwap WORKS: pass in connection, owner is your public key, tokenIn: either SOL or OXY, tokenOut: either SOL or OXY
  // inAmount: needs to be a number small enough to actually be traded out of your account.
  const resOrca = await executeOrcaSwap({connection, owner, tokenIn, tokenOut, inAmount});

  const midSOLBalance = await connection.getBalance(owner.publicKey);
  const midOXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);

  // error checking for Orca Swap
  // if resOrca is defined, then executeOrcaSwap returned value from an error catch
  // also checks if sol balance to trade with jupiter (inAmount) is <= 0 
  if (resOrca || (midSOLBalance - initSOLBalance)/LAMPORTS_PER_SOL <= 0) {
    console.log("Error with Orca swap.")
    // break // (for when a while loop is placed around everything)
    return
  }
  else {
    console.log("ORCA SWAP FINISHED.");
  }
  

  console.log("Amount of SOL recieved: ", (midSOLBalance - initSOLBalance)/LAMPORTS_PER_SOL);
  console.log("Amount of OXY traded: ", (initOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount 
                                          - midOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount))
  

  // // Info for Jupiter
  tokenIn = 'SOL';
  tokenOut = 'OXY';
  inAmount = (midSOLBalance - initSOLBalance) / LAMPORTS_PER_SOL; // Should only trade what we got in exchange for our intial Oxy

  // HOW executeJupiterSwap WORKS: pass in connection, owner is your public key, tokenIn: either SOL or OXY, tokenOut: either SOL or OXY
  // inAmount: needs to be a number small enough to actually be traded out of your account.
  const resJup = await executeJupiterSwap({connection, owner, tokenIn, tokenOut, inAmount});
  if (resJup) {
    console.log("Error with Jupiter swap.")
    // break // (for when a while loop is placed around everything)
    return
  }

  console.log("JUPITER SWAP FINISHED");

  // Hopefully get rid of any wSOL
  // const associatedTokenAccount = await getAssociatedTokenAddress(
  //   NATIVE_MINT,
  //   owner.publicKey
  // );
  // await closeAccount(connection, owner, associatedTokenAccount, owner.publicKey, owner);


  const finalSOLBalance = await connection.getBalance(owner.publicKey);
  const finalOXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);
  console.log("Final SOL Balance: ", finalSOLBalance/LAMPORTS_PER_SOL);
  console.log("Final OXY Balance: ", finalOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount)

  let profit = (finalSOLBalance - initSOLBalance)/LAMPORTS_PER_SOL;
  console.log("SOL Profit Made: ", profit)
  
};

// // Swapping from SOL -> OXY -> SOL
const solTOoxy = async () => {
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

  const jupiterTopBottomTrading = async (
    {
      connection,
      owner
    }: {
      connection: Connection;
      owner: Keypair;
    }
  ) => {

    // Get Quote Amount:
    let tokenIn = 'SOL';
    let tokenOut = 'OXY';
    let inAmount = 0.05;
    const quoteInfo = await getOrcaQuote({connection, tokenIn, tokenOut, inAmount})
    console.log("QUOTE FOR AMT OF OXY FOR 0.05 SOL: ", quoteInfo);
    // Try executing swap:
    console.log("Defining doTheSwaps");
    const doTheSwaps = async() => {
      try{
        let jup = tryJupiter();
        let orc = tryOrca();
        return {jup, orc};
      } catch {
        console.log("Some error.");
      }
    }

    const tryOrca = async() => {
        tokenIn = 'OXY';
        tokenOut = 'SOL';
        inAmount = quoteInfo;
        let retry = 'failure';
        let oxyTOsol;
        while (retry == 'failure') {
          console.log("Trying oxyTOsol.")
          oxyTOsol = await executeOrcaSwap({connection, owner, tokenIn, tokenOut, inAmount});
          retry = oxyTOsol.toString();
          console.log("oxyTOsol: ", retry);
        }
        return oxyTOsol;
    }

    const tryJupiter = async() => {
        tokenIn = 'SOL';
        tokenOut = 'OXY';
        let retry = 'failure';
        let solTOoxy;
        while (retry == 'failure') {
          console.log("Trying solTOoxy.")
          solTOoxy = await executeJupiterSwap({connection, owner, tokenIn, tokenOut, inAmount});
          retry = solTOoxy.toString();
          console.log("solTOoxy: ", retry);
        }
        return solTOoxy;
    }

    console.log("Running doTheSwaps");
    let ret = await doTheSwaps();
    return ret;
    
  };

const runTradingUntilStopped = async () => {

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

  // Get Wallet Info:
  let tokenAccountsFilter: TokenAccountsFilter = {mint: new PublicKey(OXY_MINT_ADDRESS)}
  const initSOLBalance = await connection.getBalance(owner.publicKey);
  const initOXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);
  console.log("Initial SOL Balance: ", initSOLBalance/LAMPORTS_PER_SOL);
  console.log("Initial OXY Balance: ", initOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount)


  // Initialize loop stuff
  let swapNum = 0;
  let ret;

  while (swapNum < 1) {
    swapNum++;
    console.log("###############################################################");
    console.log("Swap # ", swapNum);
    jupiterTopBottomTrading({connection, owner}).then(response => console.log(response));
    //console.log(await ret);
    console.log("###############################################################");
    console.log("");
    console.log("");
  };

  const finalSOLBalance = await connection.getBalance(owner.publicKey);
  const finalOXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);
  console.log("Final SOL Balance: ", finalSOLBalance/LAMPORTS_PER_SOL);
  console.log("Final OXY Balance: ", finalOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount);

  console.log("SOL Profit: ", (finalSOLBalance - initSOLBalance)/LAMPORTS_PER_SOL);
  console.log("OXY Profit: ", finalOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount - initOXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount);

};

const main = async () => {
  
  // OXY -> SOL -> OXY
  //await oxyTOsol();

  // SOL -> OXY -> SOL
  //await solTOoxy();

  // Top Bottom Trading Strat
  // await runTradingUntilStopped();



};
  main()
    .then(() => {

      console.log("Done");
    })
    .catch((e) => {
      console.error(e);
    });