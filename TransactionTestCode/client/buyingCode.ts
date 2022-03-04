import { readFile } from "mz/fs";
import { Connection, Keypair } from "@solana/web3.js";
import { getOrca, OrcaPoolConfig } from "@orca-so/sdk";
import Decimal from "decimal.js";
const sleep = require('./sleep');

const main = async () => {
  // Getting keypair
  const secretKeyString = await readFile("/Users/gtugwell/.config/solana/id.json", {
    encoding: "utf8",
  });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const owner = Keypair.fromSecretKey(secretKey);

  // Cluster definitions
  const devnet = 'https://api.devnet.solana.com';
  const mainnet = 'https://api.mainnet-beta.solana.com';
  const serumAPI = 'https://solana-api.projectserum.com';

  // Connecting to cluster & then initializing orca connection
  const connection = new Connection(mainnet, "singleGossip");
  const orca = getOrca(connection);

  try {
    // Amount of SOL per transaction
    const solAmount = new Decimal(0.005);

    // Getting SOL USDC Orca pool info
    const orcaSolPool = orca.getPool(OrcaPoolConfig.SOL_USDC);
    const solToken = orcaSolPool.getTokenA();
    const usdcToken = orcaSolPool.getTokenB();
    
    for (let i = 1; i < 6; i++) {
        console.log("Making transaction #", i);

        const quote = await orcaSolPool.getQuote(solToken, solAmount);
        const usdcAmount = quote.getMinOutputAmount();

        console.log(`Swap ${solAmount.toString()} SOL for at least ${usdcAmount.toNumber()} USDC`);
        const swapPayload = await orcaSolPool.swap(owner, solToken, solAmount, usdcAmount);
        const swapTxId = await swapPayload.execute();
        console.log("Swapped:", swapTxId, "\n");

        // Sleeping for 10 seconds
        console.log("Going to sleep for 10 seconds.");
        await sleep(10000);
        console.log("I have awakened.");
    }

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