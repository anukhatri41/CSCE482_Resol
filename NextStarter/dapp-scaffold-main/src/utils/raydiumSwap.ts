import { 
    AmmSource,
    Trade, 
    TradeTransactionParams, 
    RouteInfo, 
    TokenAccount, 
    SplAccount,
    TokenAmount,
    GetBestAmountOutParams,
    Liquidity,
    LiquidityFetchInfoParams,
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
    Signer,
    Transaction
   } from "@solana/web3.js";
import {
    ENV,
    INPUT_MINT_ADDRESS,
    OUTPUT_MINT_ADDRESS,
    SOLANA_RPC_ENDPOINT,
    SOL_MINT_ADDRESS,
    OXY_MINT_ADDRESS,
    mSOL_MINT_ADDRESS,
    STEP_MINT_ADDRESS,
    USDC_MINT_ADDRESS,
    RAY_MINT_ADDRESS
} from "../constants";
import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";
import Decimal from "decimal.js";

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
// const WALLET_PRIVATE_KEY = details.secret
// const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
// const owner = Keypair.fromSecretKey(USER_PRIVATE_KEY);
// // const owner_ = new PublicKey("")
// // console.log(owner);
// const mainnet = 'https://api.mainnet-beta.solana.com';
// const RPC = details._RPC;
// const connection_1 = new Connection(mainnet);
// import bs58 from "bs58";
// const Base58 = require("base-58")

const mSOL_SOL_MarketAddress = "5cLrMai1DsLRYc1Nio9qMTicsWtvzjzZfJPXyAoF4t1Z";

