import type {
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import { AgGridColumn } from 'ag-grid-react';
import {
  getDateTimeFormat,
  t,
  truncateByChars,
  formatNumber,
} from '@vegaprotocol/react-helpers';
import { WithdrawalStatus } from '@vegaprotocol/types';
import {
  EtherscanLink,
  AgGridDynamic as AgGrid,
} from '@vegaprotocol/ui-toolkit';
import { TransactionDialog } from '@vegaprotocol/web3';
import { useCompleteWithdraw } from './use-complete-withdraw';
import type { Withdrawals_party_withdrawals } from './__generated__/Withdrawals';

export interface WithdrawalsTableProps {
  withdrawals: Withdrawals_party_withdrawals[];
  etherscanUrl: string;
}

export const WithdrawalsTable = ({
  withdrawals,
  etherscanUrl,
}: WithdrawalsTableProps) => {
  const { transaction, submit } = useCompleteWithdraw();

  return (
    <>
      <AgGrid
        rowData={withdrawals}
        overlayNoRowsTemplate={t('No withdrawals')}
        defaultColDef={{ flex: 1, resizable: true }}
        style={{ width: '100%', height: '100%' }}
        components={{ StatusCell, RecipientCell }}
        suppressCellFocus={true}
      >
        <AgGridColumn headerName="Asset" field="asset.symbol" />
        <AgGridColumn
          headerName="Amount"
          field="amount"
          valueFormatter={({ value, data }: ValueFormatterParams) => {
            return formatNumber(value, data.asset.decimals);
          }}
        />
        <AgGridColumn
          headerName="Recipient"
          field="details.receiverAddress"
          cellRenderer="RecipientCell"
          valueFormatter={({ value }: ValueFormatterParams) => {
            return truncateByChars(value);
          }}
          cellRendererParams={{ etherscanUrl }}
        />
        <AgGridColumn
          headerName="Created at"
          field="createdTimestamp"
          valueFormatter={({ value }: ValueFormatterParams) => {
            return getDateTimeFormat().format(new Date(value));
          }}
        />
        <AgGridColumn
          headerName="Status"
          field="status"
          cellRenderer="StatusCell"
          cellRendererParams={{ complete: submit, etherscanUrl }}
        />
      </AgGrid>
      <TransactionDialog
        name="withdraw"
        {...transaction}
        etherscanUrl={etherscanUrl}
      />
    </>
  );
};

export interface StatusCellProps extends ICellRendererParams {
  complete: (withdrawalId: string) => void;
  etherscanUrl: string;
}

export const StatusCell = ({
  value,
  data,
  complete,
  etherscanUrl,
}: StatusCellProps) => {
  if (data.pendingOnForeignChain) {
    return (
      <div className="flex justify-between gap-8">
        {t('Pending')}
        {data.txHash && (
          <EtherscanLink
            tx={data.txHash}
            text={t('View on Etherscan')}
            base={etherscanUrl}
          />
        )}
      </div>
    );
  }

  if (value === WithdrawalStatus.Finalized) {
    return (
      <div className="flex justify-between gap-8">
        {data.txHash ? (
          <>
            {t('Finalized')}
            <EtherscanLink
              tx={data.txHash}
              text={t('View on Etherscan')}
              base={etherscanUrl}
            />
          </>
        ) : (
          <>
            {t('Open')}
            <button className="underline" onClick={() => complete(data.id)}>
              {t('Complete')}
            </button>
          </>
        )}
      </div>
    );
  }

  return value;
};

const RecipientCell = ({
  value,
  valueFormatted,
  etherscanUrl,
}: ICellRendererParams & { etherscanUrl: string }) => {
  return (
    <EtherscanLink address={value} text={valueFormatted} base={etherscanUrl} />
  );
};
