import _ from 'lodash';
import axios from 'axios';
// import { Platform } from 'react-native';
import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer,
} from 'axios-extensions';
// import { setup, setupCache } from 'axios-cache-adapter';

import model from '../model';

import { getReputation } from '../helpers/Formatter';
import { parsePosts, parsePost } from '../helpers/PostParser';
import config from '../config';

const STEEM_API_URL = 'https://api.steemit.com';
// const SCOT_API_URL = 'https://scot-api.steem-engine.com';
// const FILTER_SCOT_SYMBOL = ['SCT', 'AAA'];

// Create `axios-cache-adapter` instance
// const cache = setupCache({
//   maxAge: 1 * 60 * 1000,
// });

// const client = axios.create({
//   adapter: cache.adapter,
//   baseURL: STEEM_API_URL,
//   method: 'post',
//   headers: { 'Content-Type': 'application/json; charset=utf-8' },
// });
// const client = setup({
//   // `axios` options
//   baseURL: STEEM_API_URL,
//   method: 'post',
//   headers: { 'Content-Type': 'application/json; charset=utf-8' },
//   // `axios-cache-adapter` options
//   cache: {
//     maxAge: 1 * 60 * 1000,
//   },
// });
const client = axios.create({
  baseURL: STEEM_API_URL,
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json; charset=utf-8',
  },
  // adapter: throttleAdapterEnhancer(
  //   cacheAdapterEnhancer(axios.defaults.adapter),
  // ),
});

function call(api, method, params = []) {
  // console.log({ api, method, params });
  const request = {
    id: '0',
    jsonrpc: '2.0',
    method: 'call',
    params: [api, method, params],
  };
  const body = JSON.stringify(request, (key, value) => {
    if (typeof value === 'object' && value.type === 'Buffer') {
      return Buffer.from(value.data).toString('hex');
    }
    return value;
  });
  // console.log(body);
  return client.post('', body).then(({ status, statusText, data }) => {
    // console.log(data);
    if (status === 200) {
      if (data.error)
        throw new Error(`${data.error.code}:${data.error.message}`);
      if (data.result.error)
        throw new Error(
          `${data.result.error.code}:${data.result.error.message}`,
        );
      return data.result;
    }
    throw new Error(`${status}:${statusText}`);
  });
}

/**
 * 계정 조회
 * @param {*} username
 */
export const getAccount = username => {
  return call('database_api', 'get_accounts', [[username]]);
};

export const getFollowCount = username => {
  return call('database_api', 'get_follow_count', [username]);
};

export const getAccountHistory = (username, start = -1, limit = 100) => {
  return call('condenser_api', 'get_account_history', [username, start, limit]);
};

export const getContent = (author, permlink, username) => {
  return call('condenser_api', 'get_content', [author, permlink]).then(
    post => new model.PostContent(post, username),
  );
};

export const getState = path => {
  return call('condenser_api', 'get_state', [path]);
};

export const getDynamicGlobalProperties = () => {
  return call('database_api', 'get_dynamic_global_properties', []);
};

export const getDiscussions = (
  by = 'created', // trending|hot|created|promoted
  // eslint-disable-next-line camelcase
  { tag, limit = 20, start_author, start_permlink, truncate_body = 0 },
  username,
) => {
  return call('condenser_api', `get_discussions_by_${by}`, [
    { tag, limit, start_author, start_permlink, truncate_body },
  ]).then(r => r.map(e => new model.FeedItem(e, username)));
};

export const getDiscussionsByCreated = (opts, username) => {
  return getDiscussions('created', opts, username);
};

export const getDiscussionsByPromoted = (opts, username) => {
  return getDiscussions('promoted', opts, username);
};

export const getDiscussionsByHot = (opts, username) => {
  return getDiscussions('hot', opts, username);
};

export const getFeeds = (opts, username) => {
  return getDiscussions('feed', opts, username);
};

export const getTrending = (opts, username) => {
  return getDiscussions('trending', opts, username);
};

export const getBlog = (opts, username) => {
  return getDiscussions('blog', opts, username);
};

export const getFollowing = (username, start, limit = 1000, type = 'blog') => {
  return call('condenser_api', 'get_following', [
    username,
    start,
    type,
    limit,
  ]).then(followings => followings.map(({ following }) => following));
};

export const getFollower = (username, start, limit = 1000, type = 'blog') => {
  return call('condenser_api', 'get_followers', [
    username,
    start,
    type,
    limit,
  ]).then(followers => followers.map(({ follower }) => follower));
};

