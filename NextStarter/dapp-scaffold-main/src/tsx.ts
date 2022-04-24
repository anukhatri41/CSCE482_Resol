import { 
    Connection,
    Keypair, 
    LAMPORTS_PER_SOL, 
    Signer,
    Transaction
   } from "@solana/web3.js";
  import { runUntilProfitV3 } from "./utils/jupiterSwap";
  import { createWSolAccount } from "./utils/shared";
  import bs58 from "bs58";
  import {
    closeAccount
  } from "@solana/spl-token2.0";
  import {
    SOL_MINT_ADDRESS,
    STEP_MINT_ADDRESS,
    USDC_MINT_ADDRESS,
    oneSOL_MINT_ADDRESS,
    ALL_MINT_ADDRESS,
    SHDW_MINT_ADDRESS,
    sRLY_MINT_ADDRESS,
    USDT_MINT_ADDRESS,
  } from "./constants";
  import fetch from "isomorphic-fetch";
import { exec } from "child_process";
import { AES, enc } from 'crypto-ts';

const axios = require('axios');

const routeOutputV3 = async () => {

    while(true) {
      await new Promise(r => setTimeout(r, 1500));
      let response = await fetch('http://localhost:4000/tsx_params/1')
      let tsx_params = await response.json()
      console.log("in while tsx")
      let stop = tsx_params.stop;
      if (stop == false) {
        break;
      }
    }
  
    require('dotenv').config()

    let response = await fetch('http://localhost:4000/tsx_params/1')
    let tsx_params = await response.json()

    var iter = tsx_params.iterations;
    var amountToTrade = tsx_params.amount;

    let inAmount: number = +amountToTrade;
    let iterations: number = +iter;
  
    require('dotenv').config()

    await axios.put('http://localhost:4000/tsx_log/1', {
      firstSwap: {
        amm1: 0,
        inputAmount1: 0,
        inputTokenSymbol1: 0,
        outputAmount1: 0,
        outputTokenSymbol1: 0
      },
      secondSwap: {
        amm2: 0,
        inputAmount2: 0,
        inputTokenSymbol2: 0,
        outputAmount2: 0,
        outputTokenSymbol2: 0
      },
      totalIn: 0,
      totalOut: 0,
      spread: 0,
      recent_transaction: {
          priorBalance: -1,
          afterBalance: -1,
          difference: -1,
          txId: -1
      }
    }).then(resp => {
      console.log(resp.data);
    }).catch(error => {
      console.log(error);
    });
  
    // if secret key is in .env:

    var decryptedSec = AES.decrypt(tsx_params.walletSecret, 'secret key crypto').toString(enc.Utf8);
    let WALLET_PRIVATE_KEY = JSON.parse(decryptedSec);
    const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
    const owner = Keypair.fromSecretKey(USER_PRIVATE_KEY);

    const RPC = "https://still-red-tree.solana-mainnet.quiknode.pro/4824354cd8b2aa36d1b297cf55b13096b022a5e9/";
    const devnet = 'https://api.devnet.solana.com';
    const mainnet = 'https://api.mainnet-beta.solana.com';
    const serumAPI = 'https://solana-api.projectserum.com';
  
    // 2. Initialize Orca object with mainnet connection
    const connectionRPC = new Connection(RPC);
    const connection = new Connection(mainnet);

    let totalProfit = 0;

    // console.time("Ran for");
    
    let totSwaps = 0;
    let positiveSwaps = 0;
    let negativeSwaps = 0;
    let swapsErr = 0;

    let stop_flag_triggered = false;
    let beginningSOLBal = await connection.getBalance(owner.publicKey);
    let wSOLAddress = await createWSolAccount({connection, owner});
    let initSOLBalance = await connection.getBalance(owner.publicKey);
    let initwSOLBalance = await connection.getBalance(wSOLAddress);
    let initTotalBalance = initSOLBalance + initwSOLBalance;

    await axios.patch('http://localhost:4000/transactions_meta/1', {
      total_swaps: null,
      pos_swaps: null,
      err_swaps: null,
      neg_swaps: null,
      init_bal: initTotalBalance/LAMPORTS_PER_SOL,
      end_bal: null,
      tot_prof: null
    }).then(resp => {
      console.log(resp.data);
    }).catch(error => {
      console.log(error);
    });

    await axios.put('http://localhost:4000/graph_data/1', {
      txId: null,
      totalBalance: initTotalBalance/LAMPORTS_PER_SOL,
    }).then(resp => {
      console.log(resp.data);
    }).catch(error => {
      console.log(error);
    });

    let txid;

    while (!stop_flag_triggered) {
      try {

        if (totSwaps != 0) {
          wSOLAddress = await createWSolAccount({connection, owner});
        }

        totSwaps++;
        initSOLBalance = await connection.getBalance(owner.publicKey);
        initwSOLBalance = await connection.getBalance(wSOLAddress);
        initTotalBalance = initSOLBalance + initwSOLBalance
        // console.log("Initial SOL Balance: ", (await connection.getBalance(owner.publicKey) + (await connection.getBalance(wSOLAddress)))/LAMPORTS_PER_SOL);
        
        let token1 = SOL_MINT_ADDRESS;
        let token2 = [
          STEP_MINT_ADDRESS, 
          SHDW_MINT_ADDRESS, 
          sRLY_MINT_ADDRESS, 
          oneSOL_MINT_ADDRESS,
          ALL_MINT_ADDRESS, 
          USDC_MINT_ADDRESS, 
          USDT_MINT_ADDRESS,
          ];

        let transactions = await runUntilProfitV3({connection: connectionRPC, inAmount, owner, token1, token2});
        stop_flag_triggered = transactions.stop_flag_triggered;
        if (stop_flag_triggered == true) {
          continue;
        }

        if (transactions.transactions1.swapTransaction) {

          let signers: Signer[] = [owner];

          // console.log("Initial SOL Balance: ", initSOLBalance/LAMPORTS_PER_SOL);

          const payload = new Transaction();

          // console.log(transactions.transactions1.swapTransaction.instructions);
          payload.add(transactions.transactions1.swapTransaction);
          payload.add(transactions.transactions2.swapTransaction);

          /////////// COMMENT OUT BETWEEN TO STOP SWAP ////////////////////////////////////////////////////
          for (let serializedTransaction of [payload].filter(Boolean)) {
            // get transaction object from serialized transaction
            if (serializedTransaction) {
        
              txid = await connectionRPC.sendTransaction(serializedTransaction, signers, {
                skipPreflight: true
              })
              await connectionRPC.confirmTransaction(txid)
              // console.log(`TX${serializedTransaction.toString()}: https://solscan.io/tx/${txid}`)
            }
          }
        }
        /////////// COMMENT OUT BETWEEN TO STOP SWAP ////////////////////////////////////////////////////
        
        const finalwSOLBalance = await connection.getBalance(wSOLAddress);
        const finalSOLBalance = await connection.getBalance(owner.publicKey)
        const finalTotalBalance = (finalwSOLBalance+finalSOLBalance)
        // console.log("SOL Balance After Most Recent Swap: ", (finalwSOLBalance+finalSOLBalance)/LAMPORTS_PER_SOL);
        // console.log("Profit?: ", (finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL);
        if ((finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL > 0) {
          positiveSwaps++;
        } else if ((finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL == 0) {
          swapsErr++;
        } else {
          negativeSwaps++;
        }

        totalProfit += (finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL;

        await axios.patch('http://localhost:4000/transactions_meta/1', {
          total_swaps: totSwaps,
          pos_swaps: positiveSwaps,
          err_swaps: swapsErr,
          neg_swaps: negativeSwaps,
          tot_prof: totalProfit
        }).then(resp => {
          console.log(resp.data);
        }).catch(error => {
          console.log(error);
        });

        await axios.patch('http://localhost:4000/tsx_log/1', {
          recent_transaction: {
            priorBalance: initTotalBalance/LAMPORTS_PER_SOL,
            afterBalance: finalTotalBalance/LAMPORTS_PER_SOL,
            difference: (finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL,
            txId: txid
          }
        }).then(resp => {
          console.log(resp.data);
        }).catch(error => {
          console.log(error);
        });

        await axios.post('http://localhost:4000/graph_data', {
          id: (totSwaps + 1),
          txId: txid,
          totalBalance: finalTotalBalance/LAMPORTS_PER_SOL
        }).then(resp => {
          console.log(resp.data);
        }).catch(error => {
          console.log(error);
        });

    
      } catch(err) {
        try {
          await new Promise(r => setTimeout(r, 5000));
          const finalwSOLBalance = await connection.getBalance(wSOLAddress);
          const finalSOLBalance = await connection.getBalance(owner.publicKey)
          const finalTotalBalance = (finalwSOLBalance+finalSOLBalance)
          // console.log("SOL Balance After Most Recent Swap: ", (finalwSOLBalance+finalSOLBalance)/LAMPORTS_PER_SOL);
          // console.log("Profit?: ", (finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL);
          if ((finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL > 0) {
            positiveSwaps++;
          } else if ((finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL == 0) {
            swapsErr++;
          } else {
            negativeSwaps++;
          }
          await axios.put('http://localhost:4000/transactions_meta/1', {
            total_swaps: totSwaps,
            pos_swaps: positiveSwaps,
            err_swaps: swapsErr,
            neg_swaps: negativeSwaps,
            tot_prof: totalProfit
          }).then(resp => {
            console.log(resp.data);
          }).catch(error => {
            console.log(error);
          });

          await axios.put('http://localhost:4000/tsx_log/1', {
          recent_transaction: {
            priorBalance: initTotalBalance/LAMPORTS_PER_SOL,
            afterBalance: finalTotalBalance/LAMPORTS_PER_SOL,
            difference: (finalTotalBalance-initTotalBalance)/LAMPORTS_PER_SOL,
            txId: txid
          }
        }).then(resp => {
          console.log(resp.data);
        }).catch(error => {
          console.log(error);
        });

          await axios.post('http://localhost:4000/graph_data', {
            txId: txid,
            totalBalance: finalTotalBalance/LAMPORTS_PER_SOL
          }).then(resp => {
            console.log(resp.data);
          }).catch(error => {
            console.log(error);
          });

        }
        catch (error) {
          console.log("error error")
        }

        console.warn(err);
      }
    }

    // console.log("closing account")
    await closeAccount(connection, owner, wSOLAddress, owner.publicKey, owner);

    const endingSOLBalance = await connection.getBalance(owner.publicKey);

    // console.log("FINAL META: ");
    // // console.timeEnd("Ran for");
    // console.log("Total Swaps: ", totSwaps);
    // console.log("Positive Swaps: ", positiveSwaps);
    // console.log("Errored Swaps: ", swapsErr);
    // console.log("Negative Swaps: ", negativeSwaps);
    // console.log("Beginning Balance: ",beginningSOLBal/LAMPORTS_PER_SOL);
    // console.log("Ending Balance: ",endingSOLBalance/LAMPORTS_PER_SOL);

    // console.log("Total Profit: ", (endingSOLBalance-beginningSOLBal)/LAMPORTS_PER_SOL);

    await axios.patch('http://localhost:4000/transactions_meta/1', {
      end_bal: endingSOLBalance/LAMPORTS_PER_SOL
    }).then(resp => {
      console.log(resp.data);
    }).catch(error => {
      console.log(error);
    });

    await axios.put('http://localhost:4000/graph_data', {
          txId: null,
          totalBalance: endingSOLBalance/LAMPORTS_PER_SOL
        }).then(resp => {
          console.log(resp.data);
        }).catch(error => {
          console.log(error);
        });

    // If it gets to the end of the loop, it starts back over.
    routeOutputV3();
  }
  
export { routeOutputV3 };