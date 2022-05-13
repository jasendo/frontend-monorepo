import type { EthereumChainId } from '@vegaprotocol/smart-contracts-sdk';
import {
  EnvironmentConfig,
  EthereumChainIds,
} from '@vegaprotocol/smart-contracts-sdk';
import { ENV } from './env';

import type { Networks } from './vega';

type VegaContracts = typeof EnvironmentConfig[Networks];

const appChainId = Number(ENV.chainId || 3);

export const APP_ENV = ENV.envName as Networks;

const Addresses: Record<number, VegaContracts> = {
  1: EnvironmentConfig.MAINNET,
  3: EnvironmentConfig[APP_ENV],
};

export type { EthereumChainId };
export { EthereumChainIds };

/** Contract addresses for the different contracts in the VEGA ecosystem */
export const ADDRESSES = Addresses[appChainId];

/**
 * The Chain ID the environment is configured for.
 * Normally this is 0x3 (Ropsten) for dev and 0x1 (Mainnet) for prod
 */
export const APP_CHAIN_ID = appChainId;
