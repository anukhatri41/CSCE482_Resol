import * as web3 from '@solana/web3.js';
import base58 from 'bs58';
import * as borsh from 'borsh';
import * as serum from '@project-serum/serum';
import * as ray from '@raydium-io/raydium-sdk';
import SerumSource, { SOL, TokenAccount } from '@raydium-io/raydium-sdk';

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

(async () => {
    // Establishing Market Connect
    console.log("Connecting to cluster: ", ChosenCluster)
    let connection = new web3.Connection(ChosenCluster, 'confirmed');
    let marketAddress = new web3.PublicKey(details.RAYDIUM_SOL_USDC);
    let programAddress = new web3.PublicKey(details.SERUM_PROGRAM_ID);

    // Using Raydium methods to create publicKey data.
    //let programPubkey = ray.publicKey(details.SERUM_PROGRAM_ID);
    //let marketPubkey = ray.publicKey(details.RAYDIUM_SOL_USDC);

    // let market = new ray.Market();
    // market = await ray.Market.getAssociatedAuthority({
    //     programId: programAddress,
    //     marketId: marketAddress
    // });
    console.log("Market Connecting to: ", market);
    //let market = await Market.load(connection, marketAddress, {}, programAddress);
    console.log("Connected...");

    // Establishing connection, generating necessary Keypair info
	//const connection = new web3.Connection(ChosenCluster, 'confirmed');
	const keypair = web3.Keypair.fromSecretKey(base58.decode(details.secret));

    let RouteInfo = ["amm", "serum", "route"];
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
    const keys = [
        { pubkey: marketAddress, isSigner: false, isWritable: true },
        { pubkey: openOrders, isSigner: false, isWritable: true },
        { pubkey: requestQueue, isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: baseVault, isSigner: false, isWritable: true },
        { pubkey: quoteVault, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
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