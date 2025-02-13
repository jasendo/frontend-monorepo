import { useQuery } from '@apollo/client';
import { Button, Callout, Intent, Splash } from '@vegaprotocol/ui-toolkit';
import { formatDistance } from 'date-fns';
// @ts-ignore No types availabel for duration-js
import Duration from 'duration-js';
import gql from 'graphql-tag';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EpochCountdown } from '../../../components/epoch-countdown';
import { Heading } from '../../../components/heading';
import { SplashLoader } from '../../../components/splash-loader';
import { NetworkParams } from '../../../config';
import {
  AppStateActionType,
  useAppState,
} from '../../../contexts/app-state/app-state-context';
import { useNetworkParam } from '../../../hooks/use-network-param';
import type { Rewards } from './__generated__/Rewards';
import { RewardInfo } from './reward-info';
import { useVegaWallet } from '@vegaprotocol/wallet';

export const REWARDS_QUERY = gql`
  query Rewards($partyId: ID!) {
    party(id: $partyId) {
      id
      rewardDetails {
        asset {
          id
          symbol
        }
        rewards {
          asset {
            id
          }
          party {
            id
          }
          epoch {
            id
          }
          amount
          amountFormatted @client
          percentageOfTotal
          receivedAt
        }
        totalAmount
        totalAmountFormatted @client
      }
      delegations {
        amount
        amountFormatted @client
        epoch
      }
    }
    epoch {
      id
      timestamps {
        start
        end
        expiry
      }
    }
  }
`;

export const RewardsIndex = () => {
  const { t } = useTranslation();
  const { keypair, keypairs } = useVegaWallet();
  const { appDispatch } = useAppState();
  const { data, loading, error } = useQuery<Rewards>(REWARDS_QUERY, {
    variables: { partyId: keypair?.pub },
    skip: !keypair?.pub,
  });
  const {
    data: rewardAssetData,
    loading: rewardAssetLoading,
    error: rewardAssetError,
  } = useNetworkParam([
    NetworkParams.REWARD_ASSET,
    NetworkParams.REWARD_PAYOUT_DURATION,
  ]);

  const payoutDuration = React.useMemo(() => {
    if (!rewardAssetData || !rewardAssetData[1]) {
      return 0;
    }
    return new Duration(rewardAssetData[1]).milliseconds();
  }, [rewardAssetData]);

  if (error || rewardAssetError) {
    return (
      <section>
        <p>{t('Something went wrong')}</p>
        {error && <pre>{error.message}</pre>}
        {rewardAssetError && <pre>{rewardAssetError.message}</pre>}
      </section>
    );
  }

  if (loading || rewardAssetLoading || !rewardAssetData?.length) {
    return (
      <Splash>
        <SplashLoader />
      </Splash>
    );
  }

  return (
    <section className="rewards">
      <Heading title={t('pageTitleRewards')} />
      <p className="mb-8">{t('rewardsPara1')}</p>
      <p className="mb-8">{t('rewardsPara2')}</p>
      {payoutDuration ? (
        <div className="my-24">
          <Callout
            title={t('rewardsCallout', {
              duration: formatDistance(new Date(0), payoutDuration),
            })}
            headingLevel={3}
            intent={Intent.Warning}
          >
            <p className="mb-0">{t('rewardsPara3')}</p>
          </Callout>
        </div>
      ) : null}
      {!loading &&
        data &&
        !error &&
        data.epoch.timestamps.start &&
        data.epoch.timestamps.expiry && (
          <section className="mb-24">
            <EpochCountdown
              // eslint-disable-next-line
              id={data!.epoch.id}
              startDate={new Date(data.epoch.timestamps.start)}
              // eslint-disable-next-line
              endDate={new Date(data.epoch.timestamps.expiry!)}
            />
          </section>
        )}
      <section>
        {keypair && keypairs?.length ? (
          <RewardInfo
            currVegaKey={keypair}
            data={data}
            rewardAssetId={rewardAssetData[0]}
          />
        ) : (
          <Button
            className="mt-12"
            onClick={() =>
              appDispatch({
                type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
                isOpen: true,
              })
            }
          >
            {t('connectVegaWallet')}
          </Button>
        )}
      </section>
    </section>
  );
};