export const getTrendingTags = async (tag, limit = 20) => {
  try {
    return await call('condenser_api', 'get_trending_tags', [tag, limit]);
  } catch (error) {
    throw error;
  }
};

export const getHotUsers = (tag = '', limit = 20) => {
  return getDiscussions('hot', { tag, limit }).then(r => {
    const user = r.map(({ author, author_reputation }) => ({
      author,
      reputation: getReputation(author_reputation),
    }));
    return _.uniqBy(user, 'author');
  });
};

export const getTrendingUsers = (tag = '', limit = 20) => {
  return getDiscussions('trending', { tag, limit }).then(r => {
    return r.map(({ author, author_reputation }) => ({
      author,
      reputation: getReputation(author_reputation),
    }));
  });
};

/**
 * @method getPosts get posts method
 * @param by get discussions by trending, created, active etc.
 * @param query tag, limit, start_author?, start_permalink?
 */
export const getPosts = async (by = 'feed', query, user) => {
  try {
    let posts = await getDiscussions(by, query);
    if (posts) {
      posts = await parsePosts(posts, user, false);
    }
    return posts;
  } catch (error) {
    return error;
  }
};

// export const getAccount = user => new Promise((resolve, reject) => {
//   try {
//     const account = client.database.getAccounts([user]);
//     resolve(account);
//   } catch (error) {
//     reject(error);
//   }
// });

/**
 * @method getUser get account data
 * @param user username
 */
export const getUser = async user => {
  try {
    const account = await client.database.getAccounts([user]);

    if (account && account.length < 1) return null;

    // get global properties to calculate Steem Power
    const globalProperties = await client.database.getDynamicGlobalProperties();
    const rcPower = await client.call('rc_api', 'find_rc_accounts', {
      accounts: [user],
    });
    const unreadActivityCount = await getUnreadActivityCount({ user });

    account[0].reputation = getReputation(account[0].reputation);
    account[0].username = account[0].name;
    account[0].unread_activity_count = unreadActivityCount;
    account[0].rc_manabar = rcPower.rc_accounts[0].rc_manabar;
    account[0].steem_power = await vestToSteem(
      account[0].vesting_shares,
      globalProperties.total_vesting_shares,
      globalProperties.total_vesting_fund_steem,
    );
    account[0].received_steem_power = await vestToSteem(
      account[0].received_vesting_shares,
      globalProperties.total_vesting_shares,
      globalProperties.total_vesting_fund_steem,
    );
    account[0].delegated_steem_power = await vestToSteem(
      account[0].delegated_vesting_shares,
      globalProperties.total_vesting_shares,
      globalProperties.total_vesting_fund_steem,
    );

    account[0].about =
      account[0].json_metadata && JSON.parse(account[0].json_metadata);
    account[0].avatar = getAvatar(account[0].about);
    account[0].display_name = getName(account[0].about);

    return account[0];
  } catch (error) {
    return Promise.reject(error);
  }
};

// get_discussions_by_comments

// ---------
// https://developers.steem.io/apidefinitions/#apidefinitions-condenser-api

// # condenser_api.get_account_count
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_account_count", "params":[], "id":1}' https://api.steemit.com

// # condenser_api.get_account_history
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_account_history", "params":["steemit", 1000, 1000], "id":1}' https://api.steemit.com
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_account_history", "params":["steemit", -1, 10000], "id":1}' https://api.steemit.com

// condenser_api.get_account_reputations
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_account_reputations", "params":["steemit", 1], "id":1}' https://api.steemit.com
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_account_reputations", "params":["a", 10], "id":1}' https://api.steemit.com

// # condenser_api.get_account_votes
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_account_votes", "params":["steemit"], "id":1}' https://api.steemit.com
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_account_votes", "params":["alice"], "id":1}' https://api.steemit.com

// # condenser_api.get_accounts
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_accounts", "params":[["steemit"]], "id":1}' https://api.steemit.com
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_accounts", "params":[["steemit", "alice"]], "id":1}' https://api.steemit.com

// # condenser_api.get_active_votes
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_active_votes", "params":["steemit", "firstpost"], "id":1}' https://api.steemit.com
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_active_votes", "params":["alice", "a-post-by-alice"], "id":1}' https://api.steemit.com

// # condenser_api.get_active_witnesses
// curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_active_witnesses", "params":[], "id":1}' https://api.steemit.com

