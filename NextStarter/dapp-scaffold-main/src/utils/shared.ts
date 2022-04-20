
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, TokenAccountsFilter, Transaction, SystemProgram } from "@solana/web3.js";
import { Jupiter, RouteInfo, TOKEN_LIST_URL, MarketInfo } from "@jup-ag/core";
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


export const fetchWalletBalance = async ({
    connection,
    owner,
    tokenAccountsFilter
  }: {
    connection: Connection;
    owner: Keypair;
    tokenAccountsFilter: TokenAccountsFilter;
  }) => {
    const SOLBalance = await connection.getBalance(owner.publicKey);
    const OXYBalance = await connection.getParsedTokenAccountsByOwner(owner.publicKey,tokenAccountsFilter);

    console.log("SOL Balance: ", SOLBalance/LAMPORTS_PER_SOL);
    console.log("OXY Balance: ", OXYBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount);

    return {
        SOLBalance,
        OXYBalance
    }
  }

  // wsol account
export const createWSolAccountWallet = async ({
  connection,
  owner,
  wallet
}: {
  connection: Connection;
  owner: Keypair;
  wallet: Wallet;
}) => {
  const wsolAddress = await TokenSPL.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(SOL_MINT_ADDRESS),
    wallet.publicKey
  );

  const wsolAccount = await connection.getAccountInfo(wsolAddress);

  if (!wsolAccount) {
    const transaction = new Transaction({
      feePayer: wallet.publicKey,
    });
    const instructions = [];

    instructions.push(
      await TokenSPL.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(SOL_MINT_ADDRESS),
        wsolAddress,
        wallet.publicKey,
        wallet.publicKey
      )
    );

    // fund 1 sol to the account
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wsolAddress,
        lamports: 1_000_000_000/4, // 1 sol
      })
    );

    instructions.push(
      // This is not exposed by the types, but indeed it exists
      (TokenSPL as any).createSyncNativeInstruction(TOKEN_PROGRAM_ID, wsolAddress)
    );

    transaction.add(...instructions);
    transaction.recentBlockhash = await (
      await connection.getRecentBlockhash()
    ).blockhash;
    transaction.partialSign(wallet.payer);
    const result = await connection.sendTransaction(transaction, [
      wallet.payer,
    ]);
    console.log({ result });
  }

  return wsolAccount;
};

export const createWSolAccount = async ({
  connection,
  owner
}: {
  connection: Connection;
  owner: Keypair;
}) => {
  const wsolAddress = await TokenSPL.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(SOL_MINT_ADDRESS),
    owner.publicKey
  );

  const wsolAccount = await connection.getAccountInfo(wsolAddress);

  if (!wsolAccount) {
    const transaction = new Transaction({
      feePayer: owner.publicKey,
    });
    const instructions = [];

    instructions.push(
      await TokenSPL.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(SOL_MINT_ADDRESS),
        wsolAddress,
        owner.publicKey,
        owner.publicKey
      )
    );

    // fund 1 sol to the account
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: owner.publicKey,
        toPubkey: wsolAddress,
        lamports: 1_000_000_000/4, // 1 sol
      })
    );

    instructions.push(
      // This is not exposed by the types, but indeed it exists
      (TokenSPL as any).createSyncNativeInstruction(TOKEN_PROGRAM_ID, wsolAddress)
    );

    transaction.add(...instructions);
    transaction.recentBlockhash = await (
      await connection.getRecentBlockhash()
    ).blockhash;
    transaction.partialSign(owner);
    const result = await connection.sendTransaction(transaction, [
      owner,
    ]);
    console.log({ result });
  }

  return wsolAccount;
};