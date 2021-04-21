import { flow, includes, prop, map } from 'lodash/fp';
import { getCurrentAccount } from 'shared/selectors/account';
import { features } from 'shared/constants/features';
import { getSelectedFeatures } from 'relient/features';
import { getEntity } from 'relient/selectors';

const filterFeaturesWithPermission = ({ currentRoleKey, permissionEntity, items }) => {
  const result = [];
  items.forEach((item) => {
    if (item.items) {
      const subItems = filterFeaturesWithPermission({
        currentRoleKey,
        permissionEntity,
        items: item.items,
      });
      if (subItems && subItems.length > 0) {
        result.push({
          ...item,
          items: subItems,
        });
      }
    } else if (flow(
      prop(`${item.key}.roleKeys`),
      includes(currentRoleKey),
    )(permissionEntity)) {
      result.push(item);
    }
  });
  return result;
};

export default (state) => {
  const currentAccount = getCurrentAccount(state);
  return {
    currentAccount,
    selectedFeatureKeys: flow(prop('feature'), getSelectedFeatures, map(prop('key')))(state),
    features: filterFeaturesWithPermission({
      currentRoleKey: prop('roleKey')(currentAccount),
      permissionEntity: getEntity('permission')(state),
      items: features,
    }),
  };
};
