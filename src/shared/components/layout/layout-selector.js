import { filter, flow, includes, prop, map } from 'lodash/fp';
import { getCurrentAccount } from 'shared/selectors/account';
import { features, getSelectedFeatures } from 'shared/constants/features';
import { getEntity } from 'relient/selectors';

export default (state) => ({
  currentAccount: getCurrentAccount(state),
  selectedFeatureKeys: flow(prop('global.feature'), getSelectedFeatures, map(prop('key')))(state),
  features: flow(
    map(({ items, ...others }) => ({
      ...others,
      items: items && filter(({ key }) => flow(
        getEntity(`permission.${key}.roleKeys`),
        includes(flow(getCurrentAccount, prop('roleKey'))(state)),
      )(state))(items),
    })),
    filter(({ items }) => !items || items.length > 0),
  )(features),
});
