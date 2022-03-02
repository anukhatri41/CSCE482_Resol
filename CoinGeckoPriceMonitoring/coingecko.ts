import { CoinGeckoApi, contract_addrs, PriceRes, Market, Exchange } from './api'
// import { MANGO } from './api'

// export function getCoinGeckoId(coinSymbol: string | undefined): string | undefined {
//     return coinGeckoIds.find(({ symbol }) => (symbol === coinSymbol))?.coinGeckoId
//   }
  
//   export function getSymbolWithId(coinId: string): string | undefined {
//     return coinGeckoIds.find(({ coinGeckoId }) => (coinGeckoId === coinId))?.symbol
//   }
  
//   export async function fetchPrices(coinSymbols: string[], currency = 'usd'): Promise<PriceRes> {
//     const coinIds = coinSymbols.map(value => getCoinGeckoId(value)).filter(value => value).join(',')
//     const resp = await CoinGeckoApi.get<PriceRes>(SIMPLE_PRICE_PATH, {
//       params: {
//         ids: coinIds,
//         vs_currencies: currency,
//       },
//     })
//     return resp.data
//   }



export async function fetchPrice(): Promise<PriceRes> {
    // const coinIds = coinSymbols.map(value => getCoinGeckoId(value)).filter(value => value).join(',')
    const resp = await CoinGeckoApi.get<PriceRes>("/simple/token_price/solana", {
      params: {
        contract_addresses: contract_addrs,
        vs_currencies: 'usd,btc,eth'
        // include_last_updated_at: true,
      },
    })
    return resp.data
  }

  export async function fetchOrcaData():  Promise<Exchange> {
    const resp = await CoinGeckoApi.get<Exchange>("/exchanges/orca")
      return resp.data
  }

  export async function fetchSerumDexData():  Promise<Exchange> {
    const resp = await CoinGeckoApi.get<Exchange>("/exchanges/serum_dex")
      return resp.data
  }

  export async function fetchRaydiumData():  Promise<Exchange> {
    const resp = await CoinGeckoApi.get<Exchange>("/exchanges/raydium2")
      return resp.data
  }

  export function printResponse(result: Exchange) { 
    var tick = result.tickers
    for (let a in tick) {
        if ((tick[a]['is_stale'] == false) && (tick[a]['is_anomaly'] == false))
        {
            console.log(tick[a]['market']['name'], tick[a]['base'], "->", tick[a]['target'], tick[a]['last'], tick[a]['timestamp'])
        }
    }
  }
//   export const HOT_COIN_MARKET = [
//     'SOL',
//     'LINK',
//     'OXY',
//     'SRM',
//     'RAY',
//     'FTT',
//     'FIDA',
//     'MER',
//     'COPE',
//     'ROPE',
//     'STEP',
//     'MEDIA',
//   ]
  
//   export type CoinMarket = {
//     info: TokenInfo | undefined
//     market: Market | undefined
//   }
  
//   export async function fetchCoinMarket(coinSymbols: string[], currency = 'usd'): Promise<Market[]> {
//     if (coinSymbols.length === 0) return []
//     const coinIds = coinSymbols.map(value => getCoinGeckoId(value)).filter(value => value).join(',')
//     const resp = await CoinGeckoApi.get<Market[]>('/coins/markets', {
//       params: {
//         vs_currency: currency,
//         ids: coinIds,
//         order: 'market_cap_desc',
//         sparkline: false,
//         price_change_percentage: '1h,24h,7d',
//       },
//     })
//     return resp.data
//   }