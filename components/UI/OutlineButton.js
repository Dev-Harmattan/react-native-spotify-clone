import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const OutlineButton = ({ type, color, size, title }) => {
  let icon;

  if (type === 'phone') {
    icon = (
      <MaterialIcons
        style={styles.icon}
        name="phone-android"
        size={size}
        color={color}
      />
    );
  }

  if (type === 'google') {
    icon = (
      <FontAwesome
        style={styles.icon}
        name="google"
        size={size}
        color={color}
      />
    );
  }

  if (type === 'facebook') {
    icon = <Entypo name="facebook" size={size} color={color} />;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.pressed,
      ]}
    >
      {icon}
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

export default OutlineButton;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#131624',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#C0C0C0',
    borderWidth: 0.8,
    width: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },
  pressed: {
    backgroundColor: '#040306',
  },
});
