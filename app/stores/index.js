// import makeInspectable from 'mobx-devtools-mst'; // 앱이 느려져서 일단 주석 처리, 필요할때만 사용하자.
import { types } from 'mobx-state-tree';

import AccountStore from './AccountStore';

const StoreStore = types
  .model('RootStore', {
    accountStore: types.maybe(AccountStore),
  })
  .views(self => ({
    isReady() {
      return self.accountStore && self.accountStore.loaded;
    },
  }));

const stores = StoreStore.create({
  accountStore: AccountStore.create(),
});

export default stores;

// makeInspectable(stores);
