import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { TransactionMod } from '../target/types/transaction_mod';

import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";
import { Connection, Keypair } from "@solana/web3.js";
import { Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import Decimal from "decimal.js";
import base58 from 'bs58';

import * as price from './prices';
// import * as transax from './transaxs';

describe('transaction_mod', () => {



  // Configure the client to use the local cluster.
  // anchor.setProvider(anchor.Provider.env());
  // const program = anchor.workspace.TransactionMod as Program<TransactionMod>;

  const providerAnchor = anchor.Provider.env();
  anchor.setProvider(providerAnchor);
  const program = anchor.workspace.TransactionMod as Program<TransactionMod>;


const details = {
  secret: process.env.SENDER_SECRET as string,
  reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
  RAYDIUM_SOL_USDC: process.env.SOL_USDC_RAYDIUM_ADDRESS as string,
  SERUM_PROGRAM_ID: process.env.SERUM_PROGRAM_ID as string
}
const owner = Keypair.fromSecretKey(base58.decode(details.secret))

const devnet = 'https://api.devnet.solana.com';
const mainnet = 'https://api.mainnet-beta.solana.com';
const serumAPI = 'https://solana-api.projectserum.com';

const connection = new Connection(mainnet, "singleGossip");
const orca = getOrca(connection);

  it('Is initialized!', async () => {
    // Add your test here.


    // const orcaSolPool = orca.getPool(OrcaPoolConfig.SOL_USDC);
    //     const solToken = orcaSolPool.getTokenA();
    //     const usdcToken = orcaSolPool.getTokenB();
    //     const solAmount = new Decimal(0.001);
    //     const quote = await orcaSolPool.getQuote(solToken, solAmount);
    //     const usdcAmount = quote.getMinOutputAmount();
    //     // console.log('QUOTE.getminOutputAmount: ');
    //     // console.log(usdcAmount);
    
    //     // console.log(`Swap ${solAmount.toString()} SOL for at least ${usdcAmount.toNumber()} USDC`);
    //     const swapPayload = await orcaSolPool.swap(owner, solToken, solAmount, usdcAmount);
    //     // console.log('orcaSolPool.swap: ');
    //     // console.log(swapPayload.transaction);

    // const t = await program.rpc.orca_swap_sol_udsc({swapPayload});



    const mainnet = 'https://api.mainnet-beta.solana.com';

    require('dotenv').config()
    const details = {
        secret: process.env.SENDER_SECRET as string,
        reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
        RAYDIUM_SOL_USDC: process.env.SOL_USDC_RAYDIUM_ADDRESS as string,
        SERUM_PROGRAM_ID: process.env.SERUM_PROGRAM_ID as string
    };
    
    let connection = new Connection(mainnet);
    let responseOrca = price.OrcaOrders(connection)
    let responseSerum = price.SerumOrders(connection)
    let responseMango = price.MangoOrdersSpot()


    await program.rpc.initialize({});
    let txs: Transaction;
    // const orcaorderresp = await transax.OrcaOrders();
    // const signers = orcaorderresp.signers
    // const

    // const tx = await program.rpc.sendOrcaTx({
    //   orcaorderresp.transaction, 
    //   orcaorderresp.signers
    // })
    // const ts = await program.rpc.print({});


    let orcaPrice = 0;
    let serumPrice = 0;
    responseOrca.then(function(result) {
        console.log("orca: SOL/USDC")
        console.log(result)
        if (result)
        {
            orcaPrice = result;
        }
    
        responseSerum.then(function(result) {
            console.log("serum: SOL/USDC")
            console.log(result)
            if (result)
            {
                serumPrice = result;
            }
    
            if (serumPrice - orcaPrice > 0.05) {
                // assuming we start with SOL...
                // sol is more expensive on serum
                const tx = program.rpc.print({});
                
                console.log("buy orca USDC with SOL, sell serum USDC for SOL")
            }
            else if (orcaPrice - serumPrice > 0.05) {
                console.log("buy serum USDC with SOL, sell orca USDC for SOL")
            }
            else {
                console.log("no profit found")
            }
            // console.log(1/serumPrice)
        })
    })


    // responseMango.then(function(result) {
    //     console.log("mango: SOL/USDC")
    //     console.log(result)
    // })



    // const tx = await program.rpc.initialize({});
    // console.log("Your transaction signature", tx);
  });
});
