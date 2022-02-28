import * as web3 from '@solana/web3.js';
import {
    Account,
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import base58 from 'bs58';
import * as borsh from 'borsh';
import { Market } from '@project-serum/serum';

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
//const reciever = new web3.PublicKey(details.RAYDIUM_SOL_USDC);
const devnet = 'https://api.devnet.solana.com';
const mainnet = 'https://api.mainnet-beta.solana.com';

// Creating program ID object
const programId = new web3.PublicKey(details.SERUM_PROGRAM_ID);

// Choosing with cluster to use.
const ChosenCluster = mainnet;
const amount = 0.01;

(async () => {
    // Establishing Market Connect
    console.log("Connecting to cluster: ", ChosenCluster)
    let connection = new Connection(ChosenCluster);
    let marketAddress = new PublicKey(details.RAYDIUM_SOL_USDC);
    let programAddress = new PublicKey(details.SERUM_PROGRAM_ID);
    let market = await Market.load(connection, marketAddress, {}, programAddress);
    console.log("Connected...")

    // Establishing connection, generating necessary Keypair info
	//const connection = new web3.Connection(ChosenCluster, 'confirmed');
	const keypair = web3.Keypair.fromSecretKey(base58.decode(details.secret));
    // Fetching orderbooks
    let bids = await market.loadBids(connection);
    let asks = await market.loadAsks(connection);
    // L2 orderbook data
    for (let [price, size] of bids.getL2(20)) {
    console.log(price, size);
    }
    // Full orderbook data
    for (let order of asks) {
    console.log(
        order.orderId,
        order.price,
        order.size,
        order.side, // 'buy' or 'sell'
    );
    }

    let account = new Account(sender.publicKey);
    let owner = sender; //new Keypair(sender.publicKey);
    let payer = new PublicKey('...'); // spl-token account
    await market.placeOrder(connection, {
    owner,
    payer,
    side: 'buy', // 'buy' or 'sell'
    price: 123.45,
    size: 17.0,
    orderType: 'limit', // 'limit', 'ioc', 'postOnly'
    });

	// Creating transaction
	// console.log("Creating Transaction:");
    // console.log("From: ", sender.publicKey.toString())
	// console.log("To: ", reciever.toString());
    // console.log("Amount Sent: %d SOL", amount)
	// Transaction Code
    // const transaction = new Transaction().add(
    //     SystemProgram.transfer({
    //       fromPubkey: sender.publicKey,
    //       lamports: (LAMPORTS_PER_SOL / 100) * amount,
    //       toPubkey: reciever 
    //     }),
    //   );
    // class GreetingAccount {
    //     txt: String = '';
    //     constructor(fields: {txt: string} | undefined = undefined) {
    //       if (fields) {
    //         this.txt = fields.txt;
    //       }
    //     }
    //   }

    // const GreetingSchema = new Map([
    //     [GreetingAccount, {kind: 'struct', fields: [['txt', 'String']]}],
    //   ]);

    // const instruction = new TransactionInstruction({
    //     keys: [{pubkey: sender.publicKey, isSigner: false, isWritable: true}],
    //     programId,
    //     data: Buffer.from(borsh.serialize(GreetingSchema,''))//Buffer.from(borsh.serialize(GreetingSchema, messageAccount)), // All instructions are hellos
    // });
    // const signature: string = await sendAndConfirmTransaction(
    //     connection,
    //     new Transaction().add(instruction),
    //     [sender],
    // );
    //   console.log("tx: ", signature);
})();