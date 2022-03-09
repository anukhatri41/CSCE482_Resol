import { Connection, PublicKey, AccountInfo, LAMPORTS_PER_SOL} from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import { getOrca, OrcaPoolConfig } from '@orca-so/sdk';
// import { PerpMarket, sleep } from '@blockworks-foundation/mango-client';
// import { Trade } from '@raydium-io/raydium-sdk'
import Decimal from "decimal.js";

// import * as os from 'os';
// import * as fs from 'fs';
import {
  Config,
  getMarketByBaseSymbolAndKind,
  GroupConfig,
  MangoClient,
} from '@blockworks-foundation/mango-client';
import {Commitment } from '@solana/web3.js';
// import { group } from 'console';
const configFile = require('./ids.json');
// import { Market } from '@project-serum/serum';


export async function SerumOrders(connection: Connection) {
    require('dotenv').config()
    const details = {
        secret: process.env.SENDER_SECRET as string,
        reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
        RAYDIUM_SOL_USDC: process.env.SOL_USDC_RAYDIUM_ADDRESS as string,
        SERUM_PROGRAM_ID: process.env.SERUM_PROGRAM_ID as string
    };
    try {
        let marketAddress = new PublicKey("9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT");
        let programAddress = new PublicKey(details.SERUM_PROGRAM_ID);
        let market = await Market.load(connection, marketAddress, {}, programAddress);
        // Fetching orderbooks
        let bids = await market.loadBids(connection);
        let asks = await market.loadAsks(connection);
        // L2 orderbook data
        for (let [price, size] of bids.getL2(50)) {
        // console.log(price, size);
            return price
        }
        // Full orderbook data
        // for (let order of asks) {
        //     console.log(
        //         order.orderId,
        //         order.price,
        //         order.size,
        //         order.side, // 'buy' or 'sell'
        //     );
        // }
        
    }
    catch (error) {
        console.log(error)
    }
}

async function RaydiumPrice() {

    const devnet = 'https://api.devnet.solana.com';
    const mainnet = 'https://api.mainnet-beta.solana.com';
    const serumAPI = 'https://solana-api.projectserum.com';

    require('dotenv').config()
    const details = {
        secret: process.env.SENDER_SECRET as string,
        reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
        RAYDIUM_SOL_USDC: process.env.SOL_USDC_RAYDIUM_ADDRESS as string,
        SERUM_PROGRAM_ID: process.env.SERUM_PROGRAM_ID as string
    };
    let connection = new Connection(mainnet);

    //raydium sol-usdc
    let marketAddress = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8");
    let programAddress = new PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2");

    // const resp = Trade.getBestAmountOut

}

export async function OrcaOrders(connection: Connection) { 
    let orca = getOrca(connection);
    let orcaPool = orca.getPool(OrcaPoolConfig.SOL_USDC);
    const solToken = orcaPool.getTokenA();
    const solAmount = new Decimal(1);
    const quote = await orcaPool.getQuote(solToken, solAmount);
    const amt = quote.getRate().toNumber();

    // const fee = quote.getLPFees().toNumber()
    // const fee1 = quote.getNetworkFees().toNumber() / LAMPORTS_PER_SOL
    // const qut = amt + fee
    // console.log(amt)
    // console.log(fee)
    // console.log(fee1 + fee + amt)

    return amt;
}

export async function MangoOrdersSpot() {
    try {
    // setup client
    const config = new Config(configFile);
    const groupConfig = config.getGroup(
      'mainnet',
      'mainnet.1',
    ) as GroupConfig;

    const connection = new Connection(
      'https://api.mainnet-beta.solana.com',
      'processed' as Commitment,
    );
    const client = new MangoClient(connection, groupConfig.mangoProgramId);
  
    // load group & market
    const spotMarketConfig = getMarketByBaseSymbolAndKind(
      groupConfig,
      'SOL',
      'spot',
    );
    const mangoGroup = await client.getMangoGroup(groupConfig.publicKey);
    const spotMarket = await Market.load(
      connection,
      spotMarketConfig.publicKey,
      undefined,
      groupConfig.serumProgramId,
    );
  
    // Fetch orderbooks
    let bids = await spotMarket.loadBids(connection);
    let asks = await spotMarket.loadAsks(connection);
        
    // console.log('bids',bids.getL2(1))
    // console.log('asks',asks)
    // L2 orderbook data
    for (const [price, size] of bids.getL2(20)) {
    //   console.log(price, size);
    //   return price;
    }
  
    // L3 orderbook data
    for (const order of asks) {
    //   console.log(
    //     order.openOrdersAddress.toBase58(),
    //     order.orderId.toString('hex'),
    //     order.price,
    //     order.size,
    //     order.side, // 'buy' or 'sell'
    //   );
      return order.price
    }
    }
    catch (error) {
        console.log(error)
    }
}


export async function getPrices() {
    const mainnet = 'https://api.mainnet-beta.solana.com';

    require('dotenv').config()
    const details = {
        secret: process.env.SENDER_SECRET as string,
        reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
        RAYDIUM_SOL_USDC: process.env.SOL_USDC_RAYDIUM_ADDRESS as string,
        SERUM_PROGRAM_ID: process.env.SERUM_PROGRAM_ID as string
    };
    
    let connection = new Connection(mainnet);
    let responseOrca = OrcaOrders(connection)
    let responseSerum = SerumOrders(connection)
    let responseMango = MangoOrdersSpot()

    let orcaPrice = 0;
    let serumPrice = 0;
    responseOrca.then(function(result) {
        console.log("orca: SOL/USDC")
        console.log(result)
        if (result)
        {
            orcaPrice = result;
        }
    
        responseSerum.then(function(result) {
            console.log("serum: SOL/USDC")
            console.log(result)
            if (result)
            {
                serumPrice = result;
            }
    
            if (serumPrice - orcaPrice > 0.05) {
                // assuming we start with SOL...
                // sol is more expensive on serum
                console.log("buy orca USDC with SOL, sell serum USDC for SOL")
            }
            else if (orcaPrice - serumPrice > 0.05) {
                console.log("buy serum USDC with SOL, sell orca USDC for SOL")
            }
            else {
                console.log("no profit found")
            }
            // console.log(1/serumPrice)
        })
    })


    responseMango.then(function(result) {
        console.log("mango: SOL/USDC")
        console.log(result)
    })
}

getPrices()