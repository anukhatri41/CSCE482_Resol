import { readFile } from "mz/fs";
import { Connection, Keypair } from "@solana/web3.js";
import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";
import { sendAndConfirmTransaction } from "@solana/web3.js";
//import { getOrca, OrcaFarmConfig, OrcaPoolConfig, Network } from "@orca-so/sdk";
import Decimal from "decimal.js";

const main = async () => {
  /*** Setup ***/
  // 1. Read secret key file to get owner keypair
  const secretKeyString = await readFile("/Users/gtugwell/.config/solana/id.json", {
    encoding: "utf8",
  });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const owner = Keypair.fromSecretKey(secretKey);

  const devnet = 'https://api.devnet.solana.com';
  const mainnet = 'https://api.mainnet-beta.solana.com';
  const serumAPI = 'https://solana-api.projectserum.com';

  // 2. Initialzie Orca object with mainnet connection
  const connection = new Connection(mainnet, "singleGossip");
  const orca = getOrca(connection);
// const connection = new Connection("https://api.devnet.solana.com", "singleGossip");
// const orca = getOrca(connection, Network.DEVNET);

  try {
    /*** Swap ***/
    // 3. We will be swapping 0.1 SOL for some ORCA
    // const orcaSolPool = orca.getPool(OrcaPoolConfig.ORCA_SOL);
    // const solToken = orcaSolPool.getTokenB();
    // const solAmount = new Decimal(0.1);
    // const quote = await orcaSolPool.getQuote(solToken, solAmount);
    // const orcaAmount = quote.getMinOutputAmount();

    // console.log(`Swap ${solAmount.toString()} SOL for at least ${orcaAmount.toNumber()} ORCA`);
    // const swapPayload = await orcaSolPool.swap(owner, solToken, solAmount, orcaAmount);
    // const swapTxId = await swapPayload.execute();
    // console.log("Swapped:", swapTxId, "\n");
    
    // Modifying code to swap SOL for USDC
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

    // Sends it through the Solana command.
    const signature: string = await sendAndConfirmTransaction(connection, swapPayload.transaction, swapPayload.signers);
    console.log("tx: ", signature);

  } catch (err) {
    console.warn(err);
  }
};

main()
  .then(() => {
    console.log("Done");
  })
  .catch((e) => {
    console.error(e);
  });