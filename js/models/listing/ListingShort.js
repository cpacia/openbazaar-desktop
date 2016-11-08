import _ from 'underscore';
import app from '../../app';
import { events as listingEvents } from './';
import BaseModel from '../BaseModel';

export default class extends BaseModel {
  // Needed so this.destroy() will work, since it's
  // a no-op on new models.
  isNew() {
    return false;
  }

  // todo: unit test me
  get shipsFreeToMe() {
    const countries = [];

    app.settings.get('shippingAddresses')
      .forEach(shipAddr => {
        const country = shipAddr.get('country');
        if (country) countries.push(country);
      });

    const country = app.settings.get('country');
    if (country) countries.push(country);

    // countries may have dupes, but it's no bother for this purpose
    return !!_.intersection(this.get('freeShipping'), countries).length;
  }

  // todo: unit testify me
  shipsTo(country) {
    if (!country) {
      throw new Error('Please provide a country.');
    }

    return this.get('shipsTo').indexOf(country) !== -1;
  }

  sync(method, model, options) {
    let returnSync = 'will-set-later';

    if (method === 'delete') {
      options.url = options.url || app.getServerUrl('ob/listing/');
      options.data = JSON.stringify({
        slug: this.get('slug'),
      });
    }

    returnSync = super.sync(method, model, options);

    const eventOpts = {
      xhr: returnSync,
      url: options.url,
      slug: this.get('slug'),
    };

    if (method === 'delete') {
      listingEvents.trigger('destroying', this, eventOpts);

      returnSync.done(() => {
        listingEvents.trigger('destroy', this, eventOpts);
      });
    }

    return returnSync;
  }
}