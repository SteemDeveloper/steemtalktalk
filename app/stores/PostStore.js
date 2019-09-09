import {
  types,
  applySnapshot,
  getSnapshot,
  onSnapshot,
  flow,
} from 'mobx-state-tree';

// import Account from '../models/Account';
import Post from '../models/Post';

import * as SteemService from '../services/SteemService';

const DEFAULT_LIMIT = 20;

const PostStore = types
  .model('PostStore', {
    account: types.string,
    posts: types.array(Post),
    busy: true,
    isReady: false,
    refreshing: false, // pull down 새로고침
    hasMoreFeeds: true, // 더 보기
    startAuthor: '',
    startPermlink: '',
    visibleFAB: true,
  })
  .actions(self => ({
    load: flow(function* load() {
      console.log('[PostStore][load] Start!');
      try {
        const opts = {
          tag: self.account,
          limit: DEFAULT_LIMIT + 1,
          start_author: self.startAuthor,
          start_permlink: self.startPermlink,
          // truncate_body: 500,
        };
        //   console.log('[PostStore] getDiscussions:', opts);
        self.busy = true;
        const posts = yield SteemService.getDiscussions('feed', opts);
        console.log('[PostStore] posts:', posts.length);
        console.log('[PostStore] posts:', posts);

        let startAuthor = '';
        let startPermlink = '';
        let hasMoreFeeds = false; // 이후 가져올 페이지가 있는지 여부 체크
        if (posts.length > DEFAULT_LIMIT) {
          ({ author: startAuthor, permlink: startPermlink } = posts.pop());
          hasMoreFeeds = true;
        }
        self.startAuthor = startAuthor;
        self.startPermlink = startPermlink;
        self.hasMoreFeeds = hasMoreFeeds;
        if (self.refreshing) self.posts = posts;
        else self.posts.push(...posts);
      } catch (err) {
        console.error('[PostStore][load]ERROR:', err);
      }
      self.busy = false;
      self.refreshing = false;
      self.isReady = true;
      console.log('[PostStore][load] Done!');
    }),
    loadMore() {
      console.log('[PostStore][loadMore] Start!');
      if (!self.busy && self.hasMoreFeeds) {
        self.load();
      }
      console.log('[PostStore][loadMore] Done!');
    },
    pullDown() {
      console.log('[PostStore][pullDown] Start!');
      if (!self.busy && !self.refreshing) {
        self.refreshing = true;
        self.startAuthor = '';
        self.startPermlink = '';
        self.load();
      }
      console.log('[PostStore][pullDown] Done!');
    },
    // afterCreate() {
    //   self.load();
    // },
  }));

export default PostStore;
