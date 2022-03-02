import { $axios } from '@baloise/vue-axios'

export type Price = {
  [currency: string]: number
}

export type PriceRes = {
  [coin: string]: Price,
}

export type Market = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_24h_in_currency: number
  price_change_percentage_1h_in_currency: number
  price_change_percentage_7d_in_currency: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: Date
  atl: number
  atl_change_percentage: number
  atl_date: Date
  roi: number
  last_updated: Date
  sparkline_in_7d: {
    price: number[]
  }
}

export type Ticker = {
  "base": string,
  "target": string,
  "market": {
    "name": string,
    "identifier": string,
    "has_trading_incentive": boolean,
  },
  "last": number,
  "volume": number,
  "converted_last": {
    "btc": number,
    "eth": number,
    "usd": number,
  },
  "converted_volume": {
    "btc": number,
    "eth": number,
    "usd": number,
  },
  "trust_score": number,
  "bid_ask_spread_percentage": number,
  "timestamp": string,
  "last_traded_at": string,
  "last_fetch_at": string,
  "is_anomaly": boolean,
  "is_stale": boolean,
  "trade_url": string,
  "token_info_url": string,
  "coin_id": string,
  "target_coin_id": string,
}
export type Exchange = {
  "name": string,
  "year_established": number,
  "country": string,
  "description": string,
  "url": string,
  "image": string,
  "facebook_url": string,
  "reddit_url": string,
  "telegram_url": string,
  "slack_url": string,
  "other_url_1": string,
  "other_url_2": string,
  "twitter_handle": string,
  "has_trading_incentive": boolean,
  "centralized": boolean,
  "public_notice": string,
  "alert_notice": string,
  "trust_score": number,
  "trust_score_rank": number,
  "trade_volume_24h_btc": number,
  "trade_volume_24h_btc_normalized": number,
  "tickers" : Ticker[]
  "status_updates": []
}

export const SIMPLE_PRICE_PATH = '/simple/price'

export const MANGO = "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac"
export const RAYDM = "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
export const ORCA = "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE"
var strings = [MANGO,RAYDM,ORCA]
export const contract_addrs = strings.join(",")

export const CoinGeckoApi = $axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 30 * 1000,
})

