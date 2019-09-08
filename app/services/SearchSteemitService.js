import axios from 'axios';
import qs from 'querystring';

// import { parseDateString } from '../helpers/Formatter';
import model from '../model';

const API_URL = 'https://search.esteem.app/api/search';

const client = axios.create({
  baseURL: API_URL,
  method: 'post',
  headers: {
    Accept: 'application/json',
    // 'Content-Type': 'multipart/form-data',
    'Content-type': 'application/x-www-form-urlencoded',
    Host: 'search.esteem.app',
    Origin: 'https://search.esteem.app',
    Referer: API_URL,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
  },
  // timeout: 1000
});

/**
 *
 * @param {*} query query
 * @param {*} pa page
 * @param {*} so popularity, relevance, newest
 */
export const searchPost = (query = '', page = '1', sort = 'popularity') => {
  const form = {
    q: query,
    pa: page,
    so: sort,
  };
  // console.log(form);
  return client
    .post('', qs.stringify(form))
    .then(({ status, statusText, data }) => {
      console.log('searchPost', status, statusText, data);
      if (status === 200) {
        const {
          hits, // 4532091
          pages, // 226605
          results,
          took, // 0.112
        } = data;

        const items = results.map(
          item =>
            new model.FeedItem({
              app: item.app,
              author: item.author,
              reputation: parseFloat(item.author_rep).toFixed(0),
              body: item.body_marked,
              category: item.category,
              children: item.children,
              created: item.created_at.replace(/\+.*/, ''),
              depth: item.depth,
              post_id: item.id,
              image: item.img_url,
              //   payout: item.payout,
              permlink: item.permlink,
              tags: item.tags,
              title: item.title,
              like: item.up_votes,
              unlike: item.total_votes - item.up_votes,
            }),
        );

        const result = {
          pageableCount: pages,
          totalCount: hits,
          items,
        };

        return result;
      }
      // throw new Error(`${status}:${statusText}`);
      return [];
    });
};
// ({
//   app, //: "busy/2.5.6"
//   author, //: "stackin"
//   author_rep, //: 76.02
//   body, //: "![charles-fuchs-stackin-dmail-eos-new-internet-email-steem-steemit-uptrennd-whaleshares-beta-mail-tokens.jpg](https://ipfs.busy.org/ipfs/QmbsEJctuHHYx3sP7bon9Vya2fisasfVdWeNsp75QvGfrK)↵↵Hey STACKERS!↵↵A few hours ago I came across an interesting blog stating that email is coming to the EOS Blockchain called dMail. About damn time! 💁‍♂️↵↵**What is dMail?** It's email on the EOS blockchain, using (Mail) tokens as a clever way to sign emails and keep the spammers away. 😎 ↵↵The project has yet to launch but they are looking for "Beta Testers" in the coming weeks. dMail will be offering 1000 (MAIL) tokens to everyone who wants to try it out. 📲↵↵I've been waiting a long time for something like this to happen. In other words, I'm just tired of using Gmail as they don't offer any privacy. ↵↵You can sign up for the [dMail Beta testing here...](https://airtable.com/shr6KjmmqCQzsjkpd) (You will need an EOS Account to get on the list).↵↵Keep On STACKIN! 💞 ↵↵~ Charles Fuchs ↵↵For those who's interested in following my "Content" and "Daily" Posts... you can just follow me @stackin to get my updates.↵↵Are you using the Partiko Mobile App? It's one of the fastest ways to post content on the Steem Blockchain. Download the [Partiko App](https://partiko.app/referral/stackin) now and get 1000 Points! ↵↵You Can Follow Me Here:↵↵➡️ Facebook: https://facebook.com/CharlesFuchs↵↵➡️ Twitter: https://twitter.com/CharlesFuchs↵↵➡️ Instagram: https://www.instagram.com/Stackin.co↵↵➡️ Steem: https://steemit.com/@Stackin↵↵➡️ UpTrennd: https://www.uptrennd.com/signup/MTczMg↵↵![charles-fuchs-stackin.jpg](https://ipfs.busy.org/ipfs/QmQhY3zifEtESsTKbNaFc81k3G3TqLSE7mYszqNQDUqFnG)↵↵![charles-fuchs-stackin-10x-lifestyle-steem-steemit-sbd-partiko-busy-social-media-hustle-freedom-goals-success-entrepreneur-investor-business-owner-wealth-marketer-money-success-cryptocurrency-crypto-bitcoin-eos-whale-boss-popular-leader-infl.png](https://ipfs.busy.org/ipfs/QmcoqWfVRe7TecSBngjVm5bQekMPEiAWZ55ckAhymLyYea)↵"
//   body_marked, //: "It's one of the fastest ways to post content on the <mark>Steem</mark> Blockchain. Download the Partiko App now and get 1000 Points!"
//   category, //: "charlesfuchs"
//   children, //: 0
//   created_at, //: "2019-04-10T03:33:24+00:00"
//   depth, //: 0
//   id, //: 72874949
//   img_url, //: "https://ipfs.busy.org/ipfs/QmbsEJctuHHYx3sP7bon9Vya2fisasfVdWeNsp75QvGfrK"
//   payout, //: 0.08
//   permlink, //: "dmail-email-on-the-eos-blockchain"
//   tags, //: (5) ["charlesfuchs", "steem", "dmail", "life", "busy"]
//   title, //: "✴️ DMAIL: EMAIL ON THE EOS BLOCKCHAIN? 📬 "
//   title_marked, //: null
//   total_votes, //: 10
//   up_votes, //: 10
// }) => {
// return {
//   id: String(id),
//   title,
//   author,
//   permlink,
//   summary: body_marked.replace(/<\/?[^>]*>/g, ''),
//   category,
//   comment_count: children,
//   image: img_url,
//   total_payout: payout,
//   // tags,
//   // total_votes: 10
//   vote_count: up_votes,
//   created: parseDateString(`${created_at}Z`),
// };

export const searchAuthor = () => {};
