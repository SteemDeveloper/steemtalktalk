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
    get isExist() {
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
      const storedAccount = yield AsyncStorage.getItem(KEY.ACCOUNT);
      console.log('[AccountStore]', 'storedAccount', storedAccount);
      if (Account.is(storedAccount)) {
        // applySnapshot(self.account, accountInfo);
        const accountJson = JSON.parse(storedAccount);
        self.account = Account.create(accountJson);
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
