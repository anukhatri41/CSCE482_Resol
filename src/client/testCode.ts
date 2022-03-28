import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, TokenAccountsFilter } from "@solana/web3.js";
import { executeOrcaSwap, getOrcaQuote } from "./utils/orcaSwap";
import { executeJupiterSwap, retrieveJupRoutes } from "./utils/jupiterSwap";
import { fetchWalletBalance } from "./utils/shared";
import bs58 from "bs58";
import {
  OXY_MINT_ADDRESS,
} from "./constants";
const sleep = require('./sleep');

const main = async () => {
    
  };
    main()
      .then(() => {
  
        console.log("Done");
      })
      .catch((e) => {
        console.error(e);
      });