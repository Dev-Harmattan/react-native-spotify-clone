import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const SignInButton = ({ onPress, disable }) => {
  return (
    <Pressable
      disabled={disable}
      onPress={onPress}
      style={(pressed) => [styles.button]}
    >
      <Text>Sign in with Spotify</Text>
    </Pressable>
  );
};

export default SignInButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1DB954',
    padding: 10,
    width: 300,
    borderRadius: 25,
    marginVertical: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
