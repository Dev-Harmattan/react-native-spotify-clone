import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { Entypo } from '@expo/vector-icons';
import { PlayerContext } from '../PlayerContext';

const SongItem = ({ item, onPress, isPlaying }) => {
  const { setCurrentTrack } = useContext(PlayerContext);
  const handlePress = () => {
    setCurrentTrack(item);
    onPress(item);
  };
  return (
    <Pressable style={styles.songItemContainer} onPress={handlePress}>
      <Image
        style={styles.image}
        source={{ uri: item?.track?.album?.images[0].url }}
      />
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={[styles.trackName, isPlaying && { color: '#3FFF00' }]}
        >
          {item?.track?.name}
        </Text>
        <Text style={styles.artistName}>{item?.track?.artists[0].name}</Text>
      </View>

      <View style={styles.likeIconWrapper}>
        <Entypo name="heart" size={24} color="#1dB954" />
        <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
      </View>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({
  songItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  trackName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  artistName: {
    color: '#989898',
    marginTop: 4,
  },
  likeIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
