import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';

import { Linking, TouchableOpacity } from 'react-native';
import { Container, Button, Text } from 'native-base';

import * as Localization from 'expo-localization';
// import i18n from 'i18n-js';
// const en = {
//   foo: 'Foo',
//   bar: 'Bar {{someValue}}',
// };
// const fr = {
//   foo: 'como telle fous',
//   bar: 'chatouiller {{someValue}}',
// };

import Loader from '../../components/Loader';
import LogoText from '../../components/LogoText';
import LoginModal from './LoginModal';

// import { LOCALE } from '../../config';

const JoinLinkContainer = styled.View`
  flex-direction: row;
`;

const JoinLink = styled.Text`
  font-size: 14;
  text-decoration-line: underline;
  text-decoration-color: #0000ee;
  text-decoration-style: solid;
`;

const LoginContainer = styled(Container)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const LoginButton = styled(Button).attrs({
  block: true,
  primary: true,
})`
  margin-horizontal: 35;
  background-color: #3798f2;
  height: 55;
  border-radius: 7;
  margin-bottom: 15;
`;

class Login extends Component {
  static propTypes = {
    accountStore: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.joinLink =
      Localization.locale === 'ko-KR'
        ? 'https://join.steempeople.com/'
        : 'https://signup.steemit.com';
  }

  @observable loading = false;
  @observable modalVisible = false;
  // @observable loggedin = false;

  // 모달창 오픈
  @action onModalOpenHandle = () => {
    this.modalVisible = true;
  };

  // 모달창 닫기
  @action onModalCloseHandle = () => {
    this.modalVisible = false;
  };

  // 스팀커넥트 성공
  @action onSteemconnectSuccessHandle = tokens => {
    console.log('tokens', tokens);
    this.modalVisible = false;
    this.onSignInAsync(tokens); // 로그인 성공
  };

  // 로그인 성공
  @action onSignInAsync = async userToken => {
    console.log('onSignInAsync:', userToken);
    try {
      const account = {
        type: 'token',
        id: userToken.username,
        username: userToken.username,
        accessToken: userToken.access_token,
        expiresIn: parseInt(userToken.expires_in),
        issuedAt: Math.floor(Date.now() / 1000),
      };
      await this.props.accountStore.addAccount(account);
      await this.props.accountStore.save();
      console.log('[Login][onSignInAsync] 로그인 성공:', account);

      // 뒤로 가기
      // this.props.navigation.goBack();
      this.props.navigation.navigate('Main');
    } catch (error) {
      console.error(error);
      this.modalVisible = false;
      this.loading = false;
    }
  };

  goJoinPage = () => {
    Linking.openURL(this.joinLink);
  };

  render() {
    console.log('LoginScreenContainer', this.props);

    return (
      <>
        {this.loading ? (
          <Loader />
        ) : (
          <LoginContainer>
            <LogoText>Steem Talk Talk</LogoText>
            <LoginButton onPress={this.onModalOpenHandle}>
              <Text>Steemconnect Login</Text>
            </LoginButton>

            <JoinLinkContainer>
              <Text note>아직 계정이 없으신가요? </Text>
              <TouchableOpacity onPress={this.goJoinPage}>
                <JoinLink>계정 생성하기</JoinLink>
              </TouchableOpacity>
            </JoinLinkContainer>
          </LoginContainer>
        )}

        <LoginModal
          title="스팀커넥트 로그인 모달창"
          modalVisible={this.modalVisible}
          onModalOpen={this.onModalOpenHandle}
          onModalClose={this.onModalCloseHandle}
          onSteemconnectSuccess={this.onSteemconnectSuccessHandle}
        />
      </>
    );
  }
}

export default inject('accountStore')(observer(Login));
