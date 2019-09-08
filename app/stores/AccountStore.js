import {
  types,
  applySnapshot,
  getSnapshot,
  onSnapshot,
  flow,
  is,
} from 'mobx-state-tree';
import { AsyncStorage } from 'react-native';
import Account from '../models/Account';

const KEY = Object.freeze({
  ACCOUNT: 'ACCOUNT',
});

const AccountStore = types
  .model('AccountStore', {
    account: types.maybeNull(Account),
    loaded: false,
  })
  .views(self => ({
    isExisted() {
      return self.account !== null;
    },
  }))
  .actions(self => ({
    put(account) {
      if (Account.is(account)) {
          self.account = account;
      }
    },
    // 계정 로드
    load: flow(function* load() {
      const accountInfo = yield AsyncStorage.getItem(KEY.ACCOUNT);
      console.log('[AccountStore]', 'accountInfo', accountInfo);
      if (Account.is(accountInfo)) {
        // applySnapshot(self.account, accountInfo);
        self.account = Account.create(accountInfo);
      }
      self.loaded = true;
    }),
    // 계정 저장
    save: flow(function* save() {
      const snapshot = getSnapshot(self.account);
      yield AsyncStorage.setItem(KEY.ACCOUNT, JSON.stringify(snapshot));
    }),
    remove() {
      // ..
    },
    afterCreate() {
      self.load();
    },
  }));

export default AccountStore;
