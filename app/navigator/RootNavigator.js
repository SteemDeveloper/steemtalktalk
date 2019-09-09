import React, { useRef } from 'react';

import { StatusBar } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Context from '../context';

import AppLoading from '../screens/AppLoading';

import Login from '../screens/Login';
import UnderConstruction from '../screens/UnderConstruction';

import MainTabNavigator from './MainTabNavigator';

const MainNavigator = createStackNavigator(
  {
    Main: MainTabNavigator,
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

const AppSwitchNavigator = createSwitchNavigator(
  {
    AppLoading,
    Login,
    Main: MainNavigator,
  },
  {
    initialRouteName: 'AppLoading',
  },
);

export default createAppContainer(AppSwitchNavigator);
