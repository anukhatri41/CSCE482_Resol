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
  USDC_MINT_ADDRESS
} from "../constants";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token as TokenSPL,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Wallet } from "@project-serum/anchor";
import { InstructionParser } from "./instruction-parser";
const bn = require("bn.js")

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
    // try {
    //   //const connection = new Connection(RPC); // Setup Solana RPC. RPC is our custome RPC from .env file.
    //   const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json(); // Fetch token list from Jupiter API
    //   console.log("Established connection.")
    //   //  Load Jupiter
    //   const jupiter = await Jupiter.load({
    //     connection,
    //     cluster: ENV,
    //     user: owner, // or public key
    //   });
    //   console.log("Jupiter Loaded")
  
    //   // If you know which input/output pair you want
    //   let inputToken;
    //   let outputToken;
    //   if ( tokenIn == 'SOL' && tokenOut == 'OXY') {
    //     inputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); // USDC Mint Info
    //     outputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS); // USDT Mint Info
    //   } else if ( tokenIn == 'OXY' && tokenOut == 'SOL'){
    //     inputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS); // USDC Mint Info
    //     outputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); // USDT Mint Info
    //   } else {
    //     throw("This token pair is not configured.")
    //   }
    //   // const inputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS); // USDC Mint Info
    //   // const outputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); // USDT Mint Info
    //   // console.log("Established trade in & out (OXY -> SOL)");

    //   let found = false
    //   let route = 0
    //   while (!found) {
    //     const routes = await getRoutes({
    //       jupiter,
    //       inputToken,
    //       outputToken,
    //       inputAmount: inAmount, // 1 unit in UI
    //       slippage: 1, // 1% slippage
    //     });

    //     if (outputToken && routes) {
    //       for (let i = 0; i < routes!.routesInfos.length; i++)
    //       {
    //         if (routes!.routesInfos[i].marketInfos.length > 1)
    //         {
    //           // Changed to || so as long as the route isn't Orca x Orca
    //           if (routes!.routesInfos[i].marketInfos[0].marketMeta.amm.label != 'Orca' || routes!.routesInfos[i].marketInfos[1].marketMeta.amm.label != 'Orca')
    //           {
    //             // console.log(routes!.routesInfos[i].marketInfos[0].marketMeta)
    //             // console.log(routes!.routesInfos[i].marketInfos[1].marketMeta)
    //             found = true;
    //             route = i
    //             console.log("Chosen route:", i)
    //             // console.log(
    //             //   "Quote: ",
    //             //   routes.routesInfos[i].outAmount / 10 ** outputToken.decimals,
    //             //   `(${outputToken.symbol})`
    //             // );
    //             break;
    //           }
    //         }
    //       }
        
    //       if (found) {
    //         // console.log("Got routes, running executeSwap.");
    //         const result = await executeSwap({ jupiter, routeInfo: routes!.routesInfos[route] });
    //         if (result.toString() == "failure"){
    //           throw("failed in executeSwap");
    //         }
    //         // console.log(result);
    //       }

    //     }
    //   }
    //   return "success";
    // } catch (error) {
    //   console.log({ error });
    //   return "failure";
    // }
};

export const retrieveJupRoutes = async ({
  connection,
  inAmount,
  owner,
  slippage = 1,
  tokenIn,
  tokenOut
}: {
  connection: Connection;
  inAmount: number;
  owner: Keypair;
  slippage?: number;
  tokenIn: string;
  tokenOut: string;
}) => {

  // Retrieve token list
  const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json();

  console.log(tokens);

  //  Load Jupiter
  const jupiter = await Jupiter.load({
    connection,
    cluster: ENV,
    user: owner, // or public key
  });

  // Find token mint addresses
  let inputToken;
  let outputToken;
  if ( tokenIn == 'SOL' && tokenOut == 'OXY') {
    inputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS);
    outputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS);
  } else if ( tokenIn == 'OXY' && tokenOut == 'SOL'){
    inputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS); 
    outputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); 
  } else if ( tokenIn == 'SOL' && tokenOut == 'SOL') {
    inputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); 
    outputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); 
  }
  else {
    throw("This token pair is not configured.")
  }

  const routes = await getRoutes({
    jupiter,
    inputToken,
    outputToken,
    inputAmount: inAmount, // 1 unit in UI
    slippage: slippage, // 1% slippage
  });

  //console.log("IN retrieveJupRoutes");
  let routeInfo: RouteInfo = routes!.routesInfos[0];
  console.log(routeInfo.marketInfos);
  const { transactions } = await jupiter.exchange({
    routeInfo,
    userPublicKey: owner.publicKey,
    feeAccount: owner.publicKey,
    wrapUnwrapSOL: true,
  });

  // console.log(transactions);
  // console.log("ADSADASDASDASDASDASDASDASDA")

  //return routes;
  // Changed this to return the route with the proper transaction stuff.
  return transactions;
}

