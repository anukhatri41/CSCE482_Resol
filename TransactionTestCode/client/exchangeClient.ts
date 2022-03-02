import * as web3 from '@solana/web3.js';
import base58 from 'bs58';
import * as borsh from 'borsh';
import * as serum from '@project-serum/serum';
import * as ray from '@raydium-io/raydium-sdk';

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
    let connection = new web3.Connection(ChosenCluster);
    let marketAddressPub = new web3.PublicKey(details.RAYDIUM_SOL_USDC);
    let programAddressPub = new web3.PublicKey(details.SERUM_PROGRAM_ID);

    let programPubkey = ray.publicKey;


    let market = new ray.Market();
    market = ray.Market.getAssociatedAuthority({
        programAddress: programPubkey,
        marketAddress
    });
    //let market = await Market.load(connection, marketAddress, {}, programAddress);
    console.log("Connected...")

    // Establishing connection, generating necessary Keypair info
	//const connection = new web3.Connection(ChosenCluster, 'confirmed');
	const keypair = web3.Keypair.fromSecretKey(base58.decode(details.secret));

    let RouteInfo = ["amm", "serum", "route"];
    let sol = new ray.CurrencyAmount(SOL, 1);
    let per = new ray.Percent(1,2);
    ray.Trade.getBestAmountIn({ 
        market: marketAddress,
        amountOut: sol, // Maybe SOL as well???
        currencyIn: ray.Token.SOL, // SOL
        slippage: per // 50% slippage?
    });

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