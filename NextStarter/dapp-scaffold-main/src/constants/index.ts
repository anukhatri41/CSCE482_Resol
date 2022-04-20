import { Cluster } from "@solana/web3.js";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";

require("dotenv").config();

// Endpoints, connection
export const ENV: Cluster = (process.env.CLUSTER as Cluster) || "mainnet-beta";

// Sometimes, your RPC endpoint may reject you if you spam too many RPC calls. Sometimes, your PRC server
// may have invalid cache and cause problems.
export const SOLANA_RPC_ENDPOINT =
  ENV === "devnet"
    ? "https://api.devnet.solana.com"
    : "https://ssc-dao.genesysgo.net";

// Wallets
// export const WALLET_PRIVATE_KEY =
//   process.env.WALLET_PRIVATE_KEY || "PASTE YOUR WALLET PRIVATE KEY";
// export const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
// export const USER_KEYPAIR = Keypair.fromSecretKey(USER_PRIVATE_KEY);

// Token Mints
export const INPUT_MINT_ADDRESS =
  ENV === "devnet"
    ? "So11111111111111111111111111111111111111112" // SOL
    : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
export const OUTPUT_MINT_ADDRESS =
  ENV === "devnet"
    ? "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt" // SRM
    : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; // USDT

export const SOL_MINT_ADDRESS = "So11111111111111111111111111111111111111112";
export const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const OXY_MINT_ADDRESS = "z3dn17yLaGMKffVogeFHQ9zWVcXgqgf3PQnDsNs2g6M";
export const mSOL_MINT_ADDRESS = "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So";
export const STEP_MINT_ADDRESS = "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT";
export const stSOL_MINT_ADDRESS = "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj";
export const RAY_MINT_ADDRESS = "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R";
export const oneSOL_MINT_ADDRESS = "4ThReWAbAVZjNVgs5Ui9Pk3cZ5TYaD9u6Y89fp6EFzoF";
export const ALL_MINT_ADDRESS = "7ScYHk4VDgSRnQngAUtQk4Eyf7fGat8P4wXq6e2dkzLj";
export const SHDW_MINT_ADDRESS = "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y";
export const sRLY_MINT_ADDRESS = "RLYv2ubRMDLcGG2UyvPmnPmkfuQTsMbg4Jtygc7dmnq";
export const USDT_MINT_ADDRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
export const UXP_MINT_ADDRESS = "UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M";
export const soETH_MINT_ADDRESS = "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk";
// Interface
export interface Token {
  chainId: number; // 101,
  address: string; // '8f9s1sUmzUbVZMoMh6bufMueYH1u4BJSM57RCEvuVmFp',
  symbol: string; // 'TRUE',
  name: string; // 'TrueSight',
  decimals: number; // 9,
  logoURI: string; // 'https://i.ibb.co/pKTWrwP/true.jpg',
  tags: string[]; // [ 'utility-token', 'capital-token' ]
}