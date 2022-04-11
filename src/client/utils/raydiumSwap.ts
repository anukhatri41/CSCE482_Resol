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
import { Trade, TradeTransactionParams } from "@raydium-io/raydium-sdk"

const mSOL_SOL_MarketAddress = "5cLrMai1DsLRYc1Nio9qMTicsWtvzjzZfJPXyAoF4t1Z";

// Trade.makeTradeTransaction({});