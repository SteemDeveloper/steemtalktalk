import axios from 'axios';

const STEEM_API_URL = 'https://api.steemit.com';

const client = axios.create({
  baseURL: STEEM_API_URL,
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json; charset=utf-8',
  },
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

export const getDiscussions = (
  by = 'created', // trending|hot|created|promoted
  // eslint-disable-next-line camelcase
  { tag, limit = 20, start_author, start_permlink, truncate_body = 0 },
) => {
  return call('condenser_api', `get_discussions_by_${by}`, [
    { tag, limit, start_author, start_permlink, truncate_body },
  ]);
};
