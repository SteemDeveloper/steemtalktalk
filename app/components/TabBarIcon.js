import React from 'react';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TabBarIcon = props => {
  console.log('[TabBarIcon] props', props);
  const { focused, name, tintColor } = props;
  return (
    <MaterialCommunityIcons
      name={name}
      color={tintColor}
      size={focused ? 27 : 26}
    />
  );
};

TabBarIcon.propTypes = {
  name: PropTypes.string.isRequired,
  tintColor: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
};

export default TabBarIcon;
