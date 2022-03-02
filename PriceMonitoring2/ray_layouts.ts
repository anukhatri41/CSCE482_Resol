const { struct, u8, u32, blob, seq } = require('buffer-layout');
// const { publicKey, u128, u64 } = require('./borsh');
const { publicKey } = require('./borsh');
// import {  struct, u8 } from 'buffer-layout';
import { accountFlagsLayout, publicKeyLayout, u128, u64 } from './layout';
// import { Slab, SLAB_LAYOUT } from './slab';
// import { DexInstructions } from './instructions';
// import BN from 'bn.js';
// import {
//   Account,
//   AccountInfo,
//   Commitment,
//   Connection,
//   LAMPORTS_PER_SOL,
//   PublicKey,
//   SystemProgram,
//   Transaction,
//   TransactionInstruction,
//   TransactionSignature,
// } from '@solana/web3.js';
// import { decodeEventQueue, decodeRequestQueue } from './queue';
// import { Buffer } from 'buffer';
// import { getFeeTier, supportsSrmFeeDiscounts } from './fees';
// import {
//   closeAccount,
//   initializeAccount,
//   MSRM_DECIMALS,
//   MSRM_MINT,
//   SRM_DECIMALS,
//   SRM_MINT,
//   TOKEN_PROGRAM_ID,
//   WRAPPED_SOL_MINT,
// } from './token-instructions';
// import { getLayoutVersion } from './tokens_and_markets';


module.exports.ACCOUNT_LAYOUT = struct([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority'),
]);

module.exports.AMM_INFO_LAYOUT_V4 = struct([
  u64('status'),
  u64('nonce'),
  u64('orderNum'),
  u64('depth'),
  u64('coinDecimals'),
  u64('pcDecimals'),
  u64('state'),
  u64('resetFlag'),
  u64('minSize'),
  u64('volMaxCutRatio'),
  u64('amountWaveRatio'),
  u64('coinLotSize'),
  u64('pcLotSize'),
  u64('minPriceMultiplier'),
  u64('maxPriceMultiplier'),
  u64('systemDecimalsValue'),
  // Fees
  u64('minSeparateNumerator'),
  u64('minSeparateDenominator'),
  u64('tradeFeeNumerator'),
  u64('tradeFeeDenominator'),
  u64('pnlNumerator'),
  u64('pnlDenominator'),
  u64('swapFeeNumerator'),
  u64('swapFeeDenominator'),
  // OutPutData
  u64('needTakePnlCoin'),
  u64('needTakePnlPc'),
  u64('totalPnlPc'),
  u64('totalPnlCoin'),
  u128('poolTotalDepositPc'),
  u128('poolTotalDepositCoin'),
  u128('swapCoinInAmount'),
  u128('swapPcOutAmount'),
  u64('swapCoin2PcFee'),
  u128('swapPcInAmount'),
  u128('swapCoinOutAmount'),
  u64('swapPc2CoinFee'),

  publicKey('poolCoinTokenAccount'),
  publicKey('poolPcTokenAccount'),
  publicKey('coinMintAddress'),
  publicKey('pcMintAddress'),
  publicKey('lpMintAddress'),
  publicKey('ammOpenOrders'),
  publicKey('serumMarket'),
  publicKey('serumProgramId'),
  publicKey('ammTargetOrders'),
  publicKey('poolWithdrawQueue'),
  publicKey('poolTempLpTokenAccount'),
  publicKey('ammOwner'),
  publicKey('pnlOwner'),
]);

export const MARKET_STATE_LAYOUT_V2 = struct([
    blob(5),
  
    accountFlagsLayout('accountFlags'),
  
    publicKeyLayout('ownAddress'),
  
    u64('vaultSignerNonce'),
  
    publicKeyLayout('baseMint'),
    publicKeyLayout('quoteMint'),
  
    publicKeyLayout('baseVault'),
    u64('baseDepositsTotal'),
    u64('baseFeesAccrued'),
  
    publicKeyLayout('quoteVault'),
    u64('quoteDepositsTotal'),
    u64('quoteFeesAccrued'),
  
    u64('quoteDustThreshold'),
  
    publicKeyLayout('requestQueue'),
    publicKeyLayout('eventQueue'),
  
    publicKeyLayout('bids'),
    publicKeyLayout('asks'),
  
    u64('baseLotSize'),
    u64('quoteLotSize'),
  
    u64('feeRateBps'),
  
    u64('referrerRebatesAccrued'),
  
    blob(7),
  ]);
  

export const MARKET_STATE_LAYOUT_V3 = struct([
    blob(5),
  
    accountFlagsLayout('accountFlags'),
  
    publicKeyLayout('ownAddress'),
  
    u64('vaultSignerNonce'),
  
    publicKeyLayout('baseMint'),
    publicKeyLayout('quoteMint'),
  
    publicKeyLayout('baseVault'),
    u64('baseDepositsTotal'),
    u64('baseFeesAccrued'),
  
    publicKeyLayout('quoteVault'),
    u64('quoteDepositsTotal'),
    u64('quoteFeesAccrued'),
  
    u64('quoteDustThreshold'),
  
    publicKeyLayout('requestQueue'),
    publicKeyLayout('eventQueue'),
  
    publicKeyLayout('bids'),
    publicKeyLayout('asks'),
  
    u64('baseLotSize'),
    u64('quoteLotSize'),
  
    u64('feeRateBps'),
  
    u64('referrerRebatesAccrued'),
  
    publicKeyLayout('authority'),
    publicKeyLayout('pruneAuthority'),
    publicKeyLayout('consumeEventsAuthority'),
  
    blob(992),
  
    blob(7),
  ]);