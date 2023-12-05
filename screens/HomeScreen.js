import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RoundedButton from '../components/UI/Buttons/RoundedButton';
import MusicItem from '../components/Music/MusicItem';
import axios from 'axios';
import RecentlyList from '../components/Music/RecentlyList';
import TopArtist from '../components/Music/TopArtistItem';
import Title from '../components/UI/Title';
import RecentlyPlayedItem from '../components/Music/RecentlyPlayedItem';

const HomeScreen = ({ navigation }) => {
  const [profile, setProfile] = useState();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topArtist, setTopArtist] = useState([]);

  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem('access_token');
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    const data = await response.json();
    setProfile(data);
  };

  const getRecentlyPlayedSongs = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const limit = 4;
      const response = await axios({
        method: 'GET',
        url: `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
      const tracks = response.data.items;
      setRecentlyPlayed(tracks);
    } catch (error) {
      console.log(error);
    }
  };


  const getTopArtist = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/top/artists',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
      setTopArtist(response.data.items);
    } catch (error) {}
  };
  useEffect(() => {
    getProfile();
    getRecentlyPlayedSongs();
    getTopArtist();
  }, []);

  const imageSource =
    profile?.images.length > 0
      ? { uri: profile?.images[0].url }
      : require('../assets/avatar.jpg');

  const getMessage = () => {
    const currentHour = new Date().getHours();
    const messageText =
      currentHour < 12
        ? 'Good Morning'
        : currentHour < 16
        ? 'Good Afternoon'
        : 'Good Evening';

    return messageText;
  };

  return (
    <LinearGradient colors={['#040306', '#131624']} style={{ flex: 1 }}>
      <ScrollView style={{ marginVertical: 80 }}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image style={styles.profileImage} source={imageSource} />
            <Text style={styles.greetingTitle}>{getMessage()}</Text>
          </View>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={24}
            color="white"
          />
        </View>
        <View style={styles.buttonContainer}>
          <RoundedButton>Music</RoundedButton>
          <RoundedButton>Podcasts & shows</RoundedButton>
        </View>
        <View style={styles.musicItemContainer}>
          <MusicItem
            onPress={() => navigation.navigate('Liked')}
            type="icon"
            title="Liked Songs"
          />
          <MusicItem
            type="image"
            source="https://i.pravatar.cc/100"
            title="Hiphop Tamhiza"
          />
        </View>
        {/* <View style={{ marginTop: 35 }} /> */}
        <RecentlyList data={recentlyPlayed} />
        <Title>Your Top Artists</Title>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topArtist.length > 0 ? (
            topArtist.map((item, index) => (
              <TopArtist key={index} item={item} />
            ))
          ) : (
            <Text style={styles.notArtist}>No Top Artist</Text>
          )}
        </ScrollView>
        <View style={{ height: 10 }} />
        <Title>Recently Played</Title>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={recentlyPlayed}
          renderItem={({ item }) => (
            <RecentlyPlayedItem item={item} key={(item) => item.track.name} />
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  profileImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  greetingTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    marginVertical: 12,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  musicItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    // marginTop: 30,
  },
  notArtist: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
    padding: 10,
  },
});
