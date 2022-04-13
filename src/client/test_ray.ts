import { 
    Trade, 
    TradeTransactionParams, 
    RouteInfo, 
    TokenAccount, 
    SplAccount,
    TokenAmount,
    GetBestAmountOutParams,
    Token,
    Fraction,
    AmmSource,
    LiquidityFetchInfoParams,
    Liquidity 
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
    Transaction,
    sendAndConfirmTransaction
   } from "@solana/web3.js";

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
import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";
import Decimal from "decimal.js";

const WALLET_PRIVATE_KEY = details.secret
const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
const owner = Keypair.fromSecretKey(USER_PRIVATE_KEY);

const mainnet = 'https://api.mainnet-beta.solana.com';
const RPC = details._RPC;
const connection_1 = new Connection(mainnet);

const OXY_MINT_ADDRESS = "z3dn17yLaGMKffVogeFHQ9zWVcXgqgf3PQnDsNs2g6M"
const RAY_MINT_ADDRESS = "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"


const RaydiumOrcaAtomicSwap = async() => {

    // construct raydium swap transaction

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


    // const taf: TokenAccountsFilter = {
    //     programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    // }

    const tokenaccountfilter_ray: TokenAccountsFilter = {
        mint: new PublicKey(RAY_MINT_ADDRESS),
    }
    const tokenaccountfilter_oxy: TokenAccountsFilter = {
        mint: new PublicKey(OXY_MINT_ADDRESS),
    }
    
    // const prgmacct = await connection_1.getParsedTokenAccountsByOwner(new PublicKey("2Nocd3ihAoAzNuvnVKAn9NHU6ieeDiv3eWMAQUHXiUmY"), taf)
    const tokenaccount_oxy = await connection_1.getParsedTokenAccountsByOwner(owner.publicKey, tokenaccountfilter_oxy)
    const tokenaccount_ray = await connection_1.getParsedTokenAccountsByOwner(owner.publicKey, tokenaccountfilter_ray)
    // const acctInfo = await connection_1.getParsedAccountInfo(new PublicKey(""))
    const ata_oxy = await spltoken.getOrCreateAssociatedTokenAccount(connection_1, owner, new PublicKey(OXY_MINT_ADDRESS), owner.publicKey)
    const ata_ray = await spltoken.getOrCreateAssociatedTokenAccount(connection_1, owner, new PublicKey(RAY_MINT_ADDRESS), owner.publicKey)

    const splacct: SplAccount = {
        owner: ata_oxy.owner,
        state: tokenaccount_oxy.value[0].account.data.parsed.info.state,
        mint: ata_oxy.mint,
        amount: tokenaccount_oxy.value[0].account.data.parsed.info.tokenAmount.amount,
        delegateOption: 0,
        delegate: ata_oxy.delegate,
        isNativeOption: tokenaccount_oxy.value[0].account.data.parsed.info.isNative,
        isNative: tokenaccount_oxy.value[0].account.data.parsed.info.isNative,
        delegatedAmount: new bn.BN(0),
        closeAuthorityOption: 0,
        closeAuthority: ata_oxy.closeAuthority
    }
    const splacct_ray: SplAccount = {
        owner: ata_ray.owner,
        state: tokenaccount_ray.value[0].account.data.parsed.info.state,
        mint: ata_ray.mint,
        amount: tokenaccount_ray.value[0].account.data.parsed.info.tokenAmount.amount,
        delegateOption: 0,
        delegate: ata_ray.delegate,
        isNativeOption: tokenaccount_ray.value[0].account.data.parsed.info.isNative,
        isNative: tokenaccount_ray.value[0].account.data.parsed.info.isNative,
        delegatedAmount: new bn.BN(0),
        closeAuthorityOption: 0,
        closeAuthority: ata_ray.closeAuthority
    }
    const tokenaccts: TokenAccount[] = [
        {
            pubkey: new PublicKey(tokenaccount_oxy.value[0].pubkey),
            accountInfo: splacct
        },
        {
            pubkey: new PublicKey(tokenaccount_oxy.value[0].pubkey),
            accountInfo: splacct_ray
        },
    ]

    const oxytoken = new Token(OXY_MINT_ADDRESS, 6, "OXY", "Oxygen")
    const raytoken = new Token(RAY_MINT_ADDRESS, 6, "RAY", "Raydium")
    const oxytokenamt = new TokenAmount(oxytoken, 100000)
    const raytokenamt = new TokenAmount(raytoken, 1)

    // potentially good function to set good amountOut param:
    // const infoparams: LiquidityFetchInfoParams = {
    //     connection: connection_1,
    //     poolKeys:  routeinfo[0].keys
    // }
    
    // const info = await Liquidity.fetchInfo(infoparams)
    // console.log(info)
    // const oxy_ray_pool: AmmSource = {
    //     poolInfo: info,
    //     poolKeys: routeinfo[0].keys,
        
    // }

    // const bestout: GetBestAmountOutParams = {
    //     pools: [oxy_ray_pool],
    //     amountIn: oxytokenamt,
    //     currencyOut: raytoken,
    //     slippage: new Fraction(1,1000)
    // }
    // const bestamountout = await Trade.getBestAmountOut(bestout)
    // console.log(bestamountout)
    // console.log(bestamountout.minAmountOut.denominator.toNumber())


    // const amtout = await Liquidity.computeAmountOut({
    //     poolKeys: routeinfo[0].keys,
    //     poolInfo: info,
    //     amountIn: oxytokenamt,
    //     currencyOut: raytoken,
    //     slippage: new Fraction(1,1),
    //   });
    
    //   console.log(amtout)

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
        fixedSide: "in" // "buy"
        // config?: {
        // bypassAssociatedCheck?: boolean;
        // };
    }

    const tx = await Trade.makeTradeTransaction(params)
    console.log(tx)
    

    // constuct Orca swap transaction

    const orca = getOrca(connection_1);
    const orcaRaySolPool = orca.getPool(OrcaPoolConfig.RAY_SOL);
    const IN_TOKEN = orcaRaySolPool.getTokenA();
    const OUT_TOKEN = orcaRaySolPool.getTokenB();
    const Amount = new Decimal(0.0001);
    const quote = await orcaRaySolPool.getQuote(IN_TOKEN, Amount);
    const outAmount = quote.getMinOutputAmount();

    console.log(`Swap ${Amount.toString()} RAY for at least ${outAmount.toNumber()} SOL`);
    const swapPayload = await orcaRaySolPool.swap(owner, IN_TOKEN, Amount, outAmount);

    // for (let i in swapPayload.transaction.instructions) {
    //     console.log(swapPayload.transaction.instructions[i].programId.toString());
    // }
    
    // for (let i in swapPayload.signers)
    // {
    //     console.log(swapPayload.signers[i].publicKey.toString())
    // }
    
    let signers: Signer[] = [owner, swapPayload.signers[1]];


    // send transactions as single transaction
    if (tx.tradeTransaction) {
        const txid = ""
        if (tx.tradeTransaction.transaction.instructions.length > 1)
        {
            const transaction = new Transaction({
                feePayer: owner.publicKey,
              });
            transaction.add(tx.tradeTransaction.transaction.instructions[1])
            transaction.add(swapPayload.transaction.instructions[3])
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
            transaction.add(...tx.tradeTransaction.transaction.instructions)
            transaction.add(swapPayload.transaction.instructions[3])
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







const main = async () => {
    
    await RaydiumOrcaAtomicSwap();
  
    };
      main()
        .then(() => {
    
          console.log("Done");
        })
        .catch((e) => {
          console.error(e);
        });