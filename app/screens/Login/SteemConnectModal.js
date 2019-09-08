import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';

import steemConnect from '../../services/SteemConnectService';

const Container = styled.View`
  flex: 1;
  /*padding: 15px;
  background-color: #000;
  opacity: 0.5;*/
  ${Platform.OS === 'ios' ? 'padding: 50px 15px' : 'padding: 15px'}
`;

const BackgroundCover = styled.View`
  background-color: #000;
  opacity: 0.5;
  position: absolute;
  top: -15px;
  left: -15px;
  right: -15px;
  bottom: -15px;
`;

const MyWebView = styled(WebView).attrs({ startInLoadingState: true })`
  background-color: #fff;
`;

const SteemConnectModal = ({ onSteemconnectSuccess }) => {
  const webviewEl = useRef(null);

  // webview 상태 변경 체크
  const _handlerNavigationStateChange = useCallback(event => {
    console.log('[SteemConnectModal]', 'event:', event);
    if (event.url.indexOf('?access_token') > -1) {
      // this.webview.stopLoading();
      webviewEl.current.stopLoading();
      try {
        // 콜백 URL에서 accessToken 정보 추출하기
        const tokens = {};
        const params = event.url.split('?')[1].split('&');
        params.forEach(e => {
          const [key, val] = e.split('=');
          tokens[key] = val;
        });
        console.log('[SteemConnectModal]', 'tokens', tokens);

        // console.log('tokens:', tokens);
        onSteemconnectSuccess(tokens);
      } catch (error) {
        console.log(error);
      }
    }
  });

  // 로그인 URL 생성
  const link = steemConnect.getLoginURL();

  return (
    <Container>
      <BackgroundCover />
      <MyWebView
        source={{ uri: link }}
        cacheEnabled
        originWhitelist={['*']}
        onNavigationStateChange={_handlerNavigationStateChange}
        ref={webviewEl}
      />
    </Container>
  );
};

SteemConnectModal.propTypes = {
  onSteemconnectSuccess: PropTypes.func.isRequired,
};

export default SteemConnectModal;
