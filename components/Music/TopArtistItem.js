import { Image, StyleSheet, Text, View } from 'react-native';

const TopArtist = ({ item }) => {
  return (
    <View style={styles.topArtistContainer}>
      <Image style={styles.image} source={{ uri: item?.images[0].url }} />
      <Text style={styles.artistName}>{item?.name}</Text>
    </View>
  );
};

export default TopArtist;

const styles = StyleSheet.create({
  topArtistContainer: {
    margin: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 5,
  },
  artistName: {
    fontSize: 13,
    fontWeight: '500',
    color: 'white',
    marginTop: 10,
  },
});
