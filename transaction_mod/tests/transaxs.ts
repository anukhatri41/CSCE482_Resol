import { readFile } from "mz/fs";
import { Connection, Keypair } from "@solana/web3.js";
import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";
import { sendAndConfirmTransaction } from "@solana/web3.js";
//import { getOrca, OrcaFarmConfig, OrcaPoolConfig, Network } from "@orca-so/sdk";
import Decimal from "decimal.js";

export async function OrcaOrders() {
    const secretKeyString = await readFile("/Users/gtugwell/.config/solana/id.json", {
        encoding: "utf8",
      });

    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const owner = Keypair.fromSecretKey(secretKey);

    const devnet = 'https://api.devnet.solana.com';
    const mainnet = 'https://api.mainnet-beta.solana.com';
    const serumAPI = 'https://solana-api.projectserum.com';
    
    const connection = new Connection(mainnet, "singleGossip");
    const orca = getOrca(connection);

    const orcaSolPool = orca.getPool(OrcaPoolConfig.SOL_USDC);
    const solToken = orcaSolPool.getTokenA();
    const usdcToken = orcaSolPool.getTokenB();
    const solAmount = new Decimal(0.001);
    const quote = await orcaSolPool.getQuote(solToken, solAmount);
    const usdcAmount = quote.getMinOutputAmount();
    console.log('QUOTE.getminOutputAmount: ');
    console.log(usdcAmount);

    console.log(`Swap ${solAmount.toString()} SOL for at least ${usdcAmount.toNumber()} USDC`);
    const swapPayload = await orcaSolPool.swap(owner, solToken, solAmount, usdcAmount);
    console.log('orcaSolPool.swap: ');
    console.log(swapPayload.transaction);


    return swapPayload;
    // Sends it through the Solana command.
    // const signature: string = await sendAndConfirmTransaction(connection, swapPayload.transaction, swapPayload.signers);
    // console.log("tx: ", signature);

}