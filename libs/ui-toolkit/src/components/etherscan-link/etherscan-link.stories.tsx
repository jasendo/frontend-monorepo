import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { EtherscanLink } from '.';

export default {
  title: 'EtherscanLink',
  component: EtherscanLink,
} as ComponentMeta<typeof EtherscanLink>;

const Template: ComponentStory<typeof EtherscanLink> = (args) => (
  <EtherscanLink {...args} />
);

export const Transaction = Template.bind({});
Transaction.args = {
  base: 'https://etherscan.io',
  tx: 'foo',
  text: 'View transaction on Etherscan',
};

export const Address = Template.bind({});
Address.args = {
  base: 'https://etherscan.io',
  address: 'foo',
  text: 'View transaction on Etherscan',
};
