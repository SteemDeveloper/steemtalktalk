import React from 'react';
import { AppLoading } from 'expo';

import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';

import Navigator from './app/Navigate';

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
    isReady: false,
  };

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
    if (this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return <Navigator onNavigationStateChange={null} />;
  }
}
