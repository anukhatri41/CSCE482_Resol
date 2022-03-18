import { readFile } from "mz/fs";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";
import { sendAndConfirmTransaction } from "@solana/web3.js";
import Decimal from "decimal.js";
import fetch from "isomorphic-fetch";
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from "@jup-ag/core";
import {
  ENV,
  INPUT_MINT_ADDRESS,
  OUTPUT_MINT_ADDRESS,
  SOLANA_RPC_ENDPOINT,
  SOL_MINT_ADDRESS,
  OXY_MINT_ADDRESS,
  Token,
  USDC_MINT_ADDRESS,
  USER_KEYPAIR,
} from "./constants";

const executeOrcaSwap = async ({
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

const getRoutes = async ({
    jupiter,
    inputToken,
    outputToken,
    inputAmount,
    slippage,
  }: {
    jupiter: Jupiter;
    inputToken?: Token;
    outputToken?: Token;
    inputAmount: number;
    slippage: number;
  }) => {
    try {
      if (!inputToken || !outputToken) {
        return null;
      }
  
      console.log(
        `Getting routes for ${inputAmount} ${inputToken.symbol} -> ${outputToken.symbol}...`
      );
      const inputAmountInSmallestUnits = inputToken
        ? Math.round(inputAmount * 10 ** inputToken.decimals)
        : 0;
      const routes =
        inputToken && outputToken
          ? await jupiter.computeRoutes({
              inputMint: new PublicKey(inputToken.address),
              outputMint: new PublicKey(outputToken.address),
              inputAmount: inputAmountInSmallestUnits, // raw input amount of tokens
              slippage,
              forceFetch: true,
            })
          : null;
  
      if (routes && routes.routesInfos) {
        console.log("Possible number of routes:", routes.routesInfos.length);
        console.log(
          "Best quote: ",
          routes.routesInfos[0].outAmount / 10 ** outputToken.decimals,
          `(${outputToken.symbol})`
        );
        return routes;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  const executeSwap = async ({
    jupiter,
    routeInfo
  }: {
    jupiter: Jupiter;
    routeInfo: RouteInfo;
  }) => {
    try {
      // Prepare execute exchange
      // const { execute } = await jupiter.exchange({
      //   route
      // });
      const { execute } = await jupiter.exchange({
        routeInfo,
      });
  
      console.log("EXECUTE DEFINED");
      console.log(execute);
      // Execute swap
      console.log("EXECUTING SWAP");
      const swapResult: any = await execute(); // Force any to ignore TS misidentifying SwapResult type
      console.log("Swapped");
  
      if (swapResult.error) {
        console.log(swapResult.error);
      } else {
        console.log(`https://explorer.solana.com/tx/${swapResult.txid}`);
        console.log(
          `inputAddress=${swapResult.inputAddress.toString()} outputAddress=${swapResult.outputAddress.toString()}`
        );
        console.log(
          `inputAmount=${swapResult.inputAmount} outputAmount=${swapResult.outputAmount}`
        );
        console.log()
      }
    } catch (error) {
      throw error;
    }
  };

const executeJupiterSwap = async ({
    owner,
    RPC
  }: {
    owner: Keypair;
    RPC: string;
  }) => {
    try {
        const connection = new Connection(RPC); // Setup Solana RPC. RPC is our custome RPC from .env file.
        const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json(); // Fetch token list from Jupiter API
        console.log("Established connection.")
        //  Load Jupiter
        const jupiter = await Jupiter.load({
          connection,
          cluster: ENV,
          user: USER_KEYPAIR, // or public key
        });
        console.log("Jupiter Loaded")
    
        //  Get routeMap, which maps each tokenMint and their respective tokenMints that are swappable
        const routeMap = jupiter.getRouteMap();
    
        // If you know which input/output pair you want
        const inputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); // USDC Mint Info
        const outputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS); // USDT Mint Info
        console.log("Established trade in & out (SOL -> OXY)");
        // Alternatively, find all possible outputToken based on your inputToken
        // const possiblePairsTokenInfo = await getPossiblePairsTokenInfo({
        //   tokens,
        //   routeMap,
        //   inputToken,
        // });
        console.log("Getting routes.")
        const routes = await getRoutes({
          jupiter,
          inputToken,
          outputToken,
          inputAmount: 0.01, // 1 unit in UI
          slippage: 1, // 1% slippage
        });
        console.log("Got routes, running executeSwap.");
        // Routes are sorted based on outputAmount, so ideally the first route is the best.
        const routeInfo: RouteInfo = routes!.routesInfos[0];
        const result = await executeSwap({ jupiter, routeInfo });
    
        console.log(result);
        // const { transactions } = await jupiter.exchange({
        //   route: routes.routesInfos[0],
        // });
    
        // const { setupTransaction, swapTransaction, cleanupTransaction } = transactions
    
        // // Sends it through the Solana command.
        // const signature: string = await sendAndConfirmTransaction(connection, transactions, signers);
        // console.log("tx: ", signature);
    
      } catch (error) {
        console.log({ error });
      }
};

const main = async () => {
    /*** Setup ***/
    // 1. Read secret key file to get owner keypair
    const secretKeyString = await readFile("/Users/gtugwell/.config/solana/id.json", {
      encoding: "utf8",
    });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const owner = Keypair.fromSecretKey(secretKey);
    require('dotenv').config()
    const details = {
        sender_keypair: process.env.SENDER_KEY as string,
        secret: process.env.SENDER_SECRET as string,
        reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
        _RPC: process.env.RPC_ENDPOINT as string, // named _RPC because functions were throwing a fit when passing in details.RPC
    };
    
    const RPC = details._RPC;
    const devnet = 'https://api.devnet.solana.com';
    const mainnet = 'https://api.mainnet-beta.solana.com';
    const serumAPI = 'https://solana-api.projectserum.com';
  
    // 2. Initialzie Orca object with mainnet connection
    const connection = new Connection(mainnet, "singleGossip");

    // Execute swap on orca
    executeOrcaSwap({connection, owner});

    console.log("ORCA SWAP EXECUTED");

    //executeJupiterSwap({owner, RPC});

    console.log("Jupiter Swap EXECUTED")
    
  };
  
  main()
    .then(() => {
      console.log("Done");
    })
    .catch((e) => {
      console.error(e);
    });