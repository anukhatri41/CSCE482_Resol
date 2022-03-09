// import * as web3 from '@solana/web3.js';
// import base58 from 'bs58';
// import * as borsh from 'borsh';
// import * as serum from '@project-serum/serum';
// import * as ray from '@raydium-io/raydium-sdk';
// import { readFile } from "mz/fs";

// // Fetching credentials from .env
// require('dotenv').config()
// const details = {
//     secret: process.env.SENDER_SECRET as string,
// 	  reciever: process.env.DEFAULT_RECEIVER_PUBKEY as string,
//     RAYDIUM_SOL_USDC: process.env.SOL_USDC_RAYDIUM_ADDRESS as string,
//     SERUM_PROGRAM_ID: process.env.SERUM_PROGRAM_ID as string
// };

// const main = async () => {

//     const secretKeyString = await readFile("/Users/gtugwell/.config/solana/id.json", {
//         encoding: "utf8",
//     });
//     const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
//     const owner = web3.Keypair.fromSecretKey(secretKey);

//     const devnet = 'https://api.devnet.solana.com';
//     const mainnet = 'https://api.mainnet-beta.solana.com';
//     const serumAPI = 'https://solana-api.projectserum.com';

//     const connection = new web3.Connection(mainnet, "singleGossip");

    
//     const swapInstr = ray.Liquidity.makeSwapInstruction();

//     const signature: string = await web3.sendAndConfirmTransaction(connection, swapInstr.transaction, swapInstr.signers);
//     console.log("tx: ", signature);

//     try {

//     } catch (err) {
//         console.log(err);
//     }

// };

// main()
//   .then(() => {
//     console.log("Done");
//   })
//   .catch((e) => {
//     console.error(e);
//   });

// LP for SOL_USDC
//     "id": "3gSjs6MqyHFsp8DXvaKvVUJjV7qg5itf9qmUGuhnSaWH",
//     "baseMint": "So11111111111111111111111111111111111111112",
//     "quoteMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//     "lpMint": "FxQssQdmSQXM6bCKdK8u6wypwJhUEWYoSZ1qRSDUHkdg",
//     "version": 4,
//     "programId": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
//     "authority": "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
//     "openOrders": "GgiB7nWxJBTaLorLzn5CVDtbbuDRYwKoVdrSbBjeUQS1",
//     "targetOrders": "3HXoEhRnJRi1jk53XX5dUfYYZLUjgaBQZnRf3TZ5RNsB",
//     "baseVault": "9PpceUYfvUmKazYqWjqiU8nXqJzMPRwMrPYNFnnp59LG",
//     "quoteVault": "FtTZAjh8hP7PK5iH3FEBVAxoWMZr9ED41UqLAvFPy69H",
//     "withdrawQueue": "4TA5dnZ9B8yeZGQrA4By11vuzBKDa7N8aMeDtmXB8v2N",
//     "lpVault": "6o9qojU8behPdHXg7erigmyvDgnCpxRS1zMiirCAJsH1",
//     "marketVersion": 3,
//     "marketProgramId": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
//     "marketId": "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT",
//     "marketAuthority": "F8Vyqk3unwxkXukZFQeYyGmFfTG3CAX4v24iyrjEYBJV",
//     "marketBaseVault": "36c6YqAwyGKQG66XEp2dJc5JqjaBNv7sVghEtJv4c7u6",
//     "marketQuoteVault": "8CFo8bL8mZQK8abbFyypFMwEDd8tVJjHTTojMLgQTUSZ",
//     "marketBids": "14ivtgssEBoBjuZJtSAPKYgpUK7DmnSwuPMqJoVTSgKJ",
//     "marketAsks": "CEQdAFKdycHugujQg9k2wbmxjcpdYZyVLfV9WerTnafJ",
//     "marketEventQueue": "5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht"

// const anchor = require('@project-serum/anchor');
// const Provider = anchor.Provider;
// const Wallet = anchor.Wallet;
// const BN = anchor.BN;
const Connection = require('@solana/web3.js').Connection;
const PublicKey = require('@solana/web3.js').PublicKey;
const TokenListProvider = require('@solana/spl-token-registry')
  .TokenListProvider;
