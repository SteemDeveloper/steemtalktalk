import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

import { colors } from '../../utils';

import Header from '../Header';
import TweetBubble from '../TweetBubble';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
});

class NavigationWraper extends React.Component {
  _changeScreen = () => {
    const screen = this.props.selected !== 3 ? 'New Tweet' : 'New Message';
    this.props.navigation.navigate(screen, {
      last: this.props.navigation.state.routeName,
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          // showProfile={openDrawer}
          title={this.props.title}
          rightIcon={this.props.rightIcon}
          style={this.props.headerStyle}
        />

        {/* contents */}
        {this.props.children}
        {/* contents */}

        <TweetBubble
          message={this.props.selected !== 3}
          onBubblePress={this._changeScreen}
        />
      </SafeAreaView>
    );
  }
}

export default NavigationWraper;
