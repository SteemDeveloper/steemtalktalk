import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

import model from '../model';

const KEY = Object.freeze({
  ACCOUNTS: 'ACCOUNTS',
  LAST_USED_ACCOUNT: 'LAST_USED_ACCOUNT',
  IS_SHOW_EXIST_BALANCE: 'IS_SHOW_EXIST_BALANCE',
});

class StorageService {
  // 가장 최근에 사용한 사용자 이름 조회
  static getLastUsedAccount = () => AsyncStorage.getItem(KEY.LAST_USED_ACCOUNT);

  static setLastUsedAccount = username =>
    AsyncStorage.setItem(KEY.LAST_USED_ACCOUNT, username);

  // 저장된 계정 조회하기
  static getAccounts = async () => {
    const accounts = await AsyncStorage.getItem(KEY.ACCOUNTS);
    const parsedAccounts = JSON.parse(accounts || '[]');
    return parsedAccounts.map(item => model.Account.fromObject(item));
  };

  static setAccounts = accounts => {
    return AsyncStorage.setItem(KEY.ACCOUNTS, JSON.stringify(accounts));
  };

  static addAccount = async newAccount => {
    const accounts = await this.getAccounts();
    accounts.push(newAccount);
    // return this.setAccounts(accounts);
    return AsyncStorage.setItem(KEY.ACCOUNTS, JSON.stringify(accounts));
  };

  static removeAccount = async username => {
    const accounts = await this.getAccounts();
    console.log('removeAccount', 'accounts', accounts);
    const removedAccounts = accounts.filter(
      account => account.username !== username,
    );
    console.log('removeAccount', 'removedAccounts', removedAccounts);
    return AsyncStorage.setItem(KEY.ACCOUNTS, JSON.stringify(removedAccounts));
  };

  static getAllAcountInfo = async () => {
    const [
      [a, accounts = '[]'],
      [b, lastUsedAccount = ''],
    ] = await AsyncStorage.multiGet([KEY.ACCOUNTS, KEY.LAST_USED_ACCOUNT]);
    console.log('[StorageService]', 'getAllAcountInfo', {
      accounts,
      lastUsedAccount,
    });
    const parsedAccounts = JSON.parse(accounts || '[]');
    // .map(item =>
    //   model.Account.fromObject(item),
    // );
    return {
      accounts: parsedAccounts,
      lastUsedAccount: lastUsedAccount
        ? lastUsedAccount
        : parsedAccounts.length
        ? parsedAccounts[0].username // 마지막 사용한 계정이 저장되어 있지 않으면 첫번째 계정 선택
        : '',
    };
  };

  static setAllAcountInfo = ({ accounts = [], lastUsedAccount = '' }) => {
    return AsyncStorage.multiSet([
      [KEY.ACCOUNTS, JSON.stringify(accounts)],
      [KEY.LAST_USED_ACCOUNT, lastUsedAccount],
    ]);
  };

  static removeAllAcountInfo = () => {
    return AsyncStorage.multiRemove([KEY.ACCOUNTS, KEY.LAST_USED_ACCOUNT]);
  };

  // eslint-disable-next-line max-len
  static setIsShowExistBalance = value =>
    AsyncStorage.setItem(KEY.IS_SHOW_EXIST_BALANCE, String(value));

  // eslint-disable-next-line max-len
  static getIsShowExistBalance = () =>
    AsyncStorage.getItem(KEY.IS_SHOW_EXIST_BALANCE).then(value =>
      Boolean(value || 0),
    );
}

// // eslint-disable-next-line max-len
// export const setIsShowExistBalance = value =>
//   AsyncStorage.setItem(KEY.IS_SHOW_EXIST_BALANCE, String(value));

// // eslint-disable-next-line max-len
// export const getIsShowExistBalance = () =>
//   AsyncStorage.getItem(KEY.IS_SHOW_EXIST_BALANCE).then(value =>
//     Boolean(value || 0),
//   );

export default StorageService;
