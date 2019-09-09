import { types } from 'mobx-state-tree';

const Beneficiary = types.model('Beneficiaries', {
  account: types.string, // "sct.krwp"
  weight: types.number, // 10000
});

const ActiveVote = types.model('ActiveVote', {
  percent: types.string, // "2500"
  // reputation: 0
  rshares: types.string, // "9323930664"
  voter: types.string, // "helle"
});

// const json_metadata = ty

const Post = types
  .model('Post', {
    post_id: types.identifierNumber, // 79852335
    author: types.string, // "deer3"
    author_reputation: types.number, // 87992254356910
    beneficiarie: types.array(Beneficiary),
    body: types.string,
    cashout_time: types.string, // "2019-09-16T14:09:30"
    category: types.string, // "sct"
    children: types.number, // 1
    created: types.string, // "2019-09-09T14:09:30"
    curator_payout_value: types.string, // "0.000 SBD"
    depth: types.number, // 0
    json_metadata: types.string,
    // json_metadata: "{"tags":["sct","sct-kr","sct-mining","zzan","liv","jjm","palnet","steemleo","bs","union"],"image":["https:\/\/cdn.steemitimages.com\/DQmQnDxeAX8tCGgsqLJGgQH19rGYH4PUth2GBL6CDMmDLpJ\/image.png"],"app":"steemcoinpan\/0.1","format":"markdown"}"
    last_payout: types.string, // "1969-12-31T23:59:59"
    last_update: types.string, // "2019-09-09T14:09:30"
    max_accepted_payout: types.string, // "1000000.000 SBD"
    net_rshares: types.number, // 10771633708243
    parent_author: types.string, // ""
    parent_permlink: types.string, // "sct"
    pending_payout_value: types.string, // "3.857 SBD"
    percent_steem_dollars: types.number, // 10000
    permlink: types.string, // "winners-9-1"
    promoted: types.string, // "0.000 SBD"
    // replies: []
    root_title: types.string, // "Winners 풀 9월 1주차 정산/분배 내역 등"
    title: types.string, // "Winners 풀 9월 1주차 정산/분배 내역 등"
    total_payout_value: types.string, //  "0.000 SBD"
    url: types.string, // "/sct/@deer3/winners-9-1"
    active_votes: types.array(ActiveVote),
  })
  .views(self => ({
    get avatar() {
      return `https://steemitimages.com/u/${self.author}/avatar`;
    },
    get time() {
      return new Date(`${self.created}Z`).toLocaleString();
    },
    get reputation() {
      const result =
        Math.max(Math.log10(Math.abs(self.author_reputation)) - 9, 0) *
          (self.author_reputation >= 0 ? 1 : -1) *
          9 +
        25;
      return parseInt(result);
    },
    get likes() {
      return self.active_votes.filter(({ rshares }) => Number(rshares) > 0)
        .length;
    },
    // get url() {
    //   return `/${self.category}/@${self.author}/${self.permlink}`;
    // },
  }));

export default Post;
