const { Market, OpenOrders } = require('@project-serum/serum');
const { Connection, PublicKey } = require('@solana/web3.js');
// const logger = require('../../logger');
const throwIfNull = require('./throwIfNull');
const markets = require('./markets.json');

// const { OpenOrders } = require('@project-serum/serum');
const BigNumber = require('bignumber.js');
const { AMM_INFO_LAYOUT_V4, ACCOUNT_LAYOUT, MARKET_STATE_LAYOUT_V2 } = require('./ray_layouts');
const sleep = require('./sleep');

const USDC_DECIMALS = 6;

export async function fetchSerumDEX(connection: typeof Connection, serumV3Market: typeof PublicKey, programId: typeof PublicKey, decimals: number) {
  try {
    const { owner, data } = throwIfNull(
      await connection.getAccountInfo(serumV3Market),
      'Market not found',
    );
    if (!owner.equals(programId)) { throw new Error(`Address not owned by program: ${owner.toBase58()}`); }
    const decoded = Market.getLayout(programId).decode(data);
    if (
      !decoded.accountFlags.initialized
      || !decoded.accountFlags.market
      || !decoded.ownAddress.equals(serumV3Market)
    ) {
      throw new Error('Invalid market');
    }

    const market = new Market(decoded, decimals, USDC_DECIMALS, {}, programId);
    const bids = await market.loadBids(connection);
    const asks = await market.loadAsks(connection);
    const firstAsk = await asks.items(false).next();
    const firstBid = await bids.items(true).next();
    if (!firstBid.value || !firstAsk.value) return 0;
    const midPrice = (firstBid.value.price + firstAsk.value.price) / 2;
    return midPrice;
  } catch (error) {
    // logger.error(error);
    console.log("Error within fetchSerumDEX()")
    console.log(error)
  }
  return 0;
};


 export async function updateAll(connection: typeof Connection) {
    for (let i = 0; i < 6; i += 1) {
        const connection = new Connection("https://api.mainnet-beta.solana.com", 'confirmed');
        const baseMarketObj = markets[i];
        let tokenPrice = 0;

        try {
            if (baseMarketObj.raydiumV4AMM) {
                tokenPrice = await fetchRaydiumAMM(connection, new PublicKey(baseMarketObj.raydiumV4AMM));
                
                const price0 = {
                    symbol: baseMarketObj.symbol,
                    id: baseMarketObj.tokenMint,
                    mint: baseMarketObj.tokenMint,
                    price: tokenPrice,
                    raydiumV4AMM: baseMarketObj.raydiumV4AMM,
                };
                
                console.log(price0);
            }
            
            if (baseMarketObj.serumV3Usdc) {
                tokenPrice = await fetchSerumDEX(
                connection,
                new PublicKey(baseMarketObj.serumV3Usdc),
                new PublicKey(baseMarketObj.programId),
                baseMarketObj.decimals,
                );

                const price1 = {
                    symbol: baseMarketObj.symbol,
                    id: baseMarketObj.tokenMint,
                    mint: baseMarketObj.tokenMint,
                    price: tokenPrice,
                    serumV3Usdc: baseMarketObj.serumV3Usdc,
                };

                console.log(price1);
            }

            if (baseMarketObj.orcaV2AMM) {
                tokenPrice = await fetchRaydiumAMM(connection, new PublicKey(baseMarketObj.orcaV2AMM));
                
                const price0 = {
                    symbol: baseMarketObj.symbol,
                    id: baseMarketObj.tokenMint,
                    mint: baseMarketObj.tokenMint,
                    price: tokenPrice,
                    orcaV2AMM: baseMarketObj.orcaV2AMM,
                };
                
                console.log(price0);
            
            }
        } catch (error) {
            console.log("Error within UpdateAll()")
            continue;
        }
        await sleep(2000);
        break;
    }
};




export async function fetchRaydiumAMM(connection: typeof Connection, ammId: typeof PublicKey) {
    const ammInfoRes = await connection.getAccountInfo(ammId);
    await sleep();
    const ammInfo = AMM_INFO_LAYOUT_V4.decode(ammInfoRes.data);
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
    const coinAmountWei = new BigNumber(poolCoinTokenAccount.amount.toString());
    const pcAmountWei = new BigNumber(poolPcTokenAccount.amount.toString());

    const ammOpenOrders = OpenOrders.getLayout(serumProgramId).decode(ammOpenOrdersRes.data);
    const { baseTokenTotal, quoteTokenTotal } = ammOpenOrders;
    coinAmountWei.plus(new BigNumber(baseTokenTotal.toString()));
    pcAmountWei.plus(new BigNumber(quoteTokenTotal.toString()));

    const {
        needTakePnlCoin, needTakePnlPc, coinDecimals, pcDecimals,
    } = ammInfo;
    coinAmountWei.minus(new BigNumber(needTakePnlCoin.toString()));
    pcAmountWei.minus(new BigNumber(needTakePnlPc.toString()));

    const coinAmount = coinAmountWei.dividedBy(new BigNumber(10 ** coinDecimals.toString())).toNumber();
    const pcAmount = pcAmountWei.dividedBy(new BigNumber(10 ** pcDecimals.toString())).toNumber();

    const coinPrice = pcAmount / coinAmount;
    return coinPrice;
};




export async function fetchOrcaAMM(connection: typeof Connection, ammId: typeof PublicKey) {
    const ammInfoRes = await connection.getAccountInfo(ammId);
    await sleep();
    const ammInfo = MARKET_STATE_LAYOUT_V2.decode(ammInfoRes.data);
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
    const coinAmountWei = new BigNumber(poolCoinTokenAccount.amount.toString());
    const pcAmountWei = new BigNumber(poolPcTokenAccount.amount.toString());

    const ammOpenOrders = OpenOrders.getLayout(serumProgramId).decode(ammOpenOrdersRes.data);
    const { baseTokenTotal, quoteTokenTotal } = ammOpenOrders;
    coinAmountWei.plus(new BigNumber(baseTokenTotal.toString()));
    pcAmountWei.plus(new BigNumber(quoteTokenTotal.toString()));

    const {
        needTakePnlCoin, needTakePnlPc, coinDecimals, pcDecimals,
    } = ammInfo;
    coinAmountWei.minus(new BigNumber(needTakePnlCoin.toString()));
    pcAmountWei.minus(new BigNumber(needTakePnlPc.toString()));

    const coinAmount = coinAmountWei.dividedBy(new BigNumber(10 ** coinDecimals.toString())).toNumber();
    const pcAmount = pcAmountWei.dividedBy(new BigNumber(10 ** pcDecimals.toString())).toNumber();

    const coinPrice = pcAmount / coinAmount;
    return coinPrice;
};