/*
// 리스팀 조회하기
function getResteem(author, permlink) {
  return call_steemit('follow_api.get_reblogged_by', [author, permlink]).result;
}

// 댓글 조회하기
function getComments(author, permlink) {
  return call_steemit('condenser_api.get_content_replies', [author, permlink]).result;
}

// 글 내용 조회하기
function getContent(author, permlink) {
  return call_steemit('condenser_api.get_content', [author, permlink]).result;
}

// 큐레이터 조회하기
function getVotes(link) {
  return call_steemit('condenser_api.get_active_votes', [author, permlink]).result;
} */

// ==========================
// SCOT API
// ==========================

// enhance the original axios adapter with throttle and cache enhancer
const scotClient = axios.create({
  baseURL: 'https://scot-api.steem-engine.com',
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json; charset=utf-8',
  },
  // adapter: throttleAdapterEnhancer(
  //   cacheAdapterEnhancer(axios.defaults.adapter),
  // ),
});

const scotCall = (path, params) => {
  console.log('[SteemService]', 'scotCall', { path, params: _.pickBy(params) });
  return scotClient
    .get(path, {
      params: _.pickBy(params),
    })
    .then(r => {
      console.log('scotCall', path, params, r);
      return r;
    })
    .then(r => r.data)
    .catch(err => {
      console.error(`Could not fetch data, url: ${path}`, err);
      return null;
    });
};

export const getScotConfig = token => {
  console.log('[SteemService]', 'getScotConfig', 'token', token);
  return scotCall('config', {
    token,
  }).then(r => {
    console.log('[SteemService]', 'getScotConfig', r);
    if (Array.isArray(r)) {
      return r.map(e => new model.ScotConfig(e));
    }
    return new model.ScotConfig(r);
  });
};

export const getScotInfo = token => {
  return scotCall('info', {
    token,
  });
};

export const getScotDiscussions = (
  feedType = 'created', // trending|hot|created|promoted
  // eslint-disable-next-line camelcase
  { token, limit = 20, start_author, start_permlink },
) => {
  return scotCall(`get_discussions_by_${feedType}`, {
    token,
    limit,
    start_author,
    start_permlink,
  }).then(r =>
    r.map(e => {
      console.log(e);
      return new model.FeedItem(e);
    }),
  );
};

// https://scot-api.steem-engine.com/get_discussions_by_created?token=AAA&limit=11&start_author=start_permlink=
export const getScotDiscussionsByCreated = opts => {
  return getScotDiscussions('created', opts);
};

export const getScotDiscussionsByPromoted = opts => {
  return getScotDiscussions('promoted', opts);
};

// https://scot-api.steem-engine.com/get_discussions_by_hot?token=SCT&limit=20&tag=blockchain
export const getScotDiscussionsByHot = opts => {
  return getScotDiscussions('hot', opts);
};

export const getScotAccount = username => {
  return scotCall(`@${username}`);
  // .filter(val => FILTER_SCOT_SYMBOL.includes(symbol));
};

// ref: https://github.com/g6ling/React-Native-Tips/tree/master/How_to_upload_photo%2Cfile_in%20react-native
export const uploadImage = photo => {
  const data = new FormData();

  // data.append('type', 'file');
  // data.append('image', {
  //   name: photo.fileName,
  //   type: photo.type,
  //   uri:
  //     Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  // });

  data.append('image', photo.data);
  data.append('type', 'base64');
  data.append('name', photo.fileName);
  data.append('title', photo.fileName);

  console.log('data', data);

  // Object.keys(body).forEach(key => {
  //   data.append(key, body[key]);
  // });

  // A binary file, base64 data, or a URL for an image. (up to 10MB)
  return axios
    .post('https://api.imgur.com/3/image', data, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Client-ID ${config.IMGUR_CLIENT_ID}`,
      },
    })
    .then(r => r.data)
    .then(r => {
      if (r.success) {
        return r.data.link;
      }
      return '';
    })
    .catch(err => {
      console.log(err);
      return '';
    });

  // return fetch(
  //   'https://steemitimages.com/pigoncchio/1f6191595362950d86f0385754f46c274fb4f3f3ed8d37392a81d3649d61c7e7dc7b2e810cfaa2de348ed0d6e5b68c078f9a63ffff473f804d0b539bf22c40b545',
  //   {
  //     method: 'POST',
  //     body: data,
  //   },
  // )
  //   .then(response => response.json())
  //   .then(response => {
  //     console.log('upload succes', response);
  //     // alert('Upload success!');
  //     // this.setState({ photo: null });
  //     return response;
  //   })
  //   .catch(error => {
  //     console.log('upload error', error);
  //     // alert('Upload failed!');
  //   });
};
