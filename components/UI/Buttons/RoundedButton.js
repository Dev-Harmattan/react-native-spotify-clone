import { Pressable, StyleSheet, Text } from 'react-native';

const RoundedButton = ({ children, onPress, style }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

export default RoundedButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#282828',
    padding: 10,
    borderRadius: 30,
  },
  text: {
    fontSize: 15,
    color: 'white',
  },
  pressed: {
    opacity: 0.8,
  },
});
