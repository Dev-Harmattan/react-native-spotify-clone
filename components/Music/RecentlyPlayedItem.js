import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const RecentlyPlayedItem = ({ item }) => {
  return (
    <Pressable style={styles.recentlyPlayedContainer}>
      <Image
        style={styles.image}
        source={{ uri: item?.track.album.images[0]?.url }}
      />
      <Text numberOfLines={1} style={styles.text}>
        {item?.track?.name}
      </Text>
    </Pressable>
  );
};

export default RecentlyPlayedItem;

const styles = StyleSheet.create({
  recentlyPlayedContainer: {
    margin: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 5,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: 'white',
    marginTop: 10,
  },
});
