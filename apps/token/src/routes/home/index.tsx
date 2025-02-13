import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Heading } from '../../components/heading';
import { Links } from '../../config';
import { useAppState } from '../../contexts/app-state/app-state-context';
import { useDocumentTitle } from '../../hooks/use-document-title';
import { BigNumber } from '../../lib/bignumber';
import type { RouteChildProps } from '..';
import { Routes } from '../router-config';
import type { NodeData } from './__generated__/NodeData';
import { TokenDetails } from './token-details';
import { Button } from '@vegaprotocol/ui-toolkit';

export const TOTAL_STAKED_QUERY = gql`
  query NodeData {
    nodeData {
      stakedTotal
      stakedTotalFormatted @client
    }
  }
`;

const Home = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const { appState } = useAppState();
  const { data } = useQuery<NodeData>(TOTAL_STAKED_QUERY);
  const totalStaked = React.useMemo(() => {
    return new BigNumber(data?.nodeData?.stakedTotalFormatted || '0');
  }, [data]);

  return (
    <>
      <Heading title={t('theVegaToken', { symbol: '$VEGA' })} />
      <HomeSection>
        <TokenDetails
          totalSupply={appState.totalSupply}
          totalStaked={totalStaked}
        />
      </HomeSection>
      <HomeSection>
        <h2 className="text-h4">{t('Token Vesting')}</h2>
        <p className="mb-8">
          {t(
            'The vesting contract holds VEGA tokens until they have become unlocked.'
          )}
        </p>
        <p className="mb-8">
          <Trans
            i18nKey="Tokens are held in different <trancheLink>Tranches</trancheLink>. Each tranche has its own schedule for how the tokens are unlocked."
            components={{
              trancheLink: <Link to={Routes.TRANCHES} />,
            }}
          />
        </p>
        <p className="mb-8">
          {t(
            'Once unlocked they can be redeemed from the contract so that you can transfer them between wallets.'
          )}
        </p>
        <Link to={Routes.VESTING}>
          <Button variant="secondary" data-test-id="check-vesting-page-btn">
            {t('Check to see if you can redeem unlocked VEGA tokens')}
          </Button>
        </Link>
      </HomeSection>
      <HomeSection>
        <h2 className="text-h4">{t('USE YOUR VEGA TOKENS')}</h2>
        <p className="mb-8">
          {t(
            'To use your tokens on the Vega network they need to be associated with a Vega wallet/key.'
          )}
        </p>
        <p className="mb-8">
          {t(
            'This can happen both while held in the vesting contract as well as when redeemed.'
          )}
        </p>
        <p>
          <a
            data-test-id="get-vega-wallet-link"
            href={Links.WALLET_GUIDE}
            target="_blank"
            rel="nofollow noreferrer"
          >
            {t('Get a Vega wallet')}
          </a>
        </p>
        <p data-test-id="associate-vega-tokens-link-on-homepage">
          <Link to={`${Routes.STAKING}/associate`}>
            {t('Associate VEGA tokens')}
          </Link>
        </p>
      </HomeSection>
      <div style={{ display: 'flex', gap: 36 }}>
        <div style={{ flex: 1 }}>
          <HomeSection>
            <h2 className="text-h4">{t('Staking')}</h2>
            <p className="mb-8">
              {t(
                'VEGA token holders can nominate a validator node and receive staking rewards.'
              )}
            </p>
            <p>
              <Link to={Routes.STAKING}>
                <Button variant="secondary">{t('Nominate a validator')}</Button>
              </Link>
            </p>
          </HomeSection>
        </div>
        <div style={{ flex: 1 }}>
          <HomeSection>
            <h2 className="text-h4">{t('Governance')}</h2>
            <p className="mb-8">
              {t(
                'VEGA token holders can vote on proposed changes to the network and create proposals.'
              )}
            </p>
            <p>
              <Link to={Routes.GOVERNANCE}>
                <Button variant="secondary">
                  {t('View Governance proposals')}
                </Button>
              </Link>
            </p>
          </HomeSection>
        </div>
      </div>
    </>
  );
};

export default Home;

export const HomeSection = ({ children }: { children: React.ReactNode }) => {
  return <section className="mb-20">{children}</section>;
};
