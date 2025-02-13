import { Icon, Loader } from '@vegaprotocol/ui-toolkit';
import type { ReactNode } from 'react';
import type { OrderEvent_busEvents_event_Order } from './__generated__/OrderEvent';
import { addDecimalsFormatNumber, t } from '@vegaprotocol/react-helpers';
import type { VegaTxState } from '@vegaprotocol/wallet';
import { VegaTxStatus } from '@vegaprotocol/wallet';

interface OrderDialogProps {
  transaction: VegaTxState;
  finalizedOrder: OrderEvent_busEvents_event_Order | null;
}

export const OrderDialog = ({
  transaction,
  finalizedOrder,
}: OrderDialogProps) => {
  // TODO: When wallets support confirming transactions return UI for 'awaiting confirmation' step

  // Rejected by wallet
  if (transaction.status === VegaTxStatus.Error) {
    return (
      <OrderDialogWrapper
        title="Order rejected by wallet"
        icon={<Icon name="warning-sign" size={20} />}
      >
        {transaction.error && (
          <pre className="text-ui break-all whitespace-pre-wrap">
            {JSON.stringify(transaction.error, null, 2)}
          </pre>
        )}
      </OrderDialogWrapper>
    );
  }

  // Pending consensus
  if (!finalizedOrder) {
    return (
      <OrderDialogWrapper
        title="Awaiting network confirmation"
        icon={<Loader size="small" />}
      >
        {transaction.txHash && (
          <p data-testid="tx-hash" className="break-all">
            {t(`Tx hash: ${transaction.txHash}`)}
          </p>
        )}
      </OrderDialogWrapper>
    );
  }

  // Order on network but was rejected
  if (finalizedOrder.status === 'Rejected') {
    return (
      <OrderDialogWrapper
        title="Order failed"
        icon={<Icon name="warning-sign" size={20} />}
      >
        <p data-testid="error-reason">
          {t(`Reason: ${finalizedOrder.rejectionReason}`)}
        </p>
      </OrderDialogWrapper>
    );
  }

  return (
    <OrderDialogWrapper
      title="Order placed"
      icon={<Icon name="tick" size={20} />}
    >
      <p>{t(`Status: ${finalizedOrder.status}`)}</p>
      {finalizedOrder.market && (
        <p>{t(`Market: ${finalizedOrder.market.name}`)}</p>
      )}
      <p>{t(`Type: ${finalizedOrder.type}`)}</p>
      <p>{t(`Amount: ${finalizedOrder.size}`)}</p>
      {finalizedOrder.type === 'Limit' && finalizedOrder.market && (
        <p>
          {t(
            `Price: ${addDecimalsFormatNumber(
              finalizedOrder.price,
              finalizedOrder.market.decimalPlaces
            )}`
          )}
        </p>
      )}
    </OrderDialogWrapper>
  );
};

interface OrderDialogWrapperProps {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}

const OrderDialogWrapper = ({
  children,
  icon,
  title,
}: OrderDialogWrapperProps) => {
  return (
    <div className="flex gap-12 max-w-full">
      <div className="pt-8 fill-current">{icon}</div>
      <div data-testid="order-wrapper" className="flex-1">
        <h1 data-testid="order-status-header" className="text-h4">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};
