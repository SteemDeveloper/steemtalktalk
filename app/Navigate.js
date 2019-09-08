import React from 'react';

import { StatusBar } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation-tabs';

import TabBarIcon from './components/TabBarIcon';
import { colors } from './utils';

import Login from './screens/Login';
import Home from './screens/Home';
import Search from './screens/Search';
import Notification from './screens/Notification';
import Message from './screens/Message';
import UnderConstruction from './screens/UnderConstruction';

const BottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: props => (
          <TabBarIcon
            name={props.focused ? 'home' : 'home-outline'}
            {...props}
          />
        ),
      },
    },
    Search: {
      screen: Search,
      navigationOptions: {
        tabBarIcon: props => <TabBarIcon name="magnify" {...props} />,
      },
    },
    Notification: {
      screen: Notification,
      navigationOptions: {
        tabBarIcon: props => (
          <TabBarIcon
            name={props.focused ? 'bell' : 'bell-outline'}
            {...props}
          />
        ),
      },
    },
    Message: {
      screen: Message,
      navigationOptions: {
        tabBarIcon: props => (
          <TabBarIcon
            name={props.focused ? 'email' : 'email-outline'}
            {...props}
          />
        ),
      },
    },
  },
  {
    tabBarPosition: 'bottom',
    lazy: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      scrollEnabled: false,
      activeTintColor: colors.primary, // 활성 탭의 레이블 및 아이콘 색상.
      inactiveTintColor: colors.secondary, // 비활성 탭의 레이블 및 아이콘 색상.
      style: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#d1cece',
      },
      pressOpacity: 0.8,
      labelStyle: { fontSize: 10, fontWeight: 'bold' },
      indicatorStyle: {
        // 탭 인디케이터 (탭의 하단에있는 행)의 스타일
        backgroundColor: '#2f95dc',
      },
    },
  },
);

const RootNavigator = createSwitchNavigator(
  {
    // Login: {
    //   screen: Login,
    // },
    Main: BottomTabNavigator,
    // Main: createSwitchNavigator(
    //   {
    //     Home,
    //     Search,
    //     Notification,
    //     Message,
    //   },
    //   { initialRouteName: 'Home' },
    // ),
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
