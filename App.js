import React from 'react';

import { Provider } from 'mobx-react';
import { Root } from 'native-base';

import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
// import { AsyncStorage } from 'react-native';

import Navigator from './app/Navigate';

// import AccountStore from './app/stores/AccountStore';
import store from './app/stores';

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }
    return Asset.fromModule(image).downloadAsync();
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class RootComponent extends React.Component {
  state = {
    // accountStore: AccountStore.create(),
    isReady: false,
  };

  // 계정 정보 불러오기
  // async _loadAccount() {
  //   let storedAccount = await AsyncStorage.getItem('account');
  //   if (storedAccount) {
  //     try {
  //       const accountJson = JSON.parse(storedAccount);
  //       this.state.accountStore.add(accountJson);
  //     } catch (e) {}
  //   }
  // }

  async _loadAssetsAsync() {
    const fontAssets = cacheFonts([
      //   require('native-base/Fonts/Roboto.ttf'),
      //   require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons.font,
    ]);

    const imageAssets = cacheImages([
      require('./assets/topMore.png'),
      require('./assets/thunder.png'),
      require('./assets/topStar.png'),
      require('./assets/topGear.png'),
      require('./assets/tweet.png'),
      require('./assets/message.png'),
      require('./assets/wizardsunite.png'),
      require('./assets/avatar/user1.jpg'),
      require('./assets/avatar/user2.jpg'),
      require('./assets/avatar/user3.jpg'),
      require('./assets/avatar/user4.jpg'),
      require('./assets/avatar/user5.jpg'),
      require('./assets/avatar/user6.jpg'),
    ]);

    await Promise.all([...imageAssets, ...fontAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <Provider {...store}>
        <Root>
          <Navigator onNavigationStateChange={null} />
        </Root>
      </Provider>
    );
  }
}
