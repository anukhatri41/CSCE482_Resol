import { Account, Connection, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { Liquidity, LiquidityUserKeys, Market } from '@raydium-io/raydium-sdk'
//import { Market } from '@project-serum/serum';
import { readFile } from "mz/fs";
import { orderTypeLayout } from '@project-serum/serum/lib/layout';

async function main() {
    let connection = new Connection('https://testnet.solana.com');
    let marketAddress = new PublicKey('9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT');
    let programAddress = new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin');
    let market = await Market.load(connection, marketAddress, {}, programAddress);

    const secretKeyString = await readFile("/Users/gtugwell/.config/solana/id.json", {
        encoding: "utf8",
    });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));

    // Placing orders
    let owner = new Account(secretKey);
    let payer = new PublicKey('So11111111111111111111111111111111111111112'); // spl-token account

    const SOL_USDC_PoolKeys = {
      id: new PublicKey("3gSjs6MqyHFsp8DXvaKvVUJjV7qg5itf9qmUGuhnSaWH"),
      baseMint: new PublicKey("So11111111111111111111111111111111111111112"),
      quoteMint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
      lpMint: new PublicKey("FxQssQdmSQXM6bCKdK8u6wypwJhUEWYoSZ1qRSDUHkdg"),
      version: 4,
      programId: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
      authority: new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),
      openOrders: new PublicKey("GgiB7nWxJBTaLorLzn5CVDtbbuDRYwKoVdrSbBjeUQS1"),
      targetOrders: new PublicKey("3HXoEhRnJRi1jk53XX5dUfYYZLUjgaBQZnRf3TZ5RNsB"),
      baseVault: new PublicKey("9PpceUYfvUmKazYqWjqiU8nXqJzMPRwMrPYNFnnp59LG"),
      quoteVault: new PublicKey("FtTZAjh8hP7PK5iH3FEBVAxoWMZr9ED41UqLAvFPy69H"),
      withdrawQueue: new PublicKey("4TA5dnZ9B8yeZGQrA4By11vuzBKDa7N8aMeDtmXB8v2N"),
      lpVault: new PublicKey("6o9qojU8behPdHXg7erigmyvDgnCpxRS1zMiirCAJsH1"),
      marketVersion: 3,
      marketProgramId: new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"),
      marketId: new PublicKey("9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"),
      marketAuthority: new PublicKey("F8Vyqk3unwxkXukZFQeYyGmFfTG3CAX4v24iyrjEYBJV"),
      marketBaseVault: new PublicKey("36c6YqAwyGKQG66XEp2dJc5JqjaBNv7sVghEtJv4c7u6"),
      marketQuoteVault: new PublicKey("8CFo8bL8mZQK8abbFyypFMwEDd8tVJjHTTojMLgQTUSZ"),
      marketBids: new PublicKey("14ivtgssEBoBjuZJtSAPKYgpUK7DmnSwuPMqJoVTSgKJ"),
      marketAsks: new PublicKey("CEQdAFKdycHugujQg9k2wbmxjcpdYZyVLfV9WerTnafJ"),
      marketEventQueue: new PublicKey("5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht")
    }

    const our_userKeys = {
        baseTokenAccount: new PublicKey("So11111111111111111111111111111111111111112"),
        quoteTokenAccount: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
        lpTokenAccount: new PublicKey("FxQssQdmSQXM6bCKdK8u6wypwJhUEWYoSZ1qRSDUHkdg"),
        owner: owner.publicKey,
    }

    const transactionInstruction = await Liquidity.makeSwapTransaction({
        connection,
        poolKeys: SOL_USDC_PoolKeys,
        userKeys: {
            tokenAccounts: [
                our_userKeys.baseTokenAccount,
                our_userKeys.quoteTokenAccount
            ],
            owner: owner.publicKey,
        },
        amountIn,
        amountOut,
        fixedSide
    });

    const signature: string = await sendAndConfirmTransaction(connection, transactionInstruction.transaction, transactionInstruction.signers);
    console.log("tx: ", signature);
}

main().catch(console.error);