import { types } from 'mobx-state-tree';

const Account = types
  .model('Account', {
    id: types.identifier,
    type: types.string,
    username: types.string,
    accessToken: types.string,
    expiresIn: types.number,
    issuedAt: types.number,
  })
  .views(self => ({
    // 유효기간 만료 체크
    get isExpired() {
      const currentTime = Math.round(Date.now() / 1000); // 현재 시간
      return Boolean(self.issuedAt + self.expiresIn <= currentTime);
    },
  }));

export default Account;
