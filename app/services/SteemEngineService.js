import SSC from 'sscjs';
import axios from 'axios';
// import { cacheAdapterEnhancer } from 'axios-extensions';

const NETWORK = process.env.NETWORK || 'livenet';
const URL = {
  testnet: 'https://testapi.steem-engine.com',
  livenet: 'https://api.steem-engine.com/rpc/',
};

// var ssc = new SSC('https://api.steem-engine.com/rpc/');
const ssc = new SSC(URL[NETWORK]);
// ssc.getLatestBlockInfo((err, result) => {
// 	console.log(err, result);
// });

// const client = axios.create({
//   baseURL: 'https://api.steem-engine.com/rpc/contracts',
//   method: 'POST',
//   headers: {
//     'content-type': 'application/json',
//   },
// });

const http = axios.create({
  baseURL: 'https://scot-api.steem-engine.com',
  // cacheAdapterEnhancer 적용. 기본 캐시동작은 해제
  // adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
  //   enabledByDefault: false,
  // }),
});

// example
// ssc.getTokensBalances = (username) => {
// 	return ssc.find('tokens', 'tokens', {
// 			account: username
// 		}, 1000, 0, [])
// };

// ssc.find('tokens', 'tokens', { }).then(r => console.log(r)); // 몽땅 조회
// ssc.findOne('tokens', 'tokens', { symbol }).then(r => console.log(r));
export const getScotConfig = (path = 'config') =>
  http.get(`/${path}`).then(r => r.data);

export const getPrice = () =>
  axios.get('https://postpromoter.net/api/prices').then(r => r.data);

export const findTokens = ({
  query = {},
  limit = 1000,
  offset = 0,
  indexes = [],
}) => {
  // return new Promise((resolve, reject) => {
  return ssc.find(
    'tokens',
    'tokens',
    query,
    limit,
    offset,
    indexes,
    // (err, result) => {
    //   if (err) return reject(err);
    //   resolve(result);
    // }
  );
  // });
};

// await fetch('https://api.steem-engine.com/rpc/contracts', { method:'POST', headers:{'content-type':'application/json'},body:JSON.stringify({"jsonrpc":"2.0","id":7,"method":"find","params":{"contract":"market","table":"metrics","query":{$or:[{symbol:"SCT"},{symbol:"AAA"}]},"limit":1000,"offset":0,"indexes":""}})}).then(r=>r.json()).then(r=>r.result)
export const findMarketMetrics = (
  symbols,
  limit = 1000,
  offset = 0,
  opts = [],
) => {
  // const whereORQuery = symbols.map(symbol => ({
  //   symbol,
  // }));
  // const query = symbols.length ? { $or: whereORQuery } : {};
  let query = {};
  if (Array.isArray(symbols)) {
    query = { symbol: { $in: symbols } };
  } else if (typeof symbols === 'string') {
    query = { symbol: symbols };
  } else if (symbols) {
    query = symbols;
  }
  return ssc.find('market', 'metrics', query, limit, offset, opts);
};

// 토큰 잔액 조회
export const findTokenBalance = (
  query = { symbol: 'ZZAN' },
  limit = 1000,
  offset = 0,
  indexes = [],
) => {
  return new Promise((resolve, reject) => {
    ssc.find(
      'tokens',
      'balances',
      query,
      limit,
      offset,
      indexes,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};

// 모든 토큰 잔액 조회
export const findAllTokenBalance = async (symbol = 'ZZAN') => {
  const query = { symbol };
  let result = [];
  const limit = 1000;
  for (let offset = 0; ; offset += limit) {
    const balances = await findTokenBalance(query, limit, offset);
    result = result.concat(balances);
    if (balances.length < limit) break;
  }
  return result;
};

export const findBuyBook = ({
  query = { symbol: 'ZZAN' },
  limit = 1000,
  offset = 0,
  indexes = [],
}) => {
  return new Promise((resolve, reject) => {
    ssc.find(
      'market',
      'buyBook',
      query,
      limit,
      offset,
      indexes,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};
export const findSellBook = ({
  query = { symbol: 'ZZAN' },
  limit = 1000,
  offset = 0,
  indexes = [],
}) => {
  return new Promise((resolve, reject) => {
    ssc.find(
      'market',
      'sellBook',
      query,
      limit,
      offset,
      indexes,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};

export const findTradesHistory = ({
  query = { symbol: 'ZZAN' },
  limit = 1000,
  offset = 0,
  indexes = [],
}) => {
  return new Promise((resolve, reject) => {
    ssc.find(
      'market',
      'tradesHistory',
      query,
      limit,
      offset,
      indexes,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};

// 임대 정보 조회
export const findTokenDelegations = username => {
  return ssc.find('tokens', 'delegations', {
    $or: [{ from: username }, { to: username }],
  });
};

export default ssc;
