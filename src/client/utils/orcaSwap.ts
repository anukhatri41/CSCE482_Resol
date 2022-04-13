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
      console.log(swapPayload.transaction);
      console.log(swapPayload.signers)

      const signature: string = await sendAndConfirmTransaction(connection, swapPayload.transaction, swapPayload.signers);
      console.log("tx: ", signature);
    } else {
      console.log("This token pair is not setup for transactions.")
    }
    return "success";
  
    } catch (err) {
      console.warn(err);
      return "failure";
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

  export const orcaTwoWayTrade = async({
    connection,
    token1,
    token2,
    inAmount,
    owner
  }: {
    connection: Connection;
    token1: string;
    token2: string;
    inAmount: number;
    owner: Keypair;
  }) => {
    const orca = getOrca(connection);

    const orcaPool = orca.getPool(OrcaPoolConfig.STEP_SOL);

    const OUT_TOKEN = orcaPool.getTokenA();
    const IN_TOKEN = orcaPool.getTokenB();
    const AmountIN = new Decimal(inAmount);
    const quoteIN = await orcaPool.getQuote(IN_TOKEN, AmountIN);
    const outAmount1 = quoteIN.getMinOutputAmount();
    

    const quoteOUT = await orcaPool.getQuote(OUT_TOKEN, outAmount1);
    const outAmount2 = quoteOUT.getMinOutputAmount();

    console.log(outAmount1.toNumber());
    console.log(outAmount2.toNumber());

    const swapPayload1 = await orcaPool.swap(owner, IN_TOKEN, AmountIN, outAmount1);
    const swapPayload2 = await orcaPool.swap(owner, OUT_TOKEN, outAmount1, outAmount2);

    console.log(swapPayload1.transaction);
    console.log(swapPayload2.transaction);

    return {swapPayload1, swapPayload2}


  }