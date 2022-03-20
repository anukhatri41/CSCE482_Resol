import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, TokenAccountsFilter } from "@solana/web3.js";

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