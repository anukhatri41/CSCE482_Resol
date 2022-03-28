import { Jupiter, RouteInfo, TOKEN_LIST_URL } from "@jup-ag/core";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import fetch from "isomorphic-fetch";
import {
  ENV,
  INPUT_MINT_ADDRESS,
  OUTPUT_MINT_ADDRESS,
  SOLANA_RPC_ENDPOINT,
  SOL_MINT_ADDRESS,
  OXY_MINT_ADDRESS,
  Token,
  USDC_MINT_ADDRESS
} from "../constants";

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
        // console.log("Possible number of routes:", routes.routesInfos.length);
        // console.log(
        //   "Best quote: ",
        //   routes.routesInfos[0].outAmount / 10 ** outputToken.decimals,
        //   `(${outputToken.symbol})`
        // );
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
        wrapUnwrapSOL: true,
      });
  
      //console.log("EXECUTE DEFINED");
      // console.log(execute);
      // Execute swap
      //console.log("EXECUTING SWAP");
      const swapResult: any = await execute(); // Force any to ignore TS misidentifying SwapResult type
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

export const executeJupiterSwap = async ({
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
    try {
      //const connection = new Connection(RPC); // Setup Solana RPC. RPC is our custome RPC from .env file.
      const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json(); // Fetch token list from Jupiter API
      console.log("Established connection.")
      //  Load Jupiter
      const jupiter = await Jupiter.load({
        connection,
        cluster: ENV,
        user: owner, // or public key
      });
      console.log("Jupiter Loaded")
  
      // If you know which input/output pair you want
      let inputToken;
      let outputToken;
      if ( tokenIn == 'SOL' && tokenOut == 'OXY') {
        inputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); // USDC Mint Info
        outputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS); // USDT Mint Info
      } else if ( tokenIn == 'OXY' && tokenOut == 'SOL'){
        inputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS); // USDC Mint Info
        outputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); // USDT Mint Info
      } else {
        throw("This token pair is not configured.")
      }
      // const inputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS); // USDC Mint Info
      // const outputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); // USDT Mint Info
      // console.log("Established trade in & out (OXY -> SOL)");

      let found = false
      let route = 0
      while (!found) {
        const routes = await getRoutes({
          jupiter,
          inputToken,
          outputToken,
          inputAmount: inAmount, // 1 unit in UI
          slippage: 1, // 1% slippage
        });

        if (outputToken && routes) {
          for (let i = 0; i < routes!.routesInfos.length; i++)
          {
            if (routes!.routesInfos[i].marketInfos.length > 1)
            {
              // Changed to || so as long as the route isn't Orca x Orca
              if (routes!.routesInfos[i].marketInfos[0].marketMeta.amm.label != 'Orca' || routes!.routesInfos[i].marketInfos[1].marketMeta.amm.label != 'Orca')
              {
                // console.log(routes!.routesInfos[i].marketInfos[0].marketMeta)
                // console.log(routes!.routesInfos[i].marketInfos[1].marketMeta)
                found = true;
                route = i
                console.log("Chosen route:", i)
                // console.log(
                //   "Quote: ",
                //   routes.routesInfos[i].outAmount / 10 ** outputToken.decimals,
                //   `(${outputToken.symbol})`
                // );
                break;
              }
            }
          }
        
          if (found) {
            // console.log("Got routes, running executeSwap.");
            const result = await executeSwap({ jupiter, routeInfo: routes!.routesInfos[route] });
            if (result.toString() == "failure"){
              throw("failed in executeSwap");
            }
            // console.log(result);
          }

        }
      }
      return "success";
    } catch (error) {
      console.log({ error });
      return "failure";
    }
};