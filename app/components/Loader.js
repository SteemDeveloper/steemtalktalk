import React from 'react';
import styled from 'styled-components/native';
// import { ActivityIndicator } from "react-native";
import { Spinner } from 'native-base';

const Container = styled.View`
  flex: 1;
  justify-content: center;
`;

export default () => (
  <Container>
    <Spinner size="large" />
  </Container>
);
