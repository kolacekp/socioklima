import socioklimaConfig from 'socioklima.config.json';

export function getLicensePrice(country: number, product: number, classesTotal: number, isUnlimited: boolean) {
  const prices = {
    country: {
      '0': {
        product: {
          '0': socioklimaConfig.subscriptions.basic.price.cs.amount,
          '1': socioklimaConfig.subscriptions.detail.price.cs.amount,
          unlimited: socioklimaConfig.subscriptions.unlimited.price.cs.amount
        }
      },
      '1': {
        product: {
          '0': socioklimaConfig.subscriptions.basic.price.sk.amount,
          '1': socioklimaConfig.subscriptions.detail.price.sk.amount,
          unlimited: socioklimaConfig.subscriptions.unlimited.price.sk.amount
        }
      }
    }
  };

  if ((country !== 0 && country !== 1) || (product !== 0 && product !== 1)) {
    return 0;
  }

  if (isUnlimited) {
    return prices.country[country].product.unlimited;
  } else {
    return prices.country[country].product[product] * classesTotal;
  }
}
