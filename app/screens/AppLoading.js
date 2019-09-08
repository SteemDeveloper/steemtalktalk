import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Container, Spinner, Toast } from 'native-base';

import { when } from 'mobx';
import { observer, inject } from 'mobx-react';

import { colors } from '../utils';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});

class AppLoading extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
    accountStore: PropTypes.shape().isRequired,
  };

  componentDidMount() {
    console.log('[AppLoading][componentDidMount] props:', this.props);
    const { navigation, accountStore } = this.props;
    when(
      () => accountStore.loaded,
      () => {
        console.log(
          '[AppLoading][componentDidMount][when] accountStore',
          accountStore.toJSON(),
        );
        if (accountStore && accountStore.isExist) {
          // 계정 액세스 토큰 유효기간 체크
          if (accountStore.account.isExpired) {
            Toast.show({
              text: `${account.username}'s access token has expired.`,
              duration: 1000,
            });
            navigation.navigate('Login');
          } else {
            navigation.navigate('Main');
          }
        } else {
          navigation.navigate('Login');
        }
      },
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <Spinner color={colors.primary} />
      </Container>
    );
  }
}

export default inject('accountStore')(observer(AppLoading));
