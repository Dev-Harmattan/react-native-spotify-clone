import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LikedButton from './LikedButton';

const MusicItem = ({ type, title, source }) => {
  return (
    <View style={styles.itemContainer}>
      {type === 'icon' && <LikedButton />}
      {type === 'image' && (
        <Image style={styles.image} source={{ uri: source }} />
      )}
      <Text style={styles.text} numberOfLines={2} >
        {title}
      </Text>
    </View>
  );
};

export default MusicItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 8,
    backgroundColor: '#202020',
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    flex : 1,
  },
  image: {
    width: 55,
    height: 55,
  },
});
