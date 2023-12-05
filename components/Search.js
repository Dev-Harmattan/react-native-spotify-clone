import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Search = () => {
  const [userInput, setUserInput] = useState('');
  return (
    <Pressable style={styles.container}>
      <Pressable style={styles.searchWrapper}>
        <AntDesign name="search1" size={20} color="white" />
        <TextInput
          placeholder="Find in liked songs"
          onChangeText={(inputValue) => setUserInput()}
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
