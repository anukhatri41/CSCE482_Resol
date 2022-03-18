import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";
import { sendAndConfirmTransaction } from "@solana/web3.js";
import Decimal from "decimal.js";

export const executeOrcaSwap = async ({
    connection,
    owner
  }: {
    connection: Connection;
    owner: Keypair;
  }) => {
    const orca = getOrca(connection);
  
    try {
      
      // New Oxygen Sol Pool
      const orcaSolPool = orca.getPool(OrcaPoolConfig.OXY_SOL);
      const oxyToken = orcaSolPool.getTokenA();
      const solToken = orcaSolPool.getTokenB();
      const solAmount = new Decimal(0.01);
      const quote = await orcaSolPool.getQuote(solToken, solAmount);
      const outAmount = quote.getMinOutputAmount();
      console.log('QUOTE.getminOutputAmount: ');
      console.log(outAmount);
  
      console.log(`Swap ${solAmount.toString()} SOL for at least ${outAmount.toNumber()} OXY`);
      const swapPayload = await orcaSolPool.swap(owner, solToken, solAmount, outAmount);
      console.log('orcaSolPool.swap: ');
      console.log(swapPayload.transaction);
  
      // Sends it through the Solana command.
      const signature: string = await sendAndConfirmTransaction(connection, swapPayload.transaction, swapPayload.signers);
      console.log("tx: ", signature);
  
    } catch (err) {
      console.warn(err);
    }
  };