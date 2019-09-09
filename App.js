import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';

import { Provider as StoreProvider } from 'mobx-react';
import { Root } from 'native-base';
import Drawer from 'react-native-drawer';

import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';

import Context from './app/context';
import store from './app/stores';

import Navigator from './app/navigator';

// import ControlPanel from './app/components/ControlPanel';
import ControlPanel from './app/components/FancyDrawer';

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

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 },
};

export default class RootComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
    };
  }

  async _loadAssetsAsync() {
    const fontAssets = cacheFonts([
      Ionicons.font,
      { Roboto: require('native-base/Fonts/Roboto.ttf') },
      { Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf') },
      {
        Sweet_Sensations_Personal_Use: require('./assets/fonts/Sweet_Sensations_Personal_Use.ttf'),
      },
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
      <StoreProvider {...store}>
        <Root>
          <Navigator onNavigationStateChange={null} />
        </Root>
      </StoreProvider>
    );
  }
}
