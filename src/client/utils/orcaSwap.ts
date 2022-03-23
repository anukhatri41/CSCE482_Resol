import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";
import { sendAndConfirmTransaction } from "@solana/web3.js";
import Decimal from "decimal.js";

export const executeOrcaSwap = async ({
    connection,
    owner,
    tokenIn,
    tokenOut,
    inAmount
  }: {
    connection: Connection;
    owner: Keypair;
    tokenIn: string;
    tokenOut: string;
    inAmount: number;
  }) => {
    const orca = getOrca(connection);
  
    try {
      
    if (tokenIn == 'SOL' && tokenOut =='OXY'){
      const orcaSolPool = orca.getPool(OrcaPoolConfig.OXY_SOL);
      const OUT_TOKEN = orcaSolPool.getTokenA();
      const IN_TOKEN = orcaSolPool.getTokenB();
      const Amount = new Decimal(inAmount);
      const quote = await orcaSolPool.getQuote(IN_TOKEN, Amount);
      const outAmount = quote.getMinOutputAmount();
      // console.log('QUOTE.getminOutputAmount: ');
      // console.log(outAmount);
  
      console.log(`Swap ${Amount.toString()} SOL for at least ${outAmount.toNumber()} OXY`);
      const swapPayload = await orcaSolPool.swap(owner, IN_TOKEN, Amount, outAmount);
      // console.log('orcaSolPool.swap: ');
      // console.log(swapPayload.transaction);

      const signature: string = await sendAndConfirmTransaction(connection, swapPayload.transaction, swapPayload.signers);
      console.log("tx: ", signature);
    }
    else if (tokenIn == 'OXY' && tokenOut == 'SOL'){
      const orcaSolPool = orca.getPool(OrcaPoolConfig.OXY_SOL);
      const IN_TOKEN = orcaSolPool.getTokenA();
      const OUT_TOKEN = orcaSolPool.getTokenB();
      const Amount = new Decimal(inAmount);
      const quote = await orcaSolPool.getQuote(IN_TOKEN, Amount);
      const outAmount = quote.getMinOutputAmount();
      // console.log('QUOTE.getminOutputAmount: ');
      // console.log(outAmount);
  
      console.log(`Swap ${Amount.toString()} OXY for at least ${outAmount.toNumber()} SOL`);
      const swapPayload = await orcaSolPool.swap(owner, IN_TOKEN, Amount, outAmount);
      // console.log('orcaSolPool.swap: ');
      // console.log(swapPayload.transaction);

      const signature: string = await sendAndConfirmTransaction(connection, swapPayload.transaction, swapPayload.signers);
      console.log("tx: ", signature);
    } else {
      console.log("This token pair is not setup for transactions.")
    }
  
    } catch (err) {
      console.warn(err);
      return -1
    }
  };
  
  export const getOrcaQuote = async ({
    connection,
    tokenIn,
    tokenOut,
    inAmount
  }: {
    connection: Connection;
    tokenIn: string;
    tokenOut: string;
    inAmount: number;
  }) => {
    const orca = getOrca(connection);
    let quoteInfo;

    if (tokenIn == 'SOL' && tokenOut =='OXY'){
      const orcaSolPool = orca.getPool(OrcaPoolConfig.OXY_SOL);
      const OUT_TOKEN = orcaSolPool.getTokenA();
      const IN_TOKEN = orcaSolPool.getTokenB();
      const Amount = new Decimal(inAmount);
      const quote = await orcaSolPool.getQuote(IN_TOKEN, Amount);
      const outAmount = quote.getMinOutputAmount();
      quoteInfo = outAmount;
    } else if (tokenIn == 'OXY' && tokenOut == 'SOL'){
      const orcaSolPool = orca.getPool(OrcaPoolConfig.OXY_SOL);
      const IN_TOKEN = orcaSolPool.getTokenA();
      const OUT_TOKEN = orcaSolPool.getTokenB();
      const Amount = new Decimal(inAmount);
      const quote = await orcaSolPool.getQuote(IN_TOKEN, Amount);
      const outAmount = quote.getMinOutputAmount();
      quoteInfo = outAmount;
    } else {
      // Means pair is not configured.
      return 0;
    }
    return quoteInfo.toNumber();


  };

