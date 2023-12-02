import { StyleSheet, Text } from 'react-native';
import React from 'react';

const Title = ({ children }) => {
  return <Text style={styles.topArtist}>{children}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  topArtist: {
    fontSize: 19,
    color: 'white',
    fontWeight: 'bold',
    margin: 10,
  },
});