export const runUntilProfit = async ({
  connection,
  inAmount,
  owner,
  slippage = 0.1,
  tokenIn,
  tokenOut
}: {
  connection: Connection;
  inAmount: number;
  owner: Keypair;
  slippage?: number;
  tokenIn: string;
  tokenOut: string;
}) => {

  // Retrieve token list
  const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json();

  //  Load Jupiter
  const jupiter = await Jupiter.load({
    connection,
    cluster: ENV,
    user: owner, // or public key
  });

  // Find token mint addresses
  let inputToken;
  let outputToken;
  if ( tokenIn == 'SOL' && tokenOut == 'OXY') {
    inputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS);
    outputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS);
  } else if ( tokenIn == 'OXY' && tokenOut == 'SOL'){
    inputToken = tokens.find((t) => t.address == OXY_MINT_ADDRESS); 
    outputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); 
  } else if ( tokenIn == 'SOL' && tokenOut == 'SOL') {
    inputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); 
    outputToken = tokens.find((t) => t.address == SOL_MINT_ADDRESS); 
  }
  else {
    throw("This token pair is not configured.")
  }

  const routes = await getRoutes({
    jupiter,
    inputToken,
    outputToken,
    inputAmount: inAmount, // 1 unit in UI
    slippage: slippage, // 1% slippage
  });
  let routeInfo: RouteInfo = routes!.routesInfos[0];
  let inAm = routeInfo.inAmount + (0.000005  * LAMPORTS_PER_SOL);
  let outAm = routeInfo.outAmountWithSlippage;
  const diffThresh = 0.0001;
  let spread = outAm - inAm;
  console.log("######################################");
  console.log(routeInfo.marketInfos[0].amm.label);
  console.log(routeInfo.marketInfos[1].amm.label);
  console.log("I: ", inAm/LAMPORTS_PER_SOL);
  console.log("O: ", outAm/LAMPORTS_PER_SOL);
  console.log("S: ", spread/LAMPORTS_PER_SOL);
  if ((spread/LAMPORTS_PER_SOL) > diffThresh) {
    console.log("TGTBT");
    spread = -1;
  }
  console.log("######################################");
  while (spread < 0) {
    const routes = await getRoutes({
      jupiter,
      inputToken,
      outputToken,
      inputAmount: inAmount, // 1 unit in UI
      slippage: slippage, // 1% slippage
    });

    //console.log("IN retrieveJupRoutes");
    routeInfo = routes!.routesInfos[0];
    inAm = routeInfo.inAmount + (0.000005  * LAMPORTS_PER_SOL);
    outAm = routeInfo.outAmountWithSlippage;
    spread = outAm - inAm;
    console.log(routeInfo.marketInfos[0].amm.label);
    console.log(routeInfo.marketInfos[1].amm.label);
    console.log("I: ", inAm/LAMPORTS_PER_SOL);
    console.log("O: ", outAm/LAMPORTS_PER_SOL);
    console.log("S: ", spread/LAMPORTS_PER_SOL);
    if ((spread/LAMPORTS_PER_SOL) > diffThresh) {
      console.log("TGTBT");
      spread = -1;
    }
    console.log("######################################")
  }

  const { transactions } = await jupiter.exchange({
    routeInfo,
    userPublicKey: owner.publicKey,
    feeAccount: owner.publicKey,
    wrapUnwrapSOL: true,
  });
  
  // TRANSACTION META DATA
  //console.log(transactions.swapTransaction.instructions);
  // console.log("ADSADASDASDASDASDASDASDASDA")

  //return routes;
  // Changed this to return the route with the proper transaction stuff.
  return transactions;
}

