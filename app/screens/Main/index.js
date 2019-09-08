import React from 'react';
import { observer, inject } from 'mobx-react';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation-tabs';

import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { width, colors } from '../../utils';

import TabBarIcon from '../../components/TabBarIcon';

import NavigationWraper from '../../components/NavigationWraper';
import Tweet from '../../components/Tweet';

import Login from '../Login';
import Home from '../Home';
import Search from '../Search';
import Notification from '../Notification';
import Message from '../Message';
import UnderConstruction from '../UnderConstruction';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
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

const AppContainer = createAppContainer(BottomTabNavigator);

class Main extends React.Component {
  state = {};

  componentWillMount() {
    const { accountStore } = this.props;
    if (!accountStore.isExist) {
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <NavigationWraper
        navigation={navigation}
        selected={0}
        rightIcon={
          <TouchableOpacity style={{ padding: 5 }}>
            <Image
              style={styles.iconImage}
              source={require('../../../assets/topStar.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        }
        title={<Text style={styles.appTitle}>Home</Text>}
      >
        <AppContainer />
      </NavigationWraper>
    );
  }
}

export default inject('accountStore')(observer(Main));
