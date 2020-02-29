import { integerToDecimal } from '../../utils/currency';
import BaseModel from '../BaseModel';
import { getCurrencyByCode } from '../../data/walletCurrencies';

export default class extends BaseModel {
  get idAttribute() {
    return 'code';
  }

  parse(response = {}) {
    const converted = { ...response };
    this.balanceConversionErrs = this.balanceConversionErrs || {};
    const cur = getCurrencyByCode(response.code);

    converted.confirmed = integerToDecimal(
      response.confirmed,
      cur.coinDivisibility
    );

    converted.unconfirmed = integerToDecimal(
      response.unconfirmed,
      cur.coinDivisibility
    );

    delete converted.currency;

    return converted;
  }
}
