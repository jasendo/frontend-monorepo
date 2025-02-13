import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';
import type { Order } from './use-order-state';
import type {
  VegaKeyExtended,
  VegaWalletContextShape,
} from '@vegaprotocol/wallet';
import { VegaTxStatus, VegaWalletContext } from '@vegaprotocol/wallet';
import { OrderSide, OrderTimeInForce, OrderType } from '@vegaprotocol/wallet';
import type { ReactNode } from 'react';
import { useOrderSubmit } from './use-order-submit';

const defaultWalletContext = {
  keypair: null,
  keypairs: [],
  sendTx: jest.fn().mockReturnValue(Promise.resolve(null)),
  connect: jest.fn(),
  disconnect: jest.fn(),
  selectPublicKey: jest.fn(),
  connector: null,
};

function setup(
  context?: Partial<VegaWalletContextShape>,
  market = { id: 'market-id', decimalPlaces: 2 }
) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MockedProvider>
      <VegaWalletContext.Provider
        value={{ ...defaultWalletContext, ...context }}
      >
        {children}
      </VegaWalletContext.Provider>
    </MockedProvider>
  );
  return renderHook(() => useOrderSubmit(market), { wrapper });
}

it('Has the correct default state', () => {
  const { result } = setup();
  expect(typeof result.current.submit).toEqual('function');
  expect(typeof result.current.reset).toEqual('function');
  expect(result.current.transaction.status).toEqual(VegaTxStatus.Default);
  expect(result.current.transaction.txHash).toEqual(null);
  expect(result.current.transaction.error).toEqual(null);
});

it('Should not sendTx if no keypair', async () => {
  const mockSendTx = jest.fn();
  const { result } = setup({ sendTx: mockSendTx, keypairs: [], keypair: null });
  await act(async () => {
    result.current.submit({} as Order);
  });
  expect(mockSendTx).not.toHaveBeenCalled();
});

it('Should not sendTx side is not specified', async () => {
  const mockSendTx = jest.fn();
  const keypair = {
    pub: '0x123',
  } as VegaKeyExtended;
  const { result } = setup({
    sendTx: mockSendTx,
    keypairs: [keypair],
    keypair,
  });
  await act(async () => {
    result.current.submit({} as Order);
  });
  expect(mockSendTx).not.toHaveBeenCalled();
});

it('Create an Id if a signature is returned', async () => {
  const signature =
    '597a7706491e6523c091bab1e4d655b62c45a224e80f6cd92ac366aa5dd9a070cc7dd3c6919cb07b81334b876c662dd43bdbe5e827c8baa17a089feb654fab0b';
  const expectedId =
    '2fe09b0e2e6ed35f8883802629c7d609d3cc2fc9ce3cec0b7824a0d581bd3747';
  const successObj = {
    tx: {
      inputData: 'input-data',
      signature: {
        algo: 'algo',
        version: 1,
        value: signature,
      },
    },
    txHash: '0x123',
  };
  const mockSendTx = jest.fn().mockReturnValue(Promise.resolve(successObj));
  const keypair = {
    pub: '0x123',
  } as VegaKeyExtended;
  const { result } = setup({
    sendTx: mockSendTx,
    keypairs: [keypair],
    keypair,
  });
  await act(async () => {
    result.current.submit({
      type: OrderType.Market,
      side: OrderSide.Buy,
      size: '1',
      timeInForce: OrderTimeInForce.FOK,
    });
  });
  expect(result.current.id).toEqual(expectedId);
});

it('Should submit a correctly formatted order', async () => {
  const mockSendTx = jest.fn().mockReturnValue(Promise.resolve({}));
  const keypair = {
    pub: '0x123',
  } as VegaKeyExtended;
  const market = {
    id: 'market-id',
    decimalPlaces: 2,
  };
  const { result } = setup(
    {
      sendTx: mockSendTx,
      keypairs: [keypair],
      keypair,
    },
    market
  );

  const order = {
    type: OrderType.Limit,
    size: '10',
    timeInForce: OrderTimeInForce.GTT,
    side: OrderSide.Buy,
    price: '1234567.89',
    expiration: new Date('2022-01-01'),
  };
  await act(async () => {
    result.current.submit(order);
  });

  expect(mockSendTx).toHaveBeenCalledWith({
    pubKey: keypair.pub,
    propagate: true,
    orderSubmission: {
      type: OrderType.Limit,
      marketId: market.id, // Market provided from hook arugment
      size: '10',
      side: OrderSide.Buy,
      timeInForce: OrderTimeInForce.GTT,
      price: '123456789', // Decimal removed
      expiresAt: order.expiration.getTime() + '000000', // Nanoseconds appened
    },
  });
});
