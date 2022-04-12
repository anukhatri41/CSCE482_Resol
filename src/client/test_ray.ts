import { 
    Trade, 
    TradeTransactionParams, 
    RouteInfo, 
    TokenAccount, 
    SplAccount,
    TokenAmount,
    GetBestAmountOutParams,
    Token,
    Fraction
} from "@raydium-io/raydium-sdk"
import bs58 from "bs58";
import { 
    Connection, 
    Keypair, 
    LAMPORTS_PER_SOL, 
    PublicKey,
    Commitment,
    TokenAccountsFilter,
    Signer
   } from "@solana/web3.js";
// import {
//     getOrCreateAssociatedTokenAccount,
//     getAccount
// } from "@solana/spl-token/src/state/account"
const spltoken = require("@solana/spl-token")
const bn = require("bn.js")
require('dotenv').config()
const details = {
    sender_keypair: process.env.SENDER_KEY as string,
    secret: process.env.SENDER_SECRET as string,
    reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
    _RPC: process.env.RPC_ENDPOINT as string, // named _RPC because functions were throwing a fit when passing in details.RPC
};
import {Buffer} from "buffer"
// import { Fraction } from "@ubeswap/token-math";
// import { Spl } from "@project-serum/anchor";
// if secret key is in .env:
const WALLET_PRIVATE_KEY = details.secret
const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
const owner = Keypair.fromSecretKey(USER_PRIVATE_KEY);
// const owner_ = new PublicKey("")
// console.log(owner);
const mainnet = 'https://api.mainnet-beta.solana.com';
const RPC = details._RPC;
const connection_1 = new Connection(mainnet);
// import bs58 from "bs58";
// const Base58 = require("base-58")

