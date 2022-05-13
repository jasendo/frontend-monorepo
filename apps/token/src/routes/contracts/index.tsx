import { EtherscanLink } from '@vegaprotocol/ui-toolkit';
import { Heading } from '../../components/heading';
import { ADDRESSES } from '../../config';
import { ENV } from '../../config/env';

const Contracts = () => {
  return (
    <section>
      <Heading title={'Contracts'} />
      <hr />
      {Object.entries(ADDRESSES).map(([key, value]) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>{key}:</div>
          <EtherscanLink
            address={value as string}
            text={value as string}
            base={ENV.etherscanUrl}
          />
        </div>
      ))}
    </section>
  );
};

export default Contracts;
