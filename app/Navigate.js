import React, { createContext, useRef } from 'react';

import { StatusBar } from 'react-native';
import Drawer from 'react-native-drawer';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation-tabs';

import Context from './Context';

import TabBarIcon from './components/TabBarIcon';
import { colors } from './utils';

import AppLoading from './screens/AppLoading';

import Login from './screens/Login';
import Home from './screens/Home';
import Search from './screens/Search';
import Notification from './screens/Notification';
import Message from './screens/Message';
import UnderConstruction from './screens/UnderConstruction';

import ControlPanel from './components/ControlPanel';

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

const MainNavigator = createStackNavigator(
  {
    Main: BottomTabNavigator,
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

const AppContainer = createAppContainer(AppSwitchNavigator);

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 },
};

// export default AppContainer;
export default () => {
  const drawer = useRef();

  const openDrawer = () => drawer.current.open();
  const closeDrawer = () => drawer.current.close();

  return (
    <Context.Provider value={{ openDrawer, closeDrawer }}>
      <Drawer
        ref={drawer}
        type="overlay" // static
        content={<ControlPanel closeDrawer={closeDrawer} />}
        tapToClose
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        tweenHandler={ratio => ({
          main: { opacity: (2 - ratio) / 2 },
        })}
      >
        <AppContainer />
      </Drawer>
    </Context.Provider>
  );
};

// export default class App extends Component {
//   closeDrawer = () => {
//     this._drawer.close();
//   };
//   openDrawer = () => {
//     this._drawer.open();
//   };
//   render() {
//     return (
//       // <Provider closeDrawer={this.closeDrawer} openDrawer={this.openDrawer}>
//       //   <Drawer
//       //     ref={ref => (this._drawer = ref)}
//       //     type="overlay" // static
//       //     content={<ControlPanel />}
//       //     tapToClose
//       //     openDrawerOffset={0.2} // 20% gap on the right side of drawer
//       //     panCloseMask={0.2}
//       //     closedDrawerOffset={-3}
//       //     styles={drawerStyles}
//       //     tweenHandler={ratio => ({
//       //       main: { opacity: (2 - ratio) / 2 },
//       //     })}
//       //   >
//           <AppContainer />
//       //   </Drawer>
//       // </Provider>
//     );
//   }
// }
