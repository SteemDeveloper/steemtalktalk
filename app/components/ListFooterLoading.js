import React from 'react';
import styled from 'styled-components/native';
import { Spinner } from 'native-base';

const ListFooterLoading = styled(Spinner).attrs({ animating: true })`
  margin-vertical: 20px;
`;

export default ListFooterLoading;
