import { Jupiter, RouteInfo, TOKEN_LIST_URL, MarketInfo } from "@jup-ag/core";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import fetch from "isomorphic-fetch";
import {
  ENV,
  INPUT_MINT_ADDRESS,
  OUTPUT_MINT_ADDRESS,
  SOLANA_RPC_ENDPOINT,
  SOL_MINT_ADDRESS,
  OXY_MINT_ADDRESS,
  mSOL_MINT_ADDRESS,
  Token,
  USDC_MINT_ADDRESS,
  oneSOL_MINT_ADDRESS,
  USDT_MINT_ADDRESS,
  soETH_MINT_ADDRESS
} from "../constants";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token as TokenSPL,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Wallet } from "@project-serum/anchor";
import { InstructionParser } from "./instruction-parser";
const bn = require("bn.js")
const axios = require('axios');

  const getRoutes = async ({
    jupiter,
    inputToken,
    outputToken,
    inputAmount,
    slippage,
    directOnly = false,
  }: {
    jupiter: Jupiter;
    inputToken?: Token;
    outputToken?: Token;
    inputAmount: number;
    slippage: number;
    directOnly?: boolean;
  }) => {
    try {

      let inputTokenSymbol;
      let outputTokenSymbol;
      if (!inputToken || !outputToken) {
        return null;
      }
      
      inputTokenSymbol = inputToken.symbol;
      outputTokenSymbol = outputToken.symbol;
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
              onlyDirectRoutes: directOnly,
            })
          : null;
  
      if (routes && routes.routesInfos) {
        // console.log("Possible number of routes:", routes.routesInfos.length);
        // console.log(
        //   "Best quote: ",
        //   routes.routesInfos[0].outAmount / 10 ** outputToken.decimals,
        //   `(${outputToken.symbol})`
        // );
        return {routes, inputAmount, inputTokenSymbol, outputTokenSymbol};
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
      const { transactions, execute } = await jupiter.exchange({
        routeInfo,
        wrapUnwrapSOL: true,
      });
  
      //console.log("EXECUTE DEFINED");
      // console.log(execute);
      // Execute swap
      //console.log("EXECUTING SWAP");
      const swapResult: any = await execute(); // Force any to ignore TS misidentifying SwapResult type
      //console.log(transactions);
      // console.log("Swapped");
  
      if (swapResult.error) {
        console.log(swapResult.error);
        return "failure";
      } else {
        console.log(swapResult.txid);
        // console.log(
        //   `inputAddress=${swapResult.inputAddress.toString()} outputAddress=${swapResult.outputAddress.toString()}`
        // );
        // console.log(
        //   `inputAmount=${swapResult.inputAmount} outputAmount=${swapResult.outputAmount}`
        // );
        // console.log()
        return "success";
      }
    } catch (error) {
      throw error;
    }
  };