// This is a modification to runUntilProfit which finds only single routes, so we can put them in 1 transaction.
export const runUntilProfitV2 = async ({
  connection,
  inAmount,
  owner,
  slippage = 0.06,
  token1, // This should be the token you are starting with.
  token2
}: {
  connection: Connection;
  inAmount: number;
  owner: Keypair;
  slippage?: number;
  token1: string;
  token2: string;
}) => {

  // Retrieve token list
  const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json();

  //  Load Jupiter
  const jupiter = await Jupiter.load({
    connection,
    cluster: ENV,
    user: owner, // or public key
  });

  // Find token mint addresses
  let inputToken;
  let outputToken;
  inputToken = tokens.find((t) => t.address == token1);
  outputToken = tokens.find((t) => t.address == token2);

  const routes1 = await getRoutes({
    jupiter,
    inputToken,
    outputToken,
    inputAmount: inAmount, // 1 unit in UI
    slippage: slippage, // 1% slippage
    directOnly: true,
  });


  let routeInfo1: RouteInfo;
  let routeInfo2: RouteInfo;
  //console.log(routes1);
  // let i = 0;
  // while (routes1!.routesInfos[i]!.marketInfos!.length != 1 && routes1!.routesInfos[i]!.marketInfos[0]!.amm!.label) {
  //   i++
  // }
  routeInfo1 = routes1!.routesInfos[0];
  inputToken = tokens.find((t) => t.address == token2);
  outputToken = tokens.find((t) => t.address == token1);

  const routes2 = await getRoutes({
    jupiter,
    inputToken,
    outputToken,
    inputAmount: (routeInfo1.outAmountWithSlippage/LAMPORTS_PER_SOL), // 1 unit in UI
    slippage: slippage, // 1% slippage
    directOnly: true,
  });
  // i = 0;
  // while (routes2!.routesInfos[i]!.marketInfos!.length != 1 && routes2!.routesInfos[i]!.marketInfos[0]!.amm!.label) {
  //   i++
  // }
  routeInfo2 = routes2!.routesInfos[0];

  // console.log("######################################");
  // console.log(routeInfo1);
  // console.log("######################################");
  // console.log(routeInfo2);
  // console.log("######################################");
  
  let inAm = routeInfo1.inAmount + (0.000005  * LAMPORTS_PER_SOL);
  let outAm = routeInfo2.outAmountWithSlippage;
  const diffThresh = 0.0001;
  let spread = outAm - inAm;
  console.log("######################################");
  console.log(routeInfo1.marketInfos[0].amm.label);
  console.log(routeInfo2.marketInfos[0].amm.label);
  console.log("I: ", inAm/LAMPORTS_PER_SOL);
  console.log("O: ", outAm/LAMPORTS_PER_SOL);
  console.log("S: ", spread/LAMPORTS_PER_SOL);
  if ((spread/LAMPORTS_PER_SOL) > diffThresh) {
    console.log("TGTBT");
    spread = -1;
  }
  console.log("######################################");
  while (spread < 0) {
    inputToken = tokens.find((t) => t.address == token1);
    outputToken = tokens.find((t) => t.address == token2);

    const routes1 = await getRoutes({
      jupiter,
      inputToken,
      outputToken,
      inputAmount: inAmount, // 1 unit in UI
      slippage: slippage, // 1% slippage
      directOnly: true,
    });


    let routeInfo1: RouteInfo;
    let routeInfo2: RouteInfo;
    // let i = 0;
    // while (routes1!.routesInfos[i]!.marketInfos!.length != 1 && routes1!.routesInfos[i]!.marketInfos[0]!.amm!.label) {
    //   i++
    // }
    routeInfo1 = routes1!.routesInfos[0];
    inputToken = tokens.find((t) => t.address == token2);
    outputToken = tokens.find((t) => t.address == token1);

    const routes2 = await getRoutes({
      jupiter,
      inputToken,
      outputToken,
      inputAmount: (routeInfo1.outAmountWithSlippage/LAMPORTS_PER_SOL), // 1 unit in UI
      slippage: slippage, // 1% slippage
      directOnly: true,
    });
    // i = 0;
    // while (routes2!.routesInfos[i]!.marketInfos!.length != 1 && routes2!.routesInfos[i]!.marketInfos[0]!.amm!.label) {
    //   i++
    // }
    routeInfo2 = routes2!.routesInfos[0];
    //console.log("IN retrieveJupRoutes");
    inAm = routeInfo1.inAmount + (0.000005  * LAMPORTS_PER_SOL);
    outAm = routeInfo2.outAmountWithSlippage;
    spread = outAm - inAm;
    console.log(routeInfo1.marketInfos[0].amm.label);
    console.log(routeInfo2.marketInfos[0].amm.label);
    console.log("I: ", inAm/LAMPORTS_PER_SOL);
    console.log("O: ", outAm/LAMPORTS_PER_SOL);
    console.log("S: ", spread/LAMPORTS_PER_SOL);
    if ((spread/LAMPORTS_PER_SOL) > diffThresh) {
      console.log("TGTBT");
      spread = -1;
    }
    console.log("######################################")
  }

  const { transactions: transactions1 } = await jupiter.exchange({
    routeInfo: routeInfo1,
    userPublicKey: owner.publicKey,
    feeAccount: owner.publicKey,
    wrapUnwrapSOL: false,
  });

  const { transactions: transactions2 } = await jupiter.exchange({
    routeInfo: routeInfo2,
    userPublicKey: owner.publicKey,
    feeAccount: owner.publicKey,
    wrapUnwrapSOL: false
  });
  
  // TRANSACTION META DATA
  //console.log(transactions.swapTransaction.instructions);
  // console.log("ADSADASDASDASDASDASDASDASDA")

  //return routes;
  // Changed this to return the route with the proper transaction stuff.
  return{ transactions1, transactions2 };
}

