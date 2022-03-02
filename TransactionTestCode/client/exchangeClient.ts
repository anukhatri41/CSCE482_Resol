import * as web3 from '@solana/web3.js';
import base58 from 'bs58';
import * as borsh from 'borsh';
import * as serum from '@project-serum/serum';
import * as ray from '@raydium-io/raydium-sdk';
import SerumSource, { SOL, TokenAccount } from '@raydium-io/raydium-sdk';
// import {
//     encodeInstruction
// } from '@project-serum/serum';
const { AMM_INFO_LAYOUT_V4, ACCOUNT_LAYOUT, MARKET_STATE_LAYOUT_V3 } = require('./ray_layouts');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token')
const sleep = require('./sleep');

// Fetching credentials from .env
require('dotenv').config()
const details = {
    secret: process.env.SENDER_SECRET as string,
	reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
    RAYDIUM_SOL_USDC: process.env.SOL_USDC_RAYDIUM_ADDRESS as string,
    SERUM_PROGRAM_ID: process.env.SERUM_PROGRAM_ID as string
};

// Creating Keypair object from secret key & reciever pubkey in .env
const sender = web3.Keypair.fromSecretKey(base58.decode(details.secret))
//const owner = sender;
//const reciever = new web3.PublicKey(details.RAYDIUM_SOL_USDC);
const devnet = 'https://api.devnet.solana.com';
const mainnet = 'https://api.mainnet-beta.solana.com';
const serumAPI = 'https://solana-api.projectserum.com';

// Creating program ID object
const programId = new web3.PublicKey(details.SERUM_PROGRAM_ID);

// Choosing with cluster to use.
// For the market we set up, this MUST be running on mainnet; Raydium does not have a market set up on devnet
const ChosenCluster = mainnet;
const amount = 0.01;
const USDC_DECIMALS = 6;

(async () => {
    // Establishing Market Connect
    console.log("Connecting to cluster: ", ChosenCluster)
    let connection = new web3.Connection(ChosenCluster, 'confirmed');
    let marketAddress = new web3.PublicKey(details.RAYDIUM_SOL_USDC);
    let programAddress = new web3.PublicKey(details.SERUM_PROGRAM_ID);
    const { owner, data } = await connection.getAccountInfo(marketAddress);

    const decoded = serum.Market.getLayout(programId).decode(data);
    const market = new serum.Market(decoded, 9, USDC_DECIMALS, {}, programId); // 9 is the amount of decimals
    console.log("Market Connecting to: ", marketAddress);
    console.log("Connected...");

    // Establishing connection, generating necessary Keypair info
	//const connection = new web3.Connection(ChosenCluster, 'confirmed');
	const keypair = web3.Keypair.fromSecretKey(base58.decode(details.secret));

    // let RouteInfo = ["amm", "serum", "route"];
    console.log("Established Route Info");
    // let solToken = new ray.Token('So11111111111111111111111111111111111111112', 1);
    // let solTokenAmount = await new ray.TokenAmount(solToken, 1);
    console.log("Established sol");
    //let sol = ray.Token.SOL;
    let per = new ray.Percent(1,2);
    console.log("Declared per");
    // console.log("POOL INFO", ray.MAINNET_OFFICIAL_LIQUIDITY_POOLS)
    // //let amm = ray.AmmSource ()
    // Code works up to here...
    
    console.log("Creating serum source");
    const ammInfoRes = await connection.getAccountInfo(new web3.PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"));
    await sleep();
    const ammInfo = MARKET_STATE_LAYOUT_V3.decode(ammInfoRes.data);
    const { serumProgramId } = ammInfo;
    const publicKeys = [
        ammInfo.poolCoinTokenAccount,
        ammInfo.poolPcTokenAccount,
        ammInfo.ammOpenOrders,
    ];
    const [
        poolCoinTokenAccountRes,
        poolPcTokenAccountRes,
        ammOpenOrdersRes,
    ] = await connection.getMultipleAccountsInfo(publicKeys);
    const poolCoinTokenAccount = ACCOUNT_LAYOUT.decode(poolCoinTokenAccountRes.data);
    const poolPcTokenAccount = ACCOUNT_LAYOUT.decode(poolPcTokenAccountRes.data);
    let rentSysvar = new web3.PublicKey(
        'SysvarRent111111111111111111111111111111111',
      );

    // const ammOpenOrders = OpenOrders.getLayout(serumProgramId).decode(ammOpenOrdersRes.data);
    // const { baseTokenTotal, quoteTokenTotal } = ammOpenOrders;
    // coinAmountWei.plus(new BigNumber(baseTokenTotal.toString()));
    // pcAmountWei.plus(new BigNumber(quoteTokenTotal.toString()));

    const keys = [
        { pubkey: marketAddress, isSigner: false, isWritable: true },
        { pubkey: ammInfo.ammOpenOrders, isSigner: false, isWritable: true },
        { pubkey: null, isSigner: false, isWritable: true }, // previously was requestQueue instead of null
        { pubkey: sender, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: ammInfo.baseVault, isSigner: false, isWritable: true },
        { pubkey: ammInfo.quoteVault, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: web3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ];

    const instruction = new web3.TransactionInstruction({
        keys,
        programId,
        data: encodeInstruction({
          newOrder: clientId
            ? { side, limitPrice, maxQuantity, orderType, clientId }
            : { side, limitPrice, maxQuantity, orderType },
        }),
    });
    const signature: string = await web3.sendAndConfirmTransaction(
        connection,
        new web3.Transaction().add(instruction),
        [sender],
    );
      console.log("tx: ", signature);

    // ray.Trade.getBestAmountIn({
    //     pools: ray.MAINNET_OFFICIAL_LIQUIDITY_POOLS[0], 
    //     amountOut: solTokenAmount,
    //     currencyIn: ray.Token.SOL,
    //     slippage: per
    //     markets: market,
    //     amountOut: sol, // Maybe SOL as well???
    //     currencyIn: ray.Token.SOL, // SOL
    //     slippage: per // 50% slippage?
    // });

    // let solTokenAccount:TokenAccount[];
    // solTokenAccount.push(solTokenAmount);

    // ray.Trade.makeTradeTransaction({
    //     connection: connection,
    //     routes: RouteInfo[0],
    //     routeType: RouteType,
    //     userKeys: {
    //         tokenAccounts: solTokenAccount,
    //         owner: sender.publicKey
    //     },
    //     amountIn: solTokenAmount,
    //     amountOut: solTokenAmount,
    //     fixedSide: "in"
    // });

    // let buy = new Trade();
    // buy = ray.Trade.makeTradeTransaction({
    //     connection,
    //     routes: RouteInfo[],
    //     routeType: RouteType,
    //     userKeys: {
    //       tokenAccounts: TokenAccount[],
    //       owner: PublicKey,
    //       payer?: PublicKey,
    //     },
    //     amountIn: CurrencyAmount | TokenAmount,
    //     amountOut: CurrencyAmount | TokenAmount,
    //     fixedSide: SwapSide,
    //     config?: {
    //       bypassAssociatedCheck?: boolean,
    //     }
    // );
})();