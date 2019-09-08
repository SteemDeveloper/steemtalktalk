import _ from 'lodash';
import axios from 'axios';

// ref: https://github.com/steemscript/steemconnect.js
import steemconnect from 'steemconnect';
import { SC2_APP_ID, SC2_CALLBACK_URL } from '../config';

console.log('process.env:', process.env);
// steemconnect.Client();
const sc2 = steemconnect.Initialize({
  app: SC2_APP_ID,
  callbackURL: SC2_CALLBACK_URL,
  // accessToken: tokens.access_token,
  scope: [
    'vote',
    'comment',
    'delete_comment',
    'comment_options',
    'custom_json',
    'claim_reward_balance',
    // 'offline'
  ],
});

export const commentWithOption = (
  parentAuthor,
  parentPermlink,
  author,
  permlink,
  title,
  body,
  jsonMetadata,
  selectedPayoutOption,
) => {
  if (selectedPayoutOption) {
    const commentParams = {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author,
      permlink,
      title,
      body,
      json_metadata: jsonMetadata,
    };
    const commentOptionParams = {
      author,
      permlink,
      max_accepted_payout:
        selectedPayoutOption === 2 ? '0.000 SBD' : '1000000.000 SBD', // 보상 거절
      percent_steem_dollars: selectedPayoutOption === 1 ? 0 : 10000, // 100% 보팅 파워
      allow_votes: true,
      allow_curation_rewards: true,
      extensions: [
        // [
        //   0,
        //   {
        //     beneficiaries: [
        //       { account: 'null', weight: 5000 }
        //     ],
        //   },
        // ],
      ],
    };
    const operations = [
      ['comment', commentParams],
      ['comment_options', commentOptionParams],
    ];
    console.log('comment_options', operations);
    return sc2.broadcast(operations);
  }
  return sc2.comment(
    parentAuthor,
    parentPermlink,
    author,
    permlink,
    title,
    body,
    jsonMetadata,
  );
  /*
    {
      returle: {
        block_num: 34253976
        expiration: "2019-06-30T14:10:54"
        expired: false
        extensions: []
        id: "bee1365bf8f6d4e0e30e83edb060a06ccda01da9"
        operations: [Array(2)]
        ref_block_num: 44162
        ref_block_prefix: 3373995618
        signatures: ["1f1716bab0b6c8a8482dbfb51b059cd0e77d66657c51a7a98e…37f1f96bb9cc92f08a1004eb044ad331efe7116c62df71942"]
        trx_num: 12
      }
    }
  */
};

export default sc2;