const a = async() => {
    const routeinfo: RouteInfo[] = [
        {
            source: "amm",
            keys: {
                id: new PublicKey("B5ZguAWAGC3GXVtJZVfoMtzvEvDnDKBPCevsUKMy4DTZ"),
                baseMint: new PublicKey("z3dn17yLaGMKffVogeFHQ9zWVcXgqgf3PQnDsNs2g6M"),
                quoteMint: new PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),
                lpMint: new PublicKey("FwaX9W7iThTZH5MFeasxdLpxTVxRcM7ZHieTCnYog8Yb"),
                version: 4,
                programId: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
                authority: new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),
                openOrders: new PublicKey("FVb13WU1W1vFouhRXZWVZWGkQdK5jo35EnaCrMzFqzyd"),
                targetOrders: new PublicKey("FYPP5v8SLHPPcivgBJPE9FgrN6o2QVMB627n3XcZ8rCS"),
                baseVault: new PublicKey("6ttf7G7FR9GWqxiyCLFNaBTvwYzTLPdbbrNcRvShaqtS"),
                quoteVault: new PublicKey("8orrvb6rHB776KbQmszcxPH44cZHdCTYC1fr2a3oHufC"),
                withdrawQueue: new PublicKey("4Q9bNJsWreAGhkwhKYL7ApyhEBuwNxiPkcEQNmUjQGHZ"),
                lpVault: new PublicKey("E12sRQvEHArCULaJu8xppoJKQgJsuDuwPVJZJRrUKYFu"),
                marketVersion: 3,
                marketProgramId: new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"),
                marketId: new PublicKey("HcVjkXmvA1815Es3pSiibsRaFw8r9Gy7BhyzZX83Zhjx"),
                marketAuthority: new PublicKey("Bf9MhS6hwAGSWVJ4uLWKSU6fqPAEroRsHX6ithEjGXiG"),
                marketBaseVault: new PublicKey("FcDWM8eKUEny2wxopDMrZqgmPr3Tmoen9Dckh3MoVX9N"),
                marketQuoteVault: new PublicKey("9ya4Hv4XdzntjiLwxpgqnX8eP4MtFf8YWEssF6C5Pqhq"),
                marketBids: new PublicKey("DaGRz2TAdcVcPwPmYF5JJ7d7kPWvLN68vuBTTMwnoM3T"),
                marketAsks: new PublicKey("3ZRtPBQVcjCpVmCt4xPPeJJiUnDDbrc5jommVHGsDLnT"),
                marketEventQueue: new PublicKey("C5SGEXUCmN1LxmxapPn2XaHX1FF7fAuQG5Wu4yuu8VK6")
            }
        }
    ]

    // const commit: Commitment = "finalized"
    // const config: GetParsedProgramAccountsConfig = {
    const taf: TokenAccountsFilter = {
        mint: new PublicKey("z3dn17yLaGMKffVogeFHQ9zWVcXgqgf3PQnDsNs2g6M")
    }
    // }
    const prgmacct = await connection_1.getParsedTokenAccountsByOwner(new PublicKey("2Nocd3ihAoAzNuvnVKAn9NHU6ieeDiv3eWMAQUHXiUmY"), taf)
    const acctInfo = await connection_1.getParsedAccountInfo(new PublicKey("2Nocd3ihAoAzNuvnVKAn9NHU6ieeDiv3eWMAQUHXiUmY"))
    const ata = await spltoken.getOrCreateAssociatedTokenAccount(connection_1, owner, new PublicKey("z3dn17yLaGMKffVogeFHQ9zWVcXgqgf3PQnDsNs2g6M"), owner.publicKey)
    
    // console.log(prgmacct.value)
    // console.log(prgmacct.value)
    // console.log(acctInfo)
    console.log(ata)
    if (prgmacct.value)
    {
        
        console.log(prgmacct.value[0].pubkey)
        console.log(prgmacct.value[0].account)
        console.log(prgmacct.value[0].account.data.parsed)
    }

    // const b = bn.BN('0')

    // const splacct: SplAccount = {
    //     owner: prgmacct.value[0].account.owner,
    //     state: prgmacct.value[0].account.data.parsed.info.state,
    //     mint: prgmacct.value[0].account.data.parsed.info.mint,
    //     amount: prgmacct.value[0].account.data.parsed.info.tokenAmount.amount,
    //     delegateOption: 0,
    //     delegate: ata.delegate,
    //     isNativeOption: prgmacct.value[0].account.data.parsed.info.isNative,
    //     isNative: prgmacct.value[0].account.data.parsed.info.isNative,
    //     delegatedAmount: new bn.BN(0),
    //     closeAuthorityOption: 0,
    //     closeAuthority: ata.closeAuthority
    // }
    
    const splacct: SplAccount = {
        owner: ata.owner,
        state: prgmacct.value[0].account.data.parsed.info.state,
        mint: ata.mint,
        amount: prgmacct.value[0].account.data.parsed.info.tokenAmount.amount,
        delegateOption: 0,
        delegate: ata.delegate,
        isNativeOption: prgmacct.value[0].account.data.parsed.info.isNative,
        isNative: prgmacct.value[0].account.data.parsed.info.isNative,
        delegatedAmount: new bn.BN(0),
        closeAuthorityOption: 0,
        closeAuthority: ata.closeAuthority
    }
    const tokenaccts: TokenAccount[] = [
        {
            pubkey: new PublicKey("2Nocd3ihAoAzNuvnVKAn9NHU6ieeDiv3eWMAQUHXiUmY"),
            accountInfo: splacct
        }
    ]

    const oxytoken = new Token("z3dn17yLaGMKffVogeFHQ9zWVcXgqgf3PQnDsNs2g6M", 6, "OXY", "Oxygen")
    const raytoken = new Token("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", 6, "RAY", "Raydium")
    // const val = 1000%1
    // console.log(val)
    const oxytokenamt = new TokenAmount(oxytoken, 1000)
    const raytokenamt = new TokenAmount(raytoken, 1)
    // const bestout: GetBestAmountOutParams = {
    //     amountIn: oxytokenamt,
    //     currencyOut: raytoken,
    //     slippage: new Fraction(1,100)
    // }
    // const bestamountout = await Trade.getBestAmountOut(bestout)
    // console.log(bestamountout)
    const params: TradeTransactionParams = 
    {
        connection: connection_1,
        routes: routeinfo,
        routeType: "amm",
        userKeys: {
        tokenAccounts: tokenaccts,
        owner: owner.publicKey,
        //   payer?: PublicKey;
        },
        amountIn: oxytokenamt,
        amountOut: raytokenamt,
        fixedSide: "in"
        // config?: {
        // bypassAssociatedCheck?: boolean;
        // };
    }

    const tx = await Trade.makeTradeTransaction(params)
    console.log(tx)
    let signers: Signer[] = [owner];
    if (tx.tradeTransaction) {
        console.log(tx.tradeTransaction.transaction.instructions)   
        let connection_rpc = new Connection(RPC)
        const txid = await connection_rpc.sendTransaction(tx.tradeTransaction.transaction, signers, {
            skipPreflight: true
        })
        try {
            const swapResult: any = await connection_rpc.confirmTransaction(txid) 
            console.log(swapResult)
        }
        catch (error) {
            console.log(error)
        }
    }

}







const main = async () => {
    
    await a();
  
    };
      main()
        .then(() => {
    
          console.log("Done");
        })
        .catch((e) => {
          console.error(e);
        });