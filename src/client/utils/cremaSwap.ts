import { TokenSwap } from '@cremafinance/crema-sdk'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
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

export const getCremaQuote = async ({
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

    // TO DO: Add support

    // const swap = await new TokenSwap(connection, swapProgramId, swapKey, null).load()
    // const amountOut: any = await swap.preSwapA(inAmount) // a->b

    
    // return quoteInfo.toNumber();


  };
