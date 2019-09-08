import React from 'react';
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
  image: {
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

class Login extends React.Component {
  state = {};

  render() {
    const { navigation } = this.props;
    return (
      <NavigationWraper
        navigation={navigation}
        selected={0}
        rightIcon={
          <TouchableOpacity style={{ padding: 5 }}>
            <Image
              style={styles.image}
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

export default Login;
