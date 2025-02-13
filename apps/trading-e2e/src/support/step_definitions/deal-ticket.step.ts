import { Then, When } from 'cypress-cucumber-preprocessor/steps';
import DealTicket from '../trading-windows/deal-ticket';

const dealTicket = new DealTicket();

When('I place a buy {string} market order', (orderType) => {
  dealTicket.placeMarketOrder(true, '100', orderType);
  dealTicket.clickPlaceOrder();
});

When('I place a sell {string} market order', (orderType) => {
  dealTicket.placeMarketOrder(false, '100', orderType);
  dealTicket.clickPlaceOrder();
});

When('I place a buy {string} limit order', (limitOrderType) => {
  dealTicket.placeLimitOrder(true, '100', '2000', limitOrderType);
  dealTicket.clickPlaceOrder();
});

When('I place a sell {string} limit order', (limitOrderType) => {
  dealTicket.placeLimitOrder(false, '100', '2000', limitOrderType);
  dealTicket.clickPlaceOrder();
});

When('I place a buy {string} market order with amount of 0', (orderType) => {
  dealTicket.placeMarketOrder(true, '0', orderType);
  dealTicket.clickPlaceOrder();
});

Then('order request is sent', () => {
  dealTicket.verifyOrderRequestSent();
});

Then('error message for insufficient funds is displayed', () => {
  dealTicket.verifyOrderFailedInsufficientFunds();
});

Then('place order button is disabled', () => {
  dealTicket.verifyPlaceOrderBtnDisabled();
});

Then('{string} error is shown', (errorMsg) => {
  dealTicket.verifySubmitBtnErrorText(errorMsg);
});

Then(
  'Order rejected by wallet error shown containing text {string}',
  (expectedError) => {
    dealTicket.verifyOrderRejected(expectedError);
  }
);
