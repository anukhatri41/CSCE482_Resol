import { readFile } from "mz/fs";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { executeOrcaSwap } from "./utils/orcaSwap"
import { executeJupiterSwap } from "./utils/jupiterSwap"

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