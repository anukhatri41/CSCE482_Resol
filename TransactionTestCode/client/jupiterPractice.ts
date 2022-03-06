// import { Connection, PublicKey } from "@solana/web3.js";
// import fetch from "isomorphic-fetch";

// import { Jupiter, RouteInfo, TOKEN_LIST_URL } from "@jup-ag/core";
// import {
//   ENV,
//   INPUT_MINT_ADDRESS,
//   OUTPUT_MINT_ADDRESS,
//   SOLANA_RPC_ENDPOINT,
//   Token,
//   USER_KEYPAIR,
// } from "./jupiterConstants";

// const mainnet = 'https://api.mainnet-beta.solana.com';

// const getPossiblePairsTokenInfo = ({
//   tokens,
//   routeMap,
//   inputToken,
// }: {
//   tokens: Token[];
//   routeMap: Map<string, string[]>;
//   inputToken?: Token;
// }) => {
//   try {
//     if (!inputToken) {
//       return {};
//     }

//     const possiblePairs = inputToken
//       ? routeMap.get(inputToken.address) || []
//       : []; // return an array of token mints that can be swapped with SOL
//     const possiblePairsTokenInfo: { [key: string]: Token | undefined } = {};
//     possiblePairs.forEach((address) => {
//       possiblePairsTokenInfo[address] = tokens.find((t) => {
//         return t.address == address;
//       });
//     });
//     // Perform your conditionals here to use other outputToken
//     // const alternativeOutputToken = possiblePairsTokenInfo[USDT_MINT_ADDRESS]
//     return possiblePairsTokenInfo;
//   } catch (error) {
//     throw error;
//   }
// };

// const getRoutes = async ({
//   jupiter,
//   inputToken,
//   outputToken,
//   inputAmount,
//   slippage,
// }: {
//   jupiter: Jupiter;
//   inputToken?: Token;
//   outputToken?: Token;
//   inputAmount: number;
//   slippage: number;
// }) => {
//   try {
//     if (!inputToken || !outputToken) {
//       return null;
//     }

//     console.log(
//       `Getting routes for ${inputAmount} ${inputToken.symbol} -> ${outputToken.symbol}...`
//     );
//     const inputAmountInSmallestUnits = inputToken
//       ? Math.round(inputAmount * 10 ** inputToken.decimals)
//       : 0;
//     const routes =
//       inputToken && outputToken
//         ? await jupiter.computeRoutes({
//             inputMint: new PublicKey(inputToken.address),
//             outputMint: new PublicKey(outputToken.address),
//             inputAmount: inputAmountInSmallestUnits, // raw input amount of tokens
//             slippage,
//             forceFetch: true,
//           })
//         : null;

//     if (routes && routes.routesInfos) {
//       console.log("Possible number of routes:", routes.routesInfos.length);
//       console.log(
//         "Best quote: ",
//         routes.routesInfos[0].outAmount / 10 ** outputToken.decimals,
//         `(${outputToken.symbol})`
//       );
//       return routes;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// // const executeSwap = async ({
// //   jupiter,
// //   route,
// // }: {
// //   jupiter: Jupiter;
// //   route: RouteInfo;
// // }) => {
// //   try {
// //     // Prepare execute exchange
// //     const { execute } = await jupiter.exchange({
// //         route
// //     });

// //     // Execute swap
// //     const swapResult: any = await execute(); // Force any to ignore TS misidentifying SwapResult type

// //     if (swapResult.error) {
// //       console.log(swapResult.error);
// //     } else {
// //       console.log(`https://explorer.solana.com/tx/${swapResult.txid}`);
// //       console.log(
// //         `inputAddress=${swapResult.inputAddress.toString()} outputAddress=${swapResult.outputAddress.toString()}`
// //       );
// //       console.log(
// //         `inputAmount=${swapResult.inputAmount} outputAmount=${swapResult.outputAmount}`
// //       );
// //     }
// //   } catch (error) {
// //     throw error;
// //   }
// // };

// const main = async () => {
//   try {
//     console.log("starting main");
//     const connection = new Connection(mainnet); // Setup Solana RPC connection
//     const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json(); // Fetch token list from Jupiter API
//     console.log("about to load");
//     //  Load Jupiter
//     const jupiter = await Jupiter.load({
//       connection,
//       cluster: ENV,
//       user: USER_KEYPAIR, // or public key
//     });
//     console.log("quarter way through");
//     //  Get routeMap, which maps each tokenMint and their respective tokenMints that are swappable
//     const routeMap = jupiter.getRouteMap();

//     // If you know which input/output pair you want
//     // const inputToken = tokens.find((t) => t.address == INPUT_MINT_ADDRESS); // USDC Mint Info
//     // const outputToken = tokens.find((t) => t.address == OUTPUT_MINT_ADDRESS); // USDT Mint Info
//     const INPUT_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
//     const OUTPUT_MINT_ADDRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
//     const inputToken = tokens.find((t) => t.address == INPUT_MINT_ADDRESS); // USDC Mint Info
//     const outputToken = tokens.find((t) => t.address == OUTPUT_MINT_ADDRESS); // USDT Mint Info

//     console.log("halfway through");
//     // Alternatively, find all possible outputToken based on your inputToken
//     const possiblePairsTokenInfo = await getPossiblePairsTokenInfo({
//       tokens,
//       routeMap,
//       inputToken,
//     });

//     const routes = await getRoutes({
//       jupiter,
//       inputToken,
//       outputToken,
//       inputAmount: 1, // 1 unit in UI
//       slippage: 1, // 1% slippage
//     });

//     // Routes are sorted based on outputAmount, so ideally the first route is the best.
//     // await executeSwap({ jupiter, route: routes!.routesInfos[0] });
//   } catch (error) {
//     console.log({ error });
//   }
// };

// main();


import { 
    Keypair,
    Connection,
    Cluster
 } from '@solana/web3.js';
import { Wallet } from '@project-serum/anchor';
import bs58 from "bs58";
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from "@jup-ag/core";

require('dotenv').config()
const details = {
    sender_keypair: process.env.SENDER_KEY as string,
    secret: process.env.SENDER_SECRET as string,
	reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
};
const mainnet = 'https://api.mainnet-beta.solana.com';

// Creating Wallet
const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(details.secret)));

(async () => {
    console.log("Connecting to Jupiter");
    const connection = new Connection(mainnet);
    const ENV: Cluster = "mainnet-beta";
    const jupiter = await Jupiter.load({
            connection,
            cluster: ENV,
            user: wallet.publicKey, // or public key
            });
    console.log("Connected to Jupiter");

    // Prepare execute exchange
    const { transactions } = await jupiter.exchange({
        routes.routesInfos[0],
      });
    
    // Both `setupTransaction` and `cleanupTransaction` can be undefined if
    // both transactions are not needed. `swapTransaction` will always be
    // defined.
    //
    // `setupTransaction`: This is usually the required actions before a token
    // swap is executed. For example, setting a token account, wrapping up the
    // SOL into wSOL.
    // `swapTransaction`: The actual swapping transaction.
    // `cleanupTransaction`: This is the cleanup transaction, for example,
    // unwrapping the wSOL token account.

    const { setupTransaction, swapTransaction, cleanupTransaction } = transactions;

    // Execute the transactions
for (let serializedTransaction of [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
    // get transaction object from serialized transaction
    const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'))
    // perform the swap
    const txid = await connection.sendTransaction(transaction, [wallet.payer], {
      skipPreflight: true
    })
    await connection.confirmTransaction(txid)
    console.log(`https://solscan.io/tx/${txid}`)
  }
})();
  

