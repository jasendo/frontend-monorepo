## Explorer

## Features

- Transactions - Showing all transactions and decoded individual transactions
- Search - Search for block number or transaction hash
- Blocks - A list of the blocks on our chain and the transactions within each block
- Assets - List of all assets on the Vega chain
- Genesis - The initial Genesis configuration the network was started with
- Governance - Current and past governance proposals
- Markets - The markets currently open and expired on the Vega network
- Network Parameters - The current network parameters
- Parties - Searching for a specific party and the details for that party
- Validators - The validator information in Vega and Tendermint

## Development

First copy the configuration of the application you are starting:

```bash
cp .env.[environment] .env.local
```

Starting the app:

```bash
yarn nx serve explorer
```

### Configuration

Example configurations are provided here:

- [Mainnet](./.env.mainnet)
- [Testnet](./.env.testnet)
- [Capsule](./.env.capsule)
- [Testnet](./.env.testnet)
- [Stagnet1](./.env.stagnet1)
- [Stagnet2](./.env.stagnet2)

There are a few different configuration options offered for this app:

| **Flag**                         | **Purpose**                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `NX_CHAIN_EXPLORER_URL`          | The URL of the chain explorer service for decoding transactions                                      |
| `NX_TENDERMINT_URL`              | The Tendermint REST URL for the Vega consesus engine                                                 |
| `NX_TENDERMINT_WEBSOCKET_URL`    | The Tendermint Websocket URL for the Vega consensus engine                                           |
| `NX_VEGA_URL`                    | The GraphQl query endpoint of a [Vega data node](https://github.com/vegaprotocol/networks#data-node) |
| `NX_VEGA_ENV`                    | The name of the currently connected vega environment                                                 |
| `NX_VEGA_REST`                   | The REST URL for the Vega Data Node                                                                  |
| `NX_EXPLORER_ASSETS`             | Enable the assets page for the explorer                                                              |
| `NX_EXPLORER_GENESIS`            | Enable the genesis page for the explorer                                                             |
| `NX_EXPLORER_GOVERNANCE`         | Enable the governance page for the explorer                                                          |
| `NX_EXPLORER_MARKETS`            | Enable the markets page for the explorer                                                             |
| `NX_EXPLORER_NETWORK_PARAMETERS` | Enable the network parameters page for the explorer                                                  |
| `NX_EXPLORER_PARTIES`            | Enable the parties page for the explorer                                                             |
| `NX_EXPLORER_VALIDATORS`         | Enable the validators page for the explorer                                                          |

## Testing

To run the minimal set of unit tests, run the following:

```bash
yarn nx test explorer
```

To run the UI automation tests with a mocked API, run:

```bash
yarn nx run explorer-e2e:e2e
```
