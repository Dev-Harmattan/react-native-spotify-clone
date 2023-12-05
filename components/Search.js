import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { debounce } from 'lodash';

const Search = ({ onPress, tracks }) => {
  const [userInput, setUserInput] = useState('');

  const handleSearch = (text) => {
    const filteredTracks = tracks.filter((item) =>
      item.track.name.toLowerCase().includes(text.toLowerCase())
    );
    onPress(filteredTracks);
  };

  const debounceSearch = debounce(handleSearch, 800);

  const handleInputChange = (text) => {
    setUserInput(text);
    debounceSearch(text);
  };

  useEffect(() => {
    if(tracks?.length > 0) {
      handleSearch(userInput)
    }
  }, [tracks])
  
  return (
    <Pressable style={styles.container}>
      <Pressable style={styles.searchWrapper}>
        <AntDesign name="search1" size={20} color="white" />
        <TextInput
          placeholder="Find in liked songs"
          onChangeText={(inputValue) => handleInputChange(inputValue)}
          value={userInput}
          placeholderTextColor={'white'}
          style={{ fontWeight: '500' }}
        />
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.sortButton,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={styles.sortButtonText}>Sort</Text>
      </Pressable>
    </Pressable>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 9,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#42275a',
    flex: 1,
    padding: 10,
    borderRadius: 3,
    height: 38,
  },
  sortButton: {
    backgroundColor: '#42275a',
    padding: 10,
    borderRadius: 3,
    height: 38,
    marginHorizontal: 10,
  },
  sortButtonText: {
    color: 'white',
  },
});
