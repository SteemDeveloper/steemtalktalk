import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text } from 'native-base';

const Message = styled(Text)`
  align-self: center;
`;

const ListEmptyComponent = ({ children }) => {
  return <Message>{children || 'Empty'}</Message>;
};

ListEmptyComponent.propTypes = {
  children: PropTypes.string,
};

ListEmptyComponent.defaultProps = {
  children: '',
};

export default ListEmptyComponent;
