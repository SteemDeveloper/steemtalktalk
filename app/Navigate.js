import React from 'react';

import { StatusBar } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './screens/Home';
import Search from './screens/Search';
import Notification from './screens/Notification';
import Message from './screens/Message';
import UnderConstruction from './screens/UnderConstruction';

const RootNavigator = createSwitchNavigator(
  {
    Main: createSwitchNavigator(
      {
        Home,
        Search,
        Notification,
        Message,
      },
      { initialRouteName: 'Home' },
    ),
    Drawer: createStackNavigator({
      Profile: UnderConstruction,
      Popular: UnderConstruction,
      Saved: UnderConstruction,
      Discover: UnderConstruction,
      Configuration: UnderConstruction,
      'Help Center': UnderConstruction,
    }),
    Details: createStackNavigator({
      Tweet: UnderConstruction,
      'New Tweet': UnderConstruction,
      'New Message': UnderConstruction,
      DynamicTitle: UnderConstruction,
    }),
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
    cardStyle: { paddingTop: StatusBar.currentHeight },
  },
);

const AppContainer = createAppContainer(RootNavigator);

export default AppContainer;
