import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MusicItem from './MusicItem';

const RecentlyList = ({ data }) => {
  return (
    <FlatList
      data={data}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      renderItem={({ item }) => (
        <MusicItem
          type="image"
          source={item?.track.album.images[0]?.url}
          title={item?.track.name}
        />
      )}
      keyExtractor={(item) => item?.track.name}
    />
  );
};

export default RecentlyList;

const styles = StyleSheet.create({});
