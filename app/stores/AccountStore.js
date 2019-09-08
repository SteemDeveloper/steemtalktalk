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
      console.log('[AccountStore]', 'storedAccount', accountJson);
      const accountJson = JSON.parse(storedAccount);
      if (Account.is(accountJson)) {
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
      // onSnapshot(self, snapshot => {
      //   AsyncStorage.setItem(KEY.ACCOUNT, JSON.stringify(snapshot));
      // });
    },
    addAccount(account) {
      console.log('[AccountStore][addAccount]', Account.is(account));
      if (Account.is(account)) {
        // applySnapshot(self.account, account)
        self.account = Account.create(account);
      }
    },
  }));

export default AccountStore;