////// Function we are using to perform swaps.
export const runUntilProfitV3 = async ({
  connection,
  inAmount,
  owner,
  slippage = 0.05,
  token1, // This should be the token you are starting with.
  token2,
  wrappedOwner,
}: {
  connection: Connection;
  inAmount: number;
  owner: Keypair;
  slippage?: number;
  token1: string;
  token2: string[];
  wrappedOwner?: PublicKey;
}) => {

  // Retrieve token list
  const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json();

  //  Load Jupiter
  const jupiter = await Jupiter.load({
    connection,
    cluster: ENV,
    user: owner, // or public key
  });

  let i = 0; // Initial Swap
  const amtOfTok2 = token2.length;

  // Find token mint addresses
  let inputToken;
  let outputToken;
  
  // Initialize variables for while loop
  let inAm = 0;
  let outAm = 0;
  let outAmString = "";
  let DECIMAL_PLACES = LAMPORTS_PER_SOL;
  let NUMBER_OF_DECIMAL_PLACES = 9;
  const diffThresh = inAmount * LAMPORTS_PER_SOL;
  let spread = outAm - inAm;
  console.log("######################################")

  let transactions1;
  let transactions2;
  let amm1;
  let amm2;

  // console.log("#1")
  let stop_response = await fetch('http://localhost:4000/tsx_params/1')
  // console.log("#2")
  let stop_flag = await stop_response.json();
  let stop_flag_triggered = false;

  while (!stop_flag_triggered) {
    stop_response = await fetch('http://localhost:4000/tsx_params/1')
    stop_flag = await stop_response.json();
    // console.log("#2.2")

    // If we click stop, we want the code to break, then
    if(stop_flag.stop == true){
      stop_flag_triggered = true;
      continue;
    }

    inputToken = tokens.find((t) => t.address == token1);
    outputToken = tokens.find((t) => t.address == token2[i%amtOfTok2]);

    const { routes: routes1, inputAmount: inputAmount1 , inputTokenSymbol: inputTokenSymbol1, outputTokenSymbol: outputTokenSymbol1 } = await getRoutes({
      jupiter,
      inputToken,
      outputToken,
      inputAmount: inAmount, // 1 unit in UI
      slippage: slippage, // 1% slippage
      directOnly: true,
    });

    let routeInfo1: RouteInfo;
    let routeInfo2: RouteInfo;
    let route1Found = false;
    let route2Found = false;

    //console.log(routes1!.routesInfos!);
    for (var rInfo of routes1!.routesInfos!){
      // console.log(rInfo!.marketInfos[0]!.amm!.label);
      if (rInfo!.marketInfos[0]!.amm!.label == "Orca" || rInfo!.marketInfos[0]!.amm!.label == "Raydium" || rInfo!.marketInfos[0]!.amm!.label == "Aldrin") {
        route1Found = true;
        routeInfo1 = rInfo;

        // console.log(rInfo);

        break;
      }
      // console.log("#############################",rInfo!.marketInfos[0]!.amm!.label);

    }
    if (!route1Found) {
      i++;
      continue;
    }

    inputToken = tokens.find((t) => t.address == token2[i%amtOfTok2]);
    outputToken = tokens.find((t) => t.address == token1);

    // console.log(routeInfo1.marketInfos.length);
    // console.log(routeInfo2.marketInfos.length);

    DECIMAL_PLACES = LAMPORTS_PER_SOL;
    // Adjusting decimal places.
    NUMBER_OF_DECIMAL_PLACES = inputToken.decimals;
    // console.log(NUMBER_OF_DECIMAL_PLACES);
    DECIMAL_PLACES = LAMPORTS_PER_SOL/(10**(9 - inputToken.decimals));

    const { routes: routes2, inputAmount: inputAmount2 , inputTokenSymbol: inputTokenSymbol2, outputTokenSymbol: outputTokenSymbol2 } = await getRoutes({
      jupiter,
      inputToken,
      outputToken,
      inputAmount: (routeInfo1!.outAmountWithSlippage/DECIMAL_PLACES), // 1 unit in UI
      slippage: slippage, // 1% slippage
      directOnly: true,
    });
    
    for (var rInfo of routes2!.routesInfos!){
      if (rInfo!.marketInfos[0]!.amm!.label == "Orca" || rInfo!.marketInfos[0]!.amm!.label == "Raydium" || rInfo!.marketInfos[0]!.amm!.label == "Aldrin") {
        route2Found = true;
        routeInfo2 = rInfo;

        // console.log(rInfo!.marketInfos[0]!.amm!.label);
        // console.log(rInfo);

        break;
      }
      console.log("#############################", rInfo!.marketInfos[0]!.amm!.label);
    }
    if (!route2Found) {
      i++;
      continue;
    }

    const { transactions: transactions1 } = await jupiter.exchange({
      routeInfo: routeInfo1!,
      wrapUnwrapSOL: false,
    });

    const { transactions: transactions2 } = await jupiter.exchange({
      routeInfo: routeInfo2!,
      wrapUnwrapSOL: false
    });

    let swapTransaction = transactions2.swapTransaction;
    for (let i in swapTransaction.instructions) {

      const parser = new InstructionParser();
      const ix = parser.coder.instruction.decode(swapTransaction.instructions[i].data, "base58");
  
      if(ix) {
        for (let i in ix.data) {
          if (ix.data[i as keyof typeof ix.data] && i == "minimumOutAmount") {
            //console.log("i: ", i == "minimumOutAmount")
            //console.log(i)
            outAmString = ix.data[i as keyof typeof ix.data].toString();
            // ix.data[i as keyof typeof ix.data] = new bn.BN(0)
            // console.log(ix.data[i as keyof typeof ix.data].toString())
          }
        }
      }
    }

    // Calculate spread
    inAm = (routeInfo1!.inAmount + (0.000005  * LAMPORTS_PER_SOL))/LAMPORTS_PER_SOL;
    // Explicit type conversion of string to number
    let outAm: number  = +outAmString;

    DECIMAL_PLACES = LAMPORTS_PER_SOL;
    outAm = outAm/DECIMAL_PLACES;
    // console.log("#3")
    spread = outAm - inAm;
    amm1 = routeInfo1!.marketInfos[0].amm.label;
    amm2 = routeInfo2!.marketInfos[0].amm.label;
    console.log(amm1);
    console.log(amm2);
    console.log("I: ", inAm);
    console.log("O: ", outAm);
    console.log("S: ", spread);

    // Writing to db
    await axios.put('http://localhost:4000/tsx_log/1', {
      firstSwap: {
        amm1: amm1,
        inputAmount1: inputAmount1,
        inputTokenSymbol1: inputTokenSymbol1,
        outputAmount1: inputAmount2,
        outputTokenSymbol1: outputTokenSymbol1
      },
      secondSwap: {
        amm2: amm2,
        inputAmount2: inputAmount2,
        inputTokenSymbol2: inputTokenSymbol2,
        outputAmount2: outAm,
        outputTokenSymbol2: outputTokenSymbol2
      },
      totalIn: inAm,
      totalOut: outAm,
      spread: spread
    }).then(resp => {
      console.log(resp.data);
    }).catch(error => {
      console.log(error);
    });

    if (spread > diffThresh) {
      console.log("TGTBT");
      spread = -1;
    }
    console.log("######################################")
    if (spread > 0) {
      return{ transactions1, transactions2, stop_flag_triggered };
    }
    i++;
    DECIMAL_PLACES = LAMPORTS_PER_SOL;
  }

  //return routes;
  // Changed this to return the route with the proper transaction stuff.
  return{ transactions1, transactions2, stop_flag_triggered };
}