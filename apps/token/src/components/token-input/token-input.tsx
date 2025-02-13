import {
  Button,
  Callout,
  Input,
  Intent,
  FormGroup,
} from '@vegaprotocol/ui-toolkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type {
  TransactionAction,
  TransactionState,
} from '../../hooks/transaction-reducer';
import {
  TransactionActionType,
  TxState,
} from '../../hooks/transaction-reducer';
import { BigNumber } from '../../lib/bignumber';
import { TransactionCallout } from '../transaction-callout';

const inputName = 'amount';

export const AmountInput = ({
  amount,
  setAmount,
  maximum,
  // TODO: render currency in input when https://github.com/vegaprotocol/frontend-monorepo/issues/273
  currency,
}: {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  maximum: BigNumber;
  currency: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex">
      <Input
        data-testid="token-amount-input"
        className="flex-1"
        name={inputName}
        id={inputName}
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        autoComplete="off"
        type="number"
        max={maximum.toString()}
        min={0}
        step="any"
      />
      {maximum && (
        <Button
          variant="inline-link"
          onClick={() => setAmount(maximum.toString())}
          data-testid="token-amount-use-maximum"
          className="flex flex-col justify-center text-ui p-8 h-28 my-0 mx-8"
        >
          {t('Use maximum')}
        </Button>
      )}
    </div>
  );
};

export const TokenInput = ({
  amount,
  setAmount,
  perform,
  submitText,
  currency,

  approveText,
  allowance,
  approve,
  requireApproval = false,
  maximum = new BigNumber('0'),
  minimum = new BigNumber('0'),
  approveTxState,
  approveTxDispatch,
}: {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  perform: () => void;
  submitText: string;
  currency: string;

  requireApproval?: boolean;
  maximum?: BigNumber;
  minimum?: BigNumber;
  allowance?: BigNumber;
  approve?: () => void;
  approveText?: string;
  approveTxState?: TransactionState;
  approveTxDispatch?: React.Dispatch<TransactionAction>;
}) => {
  if (
    requireApproval &&
    (allowance == null ||
      approve == null ||
      !approveTxState ||
      !approveTxDispatch)
  ) {
    throw new Error(
      'If requires approval is true allowance, approve, approveTxState and approveDispatch props are required!'
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const isApproved = !new BigNumber(allowance!).isEqualTo(0);
  const showApproveButton =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    !isApproved || new BigNumber(amount).isGreaterThan(allowance!);

  const isDisabled = React.useMemo<boolean>(() => {
    if (requireApproval) {
      return (
        !isApproved ||
        !amount ||
        new BigNumber(amount).isLessThanOrEqualTo('0') ||
        new BigNumber(amount).isGreaterThan(maximum)
      );
    }

    return (
      !amount ||
      new BigNumber(amount).isLessThanOrEqualTo('0') ||
      new BigNumber(amount).isGreaterThan(maximum) ||
      new BigNumber(amount).isLessThan(minimum)
    );
  }, [amount, isApproved, maximum, requireApproval, minimum]);
  let approveContent = null;

  if (showApproveButton) {
    if (
      approveTxDispatch &&
      approveTxState &&
      approveTxState.txState !== TxState.Default
    ) {
      approveContent = (
        <TransactionCallout
          state={approveTxState}
          pendingHeading={`Approve ${currency} for staking on Vega`}
          reset={() =>
            approveTxDispatch({ type: TransactionActionType.TX_RESET })
          }
        />
      );
    } else {
      approveContent = (
        <Button
          data-testid="token-input-approve-button"
          className="token-input__submit w-full"
          onClick={approve}
        >
          {approveText}
        </Button>
      );
    }
  } else if (requireApproval) {
    approveContent = (
      <Callout
        iconName="tick"
        intent={Intent.Success}
        title={`${currency} are approved for staking`}
      />
    );
  }

  return (
    <>
      <FormGroup label="" labelFor={inputName}>
        <AmountInput
          amount={amount}
          setAmount={setAmount}
          maximum={maximum}
          currency={currency}
        />
      </FormGroup>
      {approveContent ? <div className="mb-24">{approveContent}</div> : null}
      <Button
        data-testid="token-input-submit-button"
        className="w-full"
        disabled={isDisabled}
        onClick={perform}
      >
        {submitText}
      </Button>
    </>
  );
};
