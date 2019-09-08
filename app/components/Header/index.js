import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { width, rgbaColors } from '../../utils';

import Avatar from '../Avatar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width,
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  touchableMask: {
    position: 'absolute',
    top: 5,
    left: 10,
    width: 30,
    height: 30,
    zIndex: 9,
    padding: 5,
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faded: 0,
    };
  }

  componentWillMount() {
    this.setState({
      borderColor: rgbaColors.light_gray,
    });
  }

  _fadeAvatar(n) {
    this.setState({ faded: n });
  }

  render() {
    let { rightIcon: icon, style, faded, showProfile, title } = this.props;
    if (!icon) {
      icon = <View style={{ width: 30, height: 30 }} />;
    }

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          style={[
            styles.touchableMask,
            {
              backgroundColor: `rgba(255,255,255,${faded})`,
            },
          ]}
          onPress={showProfile}
          activeOpacity={1.5}
        />
        <Avatar />
        {title}
        {icon}
      </View>
    );
  }
}

export default Header;
