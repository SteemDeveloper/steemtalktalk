import React from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import { onSnapshot } from 'mobx-state-tree';

import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Container } from 'native-base';

import Header from '../../components/Header';
import TweetBubble from '../../components/TweetBubble';
import Tweet from '../../components/Tweet';

import { width, colors } from '../../utils';
import { homeFeed } from '../../mock';

import PostStore from '../../stores/PostStore';

// import Loader from '../../components/Loader';
// import PostListItem from '../../components/PostListItem';
import ListFooterLoading from '../../components/ListFooterLoading';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import Loader from '../../components/Loader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
  list: {
    flex: 1,
    // width,
    backgroundColor: colors.exexlight_gray,
  },
  iconImage: {
    height: 30,
    width: 30,
  },
  touchableItem: {
    borderColor: colors.exlight_gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  appTitle: {
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'HelveticaNeue-Bold',
  },
});

@observer
class HomeContainer extends React.Component {
  // @observable postStore;

  constructor(props) {
    super(props);
    const {
      accountStore: { account },
    } = props;
    console.log('[HomeContainer] account:', account);

    this.postStore = PostStore.create({ account: account.id });
    console.log('[HomeContainer] postStore:', this.postStore);

    // onSnapshot(this.postStore, console.log);
  }

  componentDidMount() {
    this.postStore.load();
  }

  goNewTweet = () => {
    const { navigation } = this.props;
    navigation.navigate('New Tweet', {
      last: navigation.state.routeName,
    });
  };

  render() {
    console.log('[Home] props:', this.props);
    // console.log('[AccountStore] isExist:', this.props.accountStore.isExist);
    const { navigation, accountStore } = this.props;
    const { account } = accountStore;
    // console.log('[Home] postStore:', this.postStore)
    return (
      <SafeAreaView style={styles.container}>
        <Header
          avatar={{
            uri: `https://steemitimages.com/u/${account.username}/avatar`,
          }}
          showProfile={() => {}}
          title={<Text style={styles.appTitle}>Home</Text>}
          rightIcon={
            <TouchableOpacity style={{ padding: 5 }}>
              <Image
                style={styles.iconImage}
                source={require('../../../assets/topStar.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          }
        />
        {this.postStore.isReady ? (
          <>
            <FlatList
              // style={styles.list}
              data={this.postStore.posts}
              keyExtractor={({ post_id }) => String(post_id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.touchableItem}
                  onPress={() => navigation.navigate('Tweet', { last: 'Home' })}
                >
                  <Tweet data={item} />
                </TouchableOpacity>
              )}
              refreshing={this.postStore.refreshing}
              onRefresh={this.postStore.pullDown}
              onEndReached={this.postStore.loadMore}
              ListFooterComponent={() =>
                this.postStore.hasMoreFeeds ? <ListFooterLoading /> : null
              }
              // ListEmptyComponent={() => <ListEmptyComponent />}
            />
            <TweetBubble message onBubblePress={this.goNewTweet} />
          </>
        ) : (
          <Loader />
        )}
      </SafeAreaView>
    );
  }
}

{
  /* <ScrollView style={styles.content}>
          {homeFeed.map((item, n) => (
            <TouchableOpacity
              key={n.toString()}
              style={styles.touchableItem}
              onPress={() => navigation.navigate('Tweet', { last: 'Home' })}
            >
              <Tweet data={item} />
            </TouchableOpacity>
          ))}
        </ScrollView> */
}

export default inject('accountStore')(HomeContainer);
