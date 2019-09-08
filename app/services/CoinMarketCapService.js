import axios from 'axios';

const client = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com',
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    'X-CMC_PRO_API_KEY': 'c62bf3b7-a4ab-4be3-9c42-efc34032fea4',
  },
});

export const getCryptocurrencyInfo = id => {
  return client({
    url: '/v1/cryptocurrency/info',
    data: `id=${id.join(',')}`,
  });
};

// curl -H "X-CMC_PRO_API_KEY: c62bf3b7-a4ab-4be3-9c42-efc34032fea4" -H "Accept: application/json" -d "start=1&limit=1&convert_id=1,2781" -G https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest
export const getLastestCryptocurrency = (id = [1230, 1312]) => {
  console.log('getLastestCryptocurrency', id);
  return client
    .get('/v1/cryptocurrency/quotes/latest', {
      params: { id: id.join(',') },
    })
    .then(r => r.data)
    .then(r => {
      console.log('getLastestCryptocurrency', r);
      if (r.status && r.status.error_code === 0) {
        return r.data;
      }
      return null;
    })
    .catch(err => console.log('error', err, this));
};

/*
{
    "status": {
        "timestamp": "2019-06-28T12:19:17.260Z",
        "error_code": 0,
        "error_message": null,
        "elapsed": 7,
        "credit_count": 1
    },
    "data": {
        "1230": {
            "id": 1230,
            "name": "Steem",
            "symbol": "STEEM",
            "slug": "steem",
            "circulating_supply": 318338512.077,
            "total_supply": 335312606.077,
            "max_supply": null,
            "date_added": "2016-04-18T00:00:00.000Z",
            "num_market_pairs": 31,
            "tags": [],
            "platform": null,
            "cmc_rank": 75,
            "last_updated": "2019-06-28T12:19:02.000Z",
            "quote": {
                "USD": {
                    "price": 0.372796428152,
                    "volume_24h": 2125614.19262584,
                    "percent_change_1h": -0.267421,
                    "percent_change_24h": -0.991954,
                    "percent_change_7d": -5.31153,
                    "market_cap": 118675460.24552792,
                    "last_updated": "2019-06-28T12:19:02.000Z"
                }
            }
        },
        "1312": {
            "id": 1312,
            "name": "Steem Dollars",
            "symbol": "SBD",
            "slug": "steem-dollars",
            "circulating_supply": 9022169.848,
            "total_supply": 9022169.848,
            "max_supply": null,
            "date_added": "2016-07-18T00:00:00.000Z",
            "num_market_pairs": 9,
            "tags": [],
            "platform": null,
            "cmc_rank": 370,
            "last_updated": "2019-06-28T12:19:02.000Z",
            "quote": {
                "USD": {
                    "price": 1.00383395452,
                    "volume_24h": 1273225.57006454,
                    "percent_change_1h": -0.353955,
                    "percent_change_24h": 1.18478,
                    "percent_change_7d": -0.619859,
                    "market_cap": 9056760.436868945,
                    "last_updated": "2019-06-28T12:19:02.000Z"
                }
            }
        }
    }
}*/

// curl -H "X-CMC_PRO_API_KEY: c62bf3b7-a4ab-4be3-9c42-efc34032fea4" -H "Accept: application/json" -d "id=1230,1312" -G https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest

// curl -H "X-CMC_PRO_API_KEY: c62bf3b7-a4ab-4be3-9c42-efc34032fea4" -H "Accept: application/json" -d "symbol=STEEM,SBD" -G https://pro-api.coinmarketcap.com/v1/cryptocurrency/map
