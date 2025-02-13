import { gql } from '@apollo/client';
import type { Markets, Markets_markets } from './__generated__/Markets';
import { makeDataProvider } from '@vegaprotocol/react-helpers';

import type {
  MarketDataSub,
  MarketDataSub_marketData,
} from './__generated__/MarketDataSub';

const MARKET_DATA_FRAGMENT = gql`
  fragment MarketDataFields on MarketData {
    market {
      id
      state
      tradingMode
    }
    bestBidPrice
    bestOfferPrice
    markPrice
  }
`;

const MARKETS_QUERY = gql`
  ${MARKET_DATA_FRAGMENT}
  query Markets {
    markets {
      id
      name
      decimalPlaces
      data {
        ...MarketDataFields
      }
      tradableInstrument {
        instrument {
          code
          product {
            ... on Future {
              settlementAsset {
                symbol
              }
            }
          }
        }
      }
    }
  }
`;

const MARKET_DATA_SUB = gql`
  ${MARKET_DATA_FRAGMENT}
  subscription MarketDataSub {
    marketData {
      ...MarketDataFields
    }
  }
`;

const update = (draft: Markets_markets[], delta: MarketDataSub_marketData) => {
  const index = draft.findIndex((m) => m.id === delta.market.id);
  if (index !== -1) {
    draft[index].data = delta;
  }
  // @TODO - else push new market to draft
};
const getData = (responseData: Markets): Markets_markets[] | null =>
  responseData.markets;
const getDelta = (subscriptionData: MarketDataSub): MarketDataSub_marketData =>
  subscriptionData.marketData;

export const marketsDataProvider = makeDataProvider<
  Markets,
  Markets_markets[],
  MarketDataSub,
  MarketDataSub_marketData
>(MARKETS_QUERY, MARKET_DATA_SUB, update, getData, getDelta);