export const runUntilProfitV3 = async ({
  connection,
  inAmount,
  owner,
  slippage = 0.1,
  token1, // This should be the token you are starting with.
  token2,
  wallet,
  wrappedOwner,
}: {
  connection: Connection;
  inAmount: number;
  owner: Keypair;
  slippage?: number;
  token1: string;
  token2: string[];
  wallet: Wallet;
  wrappedOwner: PublicKey;
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
  inputToken = tokens.find((t) => t.address == token1);
  outputToken = tokens.find((t) => t.address == token2[i]);

  const routes1 = await getRoutes({
    jupiter,
    inputToken,
    outputToken,
    inputAmount: inAmount, // 1 unit in UI
    slippage: slippage, // 1% slippage
    directOnly: true,
  });


  let routeInfo1: RouteInfo;
  let routeInfo2: RouteInfo;
  //console.log(routes1);
  // let i = 0;
  // while (routes1!.routesInfos[i]!.marketInfos!.length != 1 && routes1!.routesInfos[i]!.marketInfos[0]!.amm!.label) {
  //   i++
  // }
  routeInfo1 = routes1!.routesInfos[0];
  inputToken = tokens.find((t) => t.address == token2[i]);
  outputToken = tokens.find((t) => t.address == token1);

  const routes2 = await getRoutes({
    jupiter,
    inputToken,
    outputToken,
    inputAmount: (routeInfo1.outAmountWithSlippage/LAMPORTS_PER_SOL), // 1 unit in UI
    slippage: slippage, // 1% slippage
    directOnly: true,
  });
  // i = 0;
  // while (routes2!.routesInfos[i]!.marketInfos!.length != 1 && routes2!.routesInfos[i]!.marketInfos[0]!.amm!.label) {
  //   i++
  // }
  routeInfo2 = routes2!.routesInfos[0];

  // console.log("######################################");
  // console.log(routeInfo1);
  // console.log("######################################");
  // console.log(routeInfo2);
  // console.log("######################################");
  
  let inAm = routeInfo1.inAmount + (0.000005  * LAMPORTS_PER_SOL);
  let outAm = routeInfo2.outAmountWithSlippage;
  const diffThresh = 0.0001;
  let spread = outAm - inAm;
  console.log("######################################");
  console.log(routeInfo1.marketInfos[0].amm.label);
  console.log(routeInfo2.marketInfos[0].amm.label);
  console.log("I: ", inAm/LAMPORTS_PER_SOL);
  console.log("O: ", outAm/LAMPORTS_PER_SOL);
  console.log("S: ", spread/LAMPORTS_PER_SOL);
  if ((spread/LAMPORTS_PER_SOL) > diffThresh) {
    console.log("TGTBT");
    spread = -1;
  }
  console.log("######################################");
  while (spread > 0) {
    i++;
    inputToken = tokens.find((t) => t.address == token1);
    outputToken = tokens.find((t) => t.address == token2[i%amtOfTok2]);

    const routes1 = await getRoutes({
      jupiter,
      inputToken,
      outputToken,
      inputAmount: inAmount, // 1 unit in UI
      slippage: slippage, // 1% slippage
      directOnly: true,
    });


    let routeInfo1: RouteInfo;
    let routeInfo2: RouteInfo;
    // let i = 0;
    // while (routes1!.routesInfos[i]!.marketInfos!.length != 1 && routes1!.routesInfos[i]!.marketInfos[0]!.amm!.label) {
    //   i++
    // }
    routeInfo1 = routes1!.routesInfos[0];
    inputToken = tokens.find((t) => t.address == token2[i%amtOfTok2]);
    outputToken = tokens.find((t) => t.address == token1);

    const routes2 = await getRoutes({
      jupiter,
      inputToken,
      outputToken,
      inputAmount: (routeInfo1.outAmountWithSlippage/LAMPORTS_PER_SOL), // 1 unit in UI
      slippage: slippage, // 1% slippage
      directOnly: true,
    });
    // i = 0;
    // while (routes2!.routesInfos[i]!.marketInfos!.length != 1 && routes2!.routesInfos[i]!.marketInfos[0]!.amm!.label) {
    //   i++
    // }
    routeInfo2 = routes2!.routesInfos[0];
    //console.log("IN retrieveJupRoutes");
    inAm = routeInfo1.inAmount + (0.000005  * LAMPORTS_PER_SOL);
    outAm = routeInfo2.outAmountWithSlippage;
    spread = outAm - inAm;
    console.log(routeInfo1.marketInfos[0].amm.label);
    console.log(routeInfo2.marketInfos[0].amm.label);
    console.log("I: ", inAm/LAMPORTS_PER_SOL);
    console.log("O: ", outAm/LAMPORTS_PER_SOL);
    console.log("S: ", spread/LAMPORTS_PER_SOL);
    if ((spread/LAMPORTS_PER_SOL) > diffThresh) {
      console.log("TGTBT");
      spread = -1;
    }
    console.log("######################################")
  }

  const { transactions: transactions1 } = await jupiter.exchange({
    routeInfo: routeInfo1,
    wrapUnwrapSOL: false,
  });

  const { transactions: transactions2 } = await jupiter.exchange({
    routeInfo: routeInfo2,
    wrapUnwrapSOL: false
  });
  
  // TRANSACTION META DATA
  //console.log(transactions.swapTransaction.instructions);
  // console.log("ADSADASDASDASDASDASDASDASDA")

  //return routes;
  // Changed this to return the route with the proper transaction stuff.
  let swapTransaction = transactions1.swapTransaction;
  console.log("swapTransaction1 #################")
  for (let i in swapTransaction.instructions) {

    const parser = new InstructionParser();
    const ix = parser.coder.instruction.decode(swapTransaction.instructions[i].data, "base58");

    // console.log(swapTransaction.instructions[i].data)
    // if (ix)
    // console.log(ix.data)

    if(ix) {
      for (let i in ix.data) {
        console.log("i: ", i == "inAmount")
        console.log(i)
        if (ix.data[i as keyof typeof ix.data]) {
          console.log("in if: ")
          console.log(ix.data[i as keyof typeof ix.data].toString())
          ix.data[i as keyof typeof ix.data] = new bn.BN(0)
          console.log(ix.data[i as keyof typeof ix.data].toString())
        }
      }
    }
  }

  swapTransaction = transactions2.swapTransaction;
  console.log("swapTransaction2 #################")
  for (let i in swapTransaction.instructions) {

    const parser = new InstructionParser();
    const ix = parser.coder.instruction.decode(swapTransaction.instructions[i].data, "base58");

    // console.log(swapTransaction.instructions[i].data)
    // if (ix)
    // console.log(ix.data)

    if(ix) {
      for (let i in ix.data) {
        console.log("i: ", i == "minimumOutAmount")
        console.log(i)
        if (ix.data[i as keyof typeof ix.data]) {
          console.log("in if: ")
          console.log(ix.data[i as keyof typeof ix.data].toString())
          ix.data[i as keyof typeof ix.data] = new bn.BN(0)
          console.log(ix.data[i as keyof typeof ix.data].toString())
        }
      }
    }
  }

  return{ transactions1, transactions2 };
}