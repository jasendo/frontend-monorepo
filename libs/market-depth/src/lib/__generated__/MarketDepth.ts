/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MarketDepth
// ====================================================

export interface MarketDepth_market_data_market {
  __typename: "Market";
  /**
   * Market ID
   */
  id: string;
}

export interface MarketDepth_market_data {
  __typename: "MarketData";
  /**
   * the arithmetic average of the best bid price and best offer price.
   */
  midPrice: string;
  /**
   * market id of the associated mark price
   */
  market: MarketDepth_market_data_market;
}

export interface MarketDepth_market_depth_lastTrade {
  __typename: "Trade";
  /**
   * The price of the trade (probably initially the passive order price, other determination algorithms are possible though) (uint64)
   */
  price: string;
}

export interface MarketDepth_market_depth_sell {
  __typename: "PriceLevel";
  /**
   * The price of all the orders at this level (uint64)
   */
  price: string;
  /**
   * The total remaining size of all orders at this level (uint64)
   */
  volume: string;
  /**
   * The number of orders at this price level (uint64)
   */
  numberOfOrders: string;
}

export interface MarketDepth_market_depth_buy {
  __typename: "PriceLevel";
  /**
   * The price of all the orders at this level (uint64)
   */
  price: string;
  /**
   * The total remaining size of all orders at this level (uint64)
   */
  volume: string;
  /**
   * The number of orders at this price level (uint64)
   */
  numberOfOrders: string;
}

export interface MarketDepth_market_depth {
  __typename: "MarketDepth";
  /**
   * Last trade for the given market (if available)
   */
  lastTrade: MarketDepth_market_depth_lastTrade | null;
  /**
   * Sell side price levels (if available)
   */
  sell: MarketDepth_market_depth_sell[] | null;
  /**
   * Buy side price levels (if available)
   */
  buy: MarketDepth_market_depth_buy[] | null;
  /**
   * Sequence number for the current snapshot of the market depth
   */
  sequenceNumber: string;
}

export interface MarketDepth_market {
  __typename: "Market";
  /**
   * Market ID
   */
  id: string;
  /**
   * decimalPlaces indicates the number of decimal places that an integer must be shifted by in order to get a correct
   * number denominated in the currency of the Market. (uint64)
   * 
   * Examples:
   * Currency     Balance  decimalPlaces  Real Balance
   * GBP              100              0       GBP 100
   * GBP              100              2       GBP   1.00
   * GBP              100              4       GBP   0.01
   * GBP                1              4       GBP   0.0001   (  0.01p  )
   * 
   * GBX (pence)      100              0       GBP   1.00     (100p     )
   * GBX (pence)      100              2       GBP   0.01     (  1p     )
   * GBX (pence)      100              4       GBP   0.0001   (  0.01p  )
   * GBX (pence)        1              4       GBP   0.000001 (  0.0001p)
   */
  decimalPlaces: number;
  /**
   * marketData for the given market
   */
  data: MarketDepth_market_data | null;
  /**
   * Current depth on the order book for this market
   */
  depth: MarketDepth_market_depth;
}

export interface MarketDepth {
  /**
   * An instrument that is trading on the VEGA network
   */
  market: MarketDepth_market | null;
}

export interface MarketDepthVariables {
  marketId: string;
}
