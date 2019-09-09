import React, { useRef } from 'react';
import { withNavigation } from 'react-navigation';
import {
  ScrollView,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Drawer from './Drawer';

import { rgbaColors, colors, width, height, profileWidth } from '../../utils';

function mappingNumber(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

const FancyDrawer = props => {
  console.log('[FancyDrawer] props:', props);
  return (
    <SafeAreaView style={styles.container}>
      <Drawer
        changeScreen={props.navigation}
        profileName={props.profileName}
        profileUserName={props.profileUserName}
        profileExtra={props.profileExtra}
      />
    </SafeAreaView>
  );
};

export default withNavigation(FancyDrawer);