import * as swap from '@project-serum/swap';
import * as anchor from '@project-serum/anchor';
import * as ser from '@project-serum/serum'
import {
  Account
} from '@solana/web3.js'
import { readFile } from "mz/fs";
// const Swap = require('..').Swap;

// Mainnet beta addresses.
const SRM = new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt');
const USDC = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const USDT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');
const WBTC = new PublicKey('9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E');
const SOL = new PublicKey('So11111111111111111111111111111111111111112');
const DECIMALS = 6;

async function main() {
  // Client for sending transactions to the swap program on mainnet.
  const provider = new anchor.Provider(
    new Connection('https://api.mainnet-beta.solana.com', 'recent'),
			anchor.Wallet.local(),
			anchor.Provider.defaultOptions(),
  );
  const tokenList = await new TokenListProvider().resolve();
  const client = new swap.Swap(provider, tokenList)

  const secretKeyString = await readFile("/Users/gtugwell/.config/solana/id.json", {
            encoding: "utf8",
        });
        const secretKey = Uint8Array.from(JSON.parse(secretKeyString));

  const account = new Account(secretKey);

  console.log(account);


  // All tokens available for swapping.
  //const _tokens = client.tokens();
  //const _tokens = await new TokenListProvider().resolve();

  // All tokens available for swapping with SRM.
  //const _srmSwapPairs = client.pairs(SOL);

  // console.log()
  // console.log(_srmSwapPairs);

  // Estimate the amount received by swapping from SOL -> USDC.
  // const estimatedUsdc = await client.({
  //   fromMint: SOL,
  //   toMint: USDC,
  //   amount: toNative(0.01),
  // });
  // FINDING ROUTE FROM SOL -> USDC
  const route = await client.route(SOL, USDC);

  // const estimatedBtc = await client.estimate({
  //   fromMint: SRM,
  //   toMint: WBTC,
  //   amount: toNative(1),
  // });
	console.log('Route?: ', route);
  
  // const transactionData = client.swapTxs({
  //   fromMint: SOL,
  //   toMint: USDC,
  //   amount: toNative(0.01),
  //   minExchangeRate: anchor.,
  //   fromMarket: ,
  // });

  // Swaps SRM -> USDC on the Serum orderbook. If the resulting USDC is
  // has greater than a 1% error from the estimate, then fails.
  // const usdcSwapTx = await client.swap({
  //   // fromMint: SOL,
  //   // toMint: USDC,
  //   // amount: toNative(0.01),
  //   // //sminExpectedSwapAmount: estimatedUsdc.mul(new anchor.BN(99)).div(new anchor.BN(100)),
  //   // minExchangeRate: ,
  //   fromMint: SOL,
  //   toMint: USDC,
  //   amount: toNative(0.01),
  //   minExchangeRate: ,
  //   fromMarket: ,
  // });
  // Uses the default minExpectedSwapAmount calculation.
  // const usdcSwapTxDefault = await client.swap({
  //   fromMint: SRM,
  //   toMint: USDC,
  //   amount: toNative(1),
  // });
  // // Transitive swap from SRM -> USDC -> BTC.
  // const btcSwapTx = await client.swap({
  //   fromMint: SRM,
  //   toMint: WBTC,
  //   amount: toNative(1),
  // });
  //console.log('resp', fromNative(estimatedUsdc));
  //console.log('resp', fromNative(estimatedBtc));
  //console.log('resp', usdcSwapTx);
  // console.log('resp', usdcSwapTxDefault);
  // console.log('resp', btcSwapTx);

}

async function swapClient() {
  const provider = new anchor.Provider(
    new Connection('https://api.mainnet-beta.solana.com', 'recent'),
			anchor.Wallet.local(),
			anchor.Provider.defaultOptions(),
  );
  const tokenList = await new TokenListProvider().resolve();
  //const client = new swap.Swap(provider, tokenList)
  return new swap.Swap(provider, tokenList);
}

// Converts the given number to native units (i.e. with decimals).
// The mints used in this example all have 6 decimals. One should dynamically
// fetch decimals for the tokens they are swapping in production.
function toNative(amount: any) {
  return new anchor.BN(amount * 10 ** DECIMALS);
}

function fromNative(amount: any) {
  return amount.toNumber() / 10 ** DECIMALS;
}

main().catch(console.error);