export const raydiumSwap = async({

}: {

}) => {
    const details = {
        sender_keypair: process.env.SENDER_KEY as string,
        secret: process.env.SENDER_SECRET as string,
        reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
        _RPC: process.env.RPC_ENDPOINT as string, // named _RPC because functions were throwing a fit when passing in details.RPC
    };

    const WALLET_PRIVATE_KEY = details.secret
    const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
    const owner = Keypair.fromSecretKey(USER_PRIVATE_KEY);
    // const owner_ = new PublicKey("")
    // console.log(owner);
    const mainnet = 'https://api.mainnet-beta.solana.com';
    const RPC = details._RPC;
    const connection_1 = new Connection(mainnet);

    const routeinfo: RouteInfo[] = [
        // Route for OXY-RAY
        // {
        //     source: "amm",
        //     keys: {
        //         id: new PublicKey("B5ZguAWAGC3GXVtJZVfoMtzvEvDnDKBPCevsUKMy4DTZ"),
        //         baseMint: new PublicKey("z3dn17yLaGMKffVogeFHQ9zWVcXgqgf3PQnDsNs2g6M"),
        //         quoteMint: new PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),
        //         lpMint: new PublicKey("FwaX9W7iThTZH5MFeasxdLpxTVxRcM7ZHieTCnYog8Yb"),
        //         version: 4,
        //         programId: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
        //         authority: new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),
        //         openOrders: new PublicKey("FVb13WU1W1vFouhRXZWVZWGkQdK5jo35EnaCrMzFqzyd"),
        //         targetOrders: new PublicKey("FYPP5v8SLHPPcivgBJPE9FgrN6o2QVMB627n3XcZ8rCS"),
        //         baseVault: new PublicKey("6ttf7G7FR9GWqxiyCLFNaBTvwYzTLPdbbrNcRvShaqtS"),
        //         quoteVault: new PublicKey("8orrvb6rHB776KbQmszcxPH44cZHdCTYC1fr2a3oHufC"),
        //         withdrawQueue: new PublicKey("4Q9bNJsWreAGhkwhKYL7ApyhEBuwNxiPkcEQNmUjQGHZ"),
        //         lpVault: new PublicKey("E12sRQvEHArCULaJu8xppoJKQgJsuDuwPVJZJRrUKYFu"),
        //         marketVersion: 3,
        //         marketProgramId: new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"),
        //         marketId: new PublicKey("HcVjkXmvA1815Es3pSiibsRaFw8r9Gy7BhyzZX83Zhjx"),
        //         marketAuthority: new PublicKey("Bf9MhS6hwAGSWVJ4uLWKSU6fqPAEroRsHX6ithEjGXiG"),
        //         marketBaseVault: new PublicKey("FcDWM8eKUEny2wxopDMrZqgmPr3Tmoen9Dckh3MoVX9N"),
        //         marketQuoteVault: new PublicKey("9ya4Hv4XdzntjiLwxpgqnX8eP4MtFf8YWEssF6C5Pqhq"),
        //         marketBids: new PublicKey("DaGRz2TAdcVcPwPmYF5JJ7d7kPWvLN68vuBTTMwnoM3T"),
        //         marketAsks: new PublicKey("3ZRtPBQVcjCpVmCt4xPPeJJiUnDDbrc5jommVHGsDLnT"),
        //         marketEventQueue: new PublicKey("C5SGEXUCmN1LxmxapPn2XaHX1FF7fAuQG5Wu4yuu8VK6")
        //     }
        // }
        
        // Route for STEP-SOL
        {
            source: "amm",
            keys: {
                id: new PublicKey("DN1Rqx5AE5jHV8pTPiwUcSYVAK15YrLGkfVdU8GxhWn1"),
                baseMint: new PublicKey("StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT"),
                quoteMint: new PublicKey("So11111111111111111111111111111111111111112"),
                lpMint: new PublicKey("6wXCStTxZTkz8gv3nrS1adJAKitUH6TVVrBF3XETGtKy"),
                version: 4,
                programId: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
                authority: new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),
                openOrders: new PublicKey("2bzaNYPMZXAXZRTKMPicB76wwfiuZrvxo9qbXvzgg4Mh"),
                targetOrders: new PublicKey("aToiSVQym48z5LaV9dsfHtqAWLRnWudGuSt6FxbTj8r"),
                baseVault: new PublicKey("74cQrLwSHqWLe9cbtZsq9Lyc1hoeLkXjzXjpGitijqKX"),
                quoteVault: new PublicKey("Hr7yHnCCWH7Rz5FDc5rKMRga5v4zLvn4r1s9ZppQfM4H"),
                withdrawQueue: new PublicKey("7skkQNxqSR6xX4adTjgTtjujW86Vzjug73CyXSfbaQxD"),
                lpVault: new PublicKey("A6KZ7EzDg6SLycr5CbSXyKxHbaswvb8uEGt3AYerKPmQ"),
                marketVersion: 3,
                marketProgramId: new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"),
                marketId: new PublicKey("BCnac98Juvh67YxrTJgB2yc1k5PcMLDJrz9Y3AWwA14e"),
                marketAuthority: new PublicKey("BfQGbUZ3oF9GHfTvhVEf1DXYKaT6KJ7HP2zpRiw5q4hY"),
                marketBaseVault: new PublicKey("BVNZarvqYtyTeTc2zzEsfqopyC3G2WvcutZajLqXGbyu"),
                marketQuoteVault: new PublicKey("7rqKWgHdjokcbA1mqRQKre2WcxUyinUpgihvW5h6Vro3"),
                marketBids: new PublicKey("67gMCnsgDeWeWwUK3vgqXExXYhsnmcqg7KWQoCkZAfzw"),
                marketAsks: new PublicKey("Hu3CF6B65uvt4NwrpLLsVeRRGpkYFxxnyMpdGNowiEio"),
                marketEventQueue: new PublicKey("9PLiK3NgJN7eaVXTLAFNxmtunqWojfFYZQU52MMxNHWp")
            }
        }
    ]

    const tokenaccountfilter_ray: TokenAccountsFilter = {
        mint: new PublicKey(RAY_MINT_ADDRESS),
    }
    const tokenaccountfilter_oxy: TokenAccountsFilter = {
        mint: new PublicKey(OXY_MINT_ADDRESS),
    }
    const tokenaccountfilter_sol: TokenAccountsFilter = {
        mint: new PublicKey(SOL_MINT_ADDRESS),
    }
    const tokenaccountfilter_step: TokenAccountsFilter = {
        mint: new PublicKey(STEP_MINT_ADDRESS),
    }

    // const prgmacct = await connection_1.getParsedTokenAccountsByOwner(new PublicKey("2Nocd3ihAoAzNuvnVKAn9NHU6ieeDiv3eWMAQUHXiUmY"), taf)
    const tokenaccount_sol = await connection_1.getParsedTokenAccountsByOwner(owner.publicKey, tokenaccountfilter_sol)
    const tokenaccount_step = await connection_1.getParsedTokenAccountsByOwner(owner.publicKey, tokenaccountfilter_step)
    // const acctInfo = await connection_1.getParsedAccountInfo(owner.publicKey)
    const ata_sol = await spltoken.getOrCreateAssociatedTokenAccount(connection_1, owner, new PublicKey(SOL_MINT_ADDRESS), owner.publicKey)
    const ata_step = await spltoken.getOrCreateAssociatedTokenAccount(connection_1, owner, new PublicKey(STEP_MINT_ADDRESS), owner.publicKey)


    const ata_1 = ata_sol;
    const tokenaccnt_1 = tokenaccount_sol;
    const ata_2 = ata_step;
    const tokenaccnt_2 = tokenaccount_step;

    ////////////////////////////////////////////////////

    // const splacct: SplAccount = {
    //     owner: ata_oxy.owner,
    //     state: tokenaccount_oxy.value[0].account.data.parsed.info.state,
    //     mint: ata_oxy.mint,
    //     amount: tokenaccount_oxy.value[0].account.data.parsed.info.tokenAmount.amount,
    //     delegateOption: 0,
    //     delegate: ata_oxy.delegate,
    //     isNativeOption: tokenaccount_oxy.value[0].account.data.parsed.info.isNative,
    //     isNative: tokenaccount_oxy.value[0].account.data.parsed.info.isNative,
    //     delegatedAmount: new bn.BN(0),
    //     closeAuthorityOption: 0,
    //     closeAuthority: ata_oxy.closeAuthority
    // }
    // const splacct_ray: SplAccount = {
    //     owner: ata_ray.owner,
    //     state: tokenaccount_ray.value[0].account.data.parsed.info.state,
    //     mint: ata_ray.mint,
    //     amount: tokenaccount_ray.value[0].account.data.parsed.info.tokenAmount.amount,
    //     delegateOption: 0,
    //     delegate: ata_ray.delegate,
    //     isNativeOption: tokenaccount_ray.value[0].account.data.parsed.info.isNative,
    //     isNative: tokenaccount_ray.value[0].account.data.parsed.info.isNative,
    //     delegatedAmount: new bn.BN(0),
    //     closeAuthorityOption: 0,
    //     closeAuthority: ata_ray.closeAuthority
    // }

    const splacct_1: SplAccount = {
        owner: ata_1.owner,
        state: tokenaccnt_1.value[0].account.data.parsed.info.state,
        mint: ata_1.mint,
        amount: tokenaccnt_1.value[0].account.data.parsed.info.tokenAmount.amount,
        delegateOption: 0,
        delegate: ata_1.delegate,
        isNativeOption: tokenaccnt_1.value[0].account.data.parsed.info.isNative,
        isNative: tokenaccnt_1.value[0].account.data.parsed.info.isNative,
        delegatedAmount: new bn.BN(0),
        closeAuthorityOption: 0,
        closeAuthority: ata_1.closeAuthority
    }
    const splacct_2: SplAccount = {
        owner: ata_2.owner,
        state: tokenaccnt_2.value[0].account.data.parsed.info.state,
        mint: ata_2.mint,
        amount: tokenaccnt_2.value[0].account.data.parsed.info.tokenAmount.amount,
        delegateOption: 0,
        delegate: ata_2.delegate,
        isNativeOption: tokenaccnt_2.value[0].account.data.parsed.info.isNative,
        isNative: tokenaccnt_2.value[0].account.data.parsed.info.isNative,
        delegatedAmount: new bn.BN(0),
        closeAuthorityOption: 0,
        closeAuthority: ata_2.closeAuthority
    }

    const tokenaccts: TokenAccount[] = [
        {
            pubkey: new PublicKey(tokenaccnt_1.value[0].pubkey),
            accountInfo: splacct_1
        },
        {
            pubkey: new PublicKey(tokenaccnt_2.value[0].pubkey),
            accountInfo: splacct_2
        },
    ]

    const orca = getOrca(connection_1);
    const orcaRaySolPool = orca.getPool(OrcaPoolConfig.STEP_SOL);
    const IN_TOKEN = orcaRaySolPool.getTokenB();
    const OUT_TOKEN = orcaRaySolPool.getTokenA();
    const Amount = new Decimal(0.01);
    const quote = await orcaRaySolPool.getQuote(IN_TOKEN, Amount);
    const outAmount = quote.getMinOutputAmount();

    console.log(`Swap ${Amount.toString()} SOL for at least ${outAmount.toNumber()} STEP`);
    const swapPayload = await orcaRaySolPool.swap(owner, IN_TOKEN, Amount, outAmount);


    const oxytoken = new Token(OXY_MINT_ADDRESS, 6, "OXY", "Oxygen");
    const steptoken = new Token(STEP_MINT_ADDRESS, 9, "STEP", "Step Finance");
    const wsoltoken = new Token(SOL_MINT_ADDRESS, 9, "wSOL", "Wrapped SOL");
    const raytoken = new Token(RAY_MINT_ADDRESS, 6, "RAY", "Raydium");
    const oxytokenamt = new TokenAmount(oxytoken, 1000);
    const raytokenamt = new TokenAmount(raytoken, 1);
    const wsoltokenamt = new TokenAmount(wsoltoken, LAMPORTS_PER_SOL * 0.01);
    //console.log("SAJIOHUBIHDJAKNL: ", LAMPORTS_PER_SOL * outAmount.toNumber())
    const steptokenamt = new TokenAmount(steptoken, LAMPORTS_PER_SOL * outAmount.toNumber());


    // potentially good function to set good amountOut param:
    const infoparams: LiquidityFetchInfoParams = {
        connection: connection_1,
        poolKeys:  routeinfo[0].keys
    }
    
    const info = await Liquidity.fetchInfo(infoparams)
    console.log(info)
    const _pool: AmmSource = {
        poolInfo: info,
        poolKeys: routeinfo[0].keys,
        
    }

    const bestout: GetBestAmountOutParams = {
        pools: [_pool],
        amountIn: steptokenamt,
        currencyOut: wsoltoken,
        slippage: new Fraction(1,10),
    }
    const bestamountout = await Trade.getBestAmountOut(bestout)
    console.log(bestamountout)
    console.log(bestamountout.minAmountOut.denominator.toNumber())

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
        amountIn: steptokenamt,
        amountOut: wsoltokenamt,
        fixedSide: "in" // "buy"
        // config?: {
        // bypassAssociatedCheck?: boolean;
        // };
    }

    const tx = await Trade.makeTradeTransaction(params)
    console.log(tx)

    let signers: Signer[] = [owner, ...swapPayload.signers];


    // send transactions as single transaction
    if (tx.tradeTransaction) {
        const txid = ""
        if (tx.tradeTransaction.transaction.instructions.length > 1)
        {
            const transaction = new Transaction({
                feePayer: owner.publicKey,
              });
            
            transaction.add(...swapPayload.transaction.instructions);
            transaction.add(tx.tradeTransaction.transaction.instructions[1]);
            let txid = await connection_1.sendTransaction(transaction, signers, {
                skipPreflight: true
            })
            try {
                const swapResult: any = await connection_1.confirmTransaction(txid) 
                console.log(swapResult)
            }
            catch (error) {
                console.log(error)
            }
        }
        else {
            const transaction = new Transaction({
                feePayer: owner.publicKey,
              });
            transaction.add(...swapPayload.transaction.instructions);
            transaction.add(...tx.tradeTransaction.transaction.instructions);
            let txid = await connection_1.sendTransaction(transaction, signers, {
                skipPreflight: true
            })
            try {
                const swapResult: any = await connection_1.confirmTransaction(txid) 
                console.log(swapResult)
            }
            catch (error) {
                console.log(error)
            }
        }
    }
}