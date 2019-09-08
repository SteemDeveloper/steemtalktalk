import React from 'react';
import { observer, inject } from 'mobx-react';

import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { width, colors } from '../../utils';
import { homeFeed } from '../../mock';

import NavigationWraper from '../../components/NavigationWraper';
import Tweet from '../../components/Tweet';

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

class Home extends React.Component {
  state = {};

  componentWillMount() {
    const { accountStore } = this.props;
    if (!accountStore.isExist) {
    }
  }

  render() {
    // console.log('useDrawer', useDrawer)
    console.log('[Home] props:', this.props);
    console.log('[AccountStore] isExist:', this.props.accountStore.isExist);
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
        <ScrollView style={styles.container}>
          {homeFeed.map((item, n) => (
            <TouchableOpacity
              key={n.toString()}
              style={styles.touchableItem}
              onPress={() => navigation.navigate('Tweet', { last: 'Home' })}
            >
              <Tweet data={item} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </NavigationWraper>
    );
  }
}

export default inject('accountStore')(observer(Home));
