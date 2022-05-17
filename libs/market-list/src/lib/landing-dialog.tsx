import { gql, useQuery } from '@apollo/client';
import { Interval } from '@vegaprotocol/types';
import {
  Arrow,
  AsyncRenderer,
  Dialog,
  Intent,
  Sparkline,
} from '@vegaprotocol/ui-toolkit';
import { useState } from 'react';

import { mapDataToMarketList } from './utils';

const MARKET_LIST_QUERY = gql`
  query MarketList($interval: Interval!, $since: String!) {
    markets {
      id
      decimalPlaces
      tradableInstrument {
        instrument {
          name
          code
        }
      }
      marketTimestamps {
        open
        close
      }
      candles(interval: $interval, since: $since) {
        open
        close
      }
    }
  }
`;

// Sparkline for the Market

export interface MarketSparklineProps {
  candles?: {
    close: string | undefined | number;
    open: string | undefined | number;
  }[];
}

export const MarketSparkline = ({ candles }: MarketSparklineProps) => {
  return (
    <Sparkline
      width={100}
      height={20}
      data={
        candles
          ?.filter((m) => !isNaN(Number(m.close)))
          ?.map((m) => Number(m.close)) || []
      }
    />
  );
};

// Landing Dialog

export const LandingDialog = () => {
  const [open, setOpen] = useState(true);
  const setClose = () => setOpen(false);

  const yesterday = Math.round(new Date().getTime() / 1000) - 24 * 3600;
  const yTimestamp = new Date(yesterday * 1000).toISOString();

  const { data, loading, error } = useQuery(MARKET_LIST_QUERY, {
    variables: { interval: Interval.I1H, since: yTimestamp },
  });

  const thClassNames = (direction: 'left' | 'right') =>
    `px-8 text-${direction} font-sans font-normal text-ui-small leading-9 capitalize mb-0 text-dark/80 dark:text-white/80`;
  const tdClassNames =
    'px-8 font-sans leading-9 capitalize text-ui-small text-right';
  const priceChangeClassNames = (value: number) =>
    value === 0
      ? 'text-black dark:text-white'
      : value > 0
      ? `text-green`
      : `text-red`;
  const boldUnderlineClassNames =
    'px-8 underline font-sans text-base leading-9 font-bold tracking-tight decoration-solid text-ui';

  return (
    <AsyncRenderer loading={loading} error={error} data={data}>
      {
        <Dialog
          title="Select a market to get started"
          intent={Intent.Prompt}
          open={open}
          onChange={setClose}
          titleClassNames="font-bold font-sans text-3xl tracking-tight mb-0"
        >
          {
            <div className="max-h-[40rem] overflow-x-auto">
              <table className="relative h-full min-w-full whitespace-nowrap">
                <thead className="sticky top-0 z-10 dark:bg-black bg-white">
                  <tr>
                    <th className={thClassNames('left')}>Market</th>
                    <th className={thClassNames('right')}>Last Price</th>
                    <th className={thClassNames('right')}>Change (24h)</th>
                    <th className={thClassNames('right')}></th>
                  </tr>
                </thead>
                <tbody>
                  {mapDataToMarketList(data)
                    ?.filter(
                      (m) => m.candles && m.lastPrice && m.lastPrice !== 'N/A'
                    )
                    ?.map((market, i) => (
                      <tr key={market.id}>
                        <td className={boldUnderlineClassNames}>
                          {market?.marketName}
                        </td>
                        <td className={tdClassNames}>
                          {market?.lastPrice.toLocaleString()}
                        </td>
                        <td
                          className={`${tdClassNames} ${priceChangeClassNames(
                            market?.change
                          )} flex items-center gap-4`}
                        >
                          {<Arrow value={market?.change} />}
                          <span className="flex items-center gap-6">
                            <span>
                              {market?.change.toFixed(2).toLocaleString()}%
                            </span>
                            <span>({market?.change.toLocaleString()})</span>
                          </span>
                        </td>
                        <td className="px-8">
                          {<MarketSparkline candles={market?.candles} />}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className={`${boldUnderlineClassNames} text-ui`}>
                Or view full market list
              </div>
            </div>
          }
        </Dialog>
      }
    </AsyncRenderer>
  );
};
