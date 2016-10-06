import app from '../../app';
import BaseModel from '../BaseModel';
import Item from './Item';
import Metadata from './Metadata';
import is from 'is_js';

export default class extends BaseModel {
  url() {
    // url is handled by sync, but backbone bombs if I don't have
    // something explicitly set
    return 'use-sync';
  }

  get nested() {
    return {
      item: Item,
      metadata: Metadata,
    };
  }

  get refundPolicyMaxLength() {
    return 10000;
  }

  validate(attrs) {
    let errObj = {};
    const addError = (fieldName, error) => {
      errObj[fieldName] = errObj[fieldName] || [];
      errObj[fieldName].push(error);
    };

    if (is.not.string(attrs.slug)) {
      addError('slug', 'Please provide a slug as a string.');
    } else if (!attrs.slug) {
      addError('slug', app.polyglot.t('listingInnerModelErrors.provideSlug'));
    }

    if (attrs.refundPolicy) {
      if (is.not.string(attrs.refundPolicy)) {
        addError('refundPolicy', 'The return policy must be of type string.');
      } else if (attrs.refundPolicy.length > this.refundPolicyMaxLength) {
        // addError('refundPolicy', app.polyglot.t('itemModelErrors.descriptionTooLong'));
        addError('refundPolicy', 'Return policy too long (translate me) slick willy!');
      }
    }

    errObj = this.mergeInNestedModelErrors(errObj);

    if (Object.keys(errObj).length) return errObj;

    return undefined;
  }
}