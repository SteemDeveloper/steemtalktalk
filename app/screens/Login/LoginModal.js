import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal, Platform } from 'react-native';
import { Button, Text } from 'native-base';

import SteemConnectModal from './SteemConnectModal';

const ModalContainer = styled(Modal).attrs({
  animationType: 'slide',
  transparent: true,
})`
  ${Platform.OS === 'ios' ? 'padding-top: 20px' : null}
`;

// 모달 닫기 버튼
const ModalCloseButton = styled(Button).attrs({
  small: true,
  icon: true,
})`
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: #000;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  ${Platform.OS === 'ios' ? 'top: 30px' : 'top: 0px;'}
`;

const LoginModalPresenter = ({
  modalVisible,
  onSteemconnectSuccess,
  onModalClose,
}) => {
  return (
    <ModalContainer
      // animationType="slide"
      // transparent
      onRequestClose={onModalClose}
      visible={modalVisible}
    >
      <SteemConnectModal onSteemconnectSuccess={onSteemconnectSuccess} />
      <ModalCloseButton onPress={onModalClose}>
        <Text>×</Text>
      </ModalCloseButton>
    </ModalContainer>
  );
};

LoginModalPresenter.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  onSteemconnectSuccess: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired,
};

export default LoginModalPresenter;
