import React from 'react';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import { colors } from '../utils';

import Home from '../screens/Home';
import Search from '../screens/Search';
import Notification from '../screens/Notification';
import Message from '../screens/Message';
import UnderConstruction from '../screens/UnderConstruction';

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
      indicatorStyle: {
        backgroundColor: '#2f95dc',
      },
    },
  },
);

export default BottomTabNavigator;
