import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const LikedButton = () => {
  return (
    <LinearGradient colors={['#33006f', '#ffffff']}>
      <Pressable style={styles.button}>
        <AntDesign name="heart" size={24} color="white" />
      </Pressable>
    </LinearGradient>
  );
};

export default LikedButton;

const styles = StyleSheet.create({
  button: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
