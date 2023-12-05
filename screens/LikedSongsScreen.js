import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Search from '../components/Search';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SongItem from '../components/SongItem';
import { PlayerContext } from '../PlayerContext';
import Modal from 'react-native-modal';
import {
  FontAwesome,
  AntDesign,
  Entypo,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

const LikedSongsScreen = () => {
  const navigation = useNavigation();
  const [savedTracks, setSavedTracks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const { currentTrack, setCurrentTrack } = useContext(PlayerContext);
  const songRef = useRef(0);
  const getUserSaveTracks = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await fetch(
        'https://api.spotify.com/v1/me/tracks?limit=50&offset=0',
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        }
      );
      const data = await response.json();
      setSavedTracks(data?.items);
    } catch (error) {
      console.log(error);
    }
  };

  const playTrack = async () => {
    if (savedTracks?.length > 0) {
      setCurrentTrack(savedTracks[0]);
      setCurrentTrack(savedTracks[0]);
    }
    await play(savedTracks[0]);
  };

  const play = async (newTrack) => {
    const preview_url = newTrack?.track?.preview_url;
    try {
      if (currentSong) {
        await currentSong.stopAsync();
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        staysActiveInBackground: false,
      });
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: preview_url,
        },
        {
          shouldPlay: true,
          isLooping: false,
        },
        onPlayBackStatusUpdate
      );
      setCurrentSong(sound);
      onPlayBackStatusUpdate(status);
      await sound.playAsync();
      setIsPlaying(status.isLoaded);
    } catch (error) {
      console.log(error);
    }
  };

  const onPlayBackStatusUpdate = async (status) => {
    if (status?.isLoaded && status?.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;
      setProgress(progress);
      setCurrentTime(status.positionMillis);
      setTotalDuration(status.durationMillis);
    }

    if (status.didJustFinish) {
      setCurrentSong(null);
      playNextTrack();
    }
  };

  const formatTime = (time) => {
    console.log('Time: ', time);
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (currentSong) {
      isPlaying ? currentSong.pauseAsync() : currentSong.playAsync();
      setIsPlaying(!isPlaying);
    }
  };

  const playNextTrack = async () => {
    if (currentSong) {
      await currentSong.stopAsync();
      setCurrentSong(null);
    }
    songRef.current += 1;
    if (songRef.current < savedTracks?.length) {
      const nextTrack = savedTracks[songRef.current];
      setCurrentTrack(nextTrack);
      await play(nextTrack);
    } else {
      setCurrentTrack(savedTracks[0]);
      await play(savedTracks[0]);
    }
  };

  const playPrevTrack = async () => {
    if (currentSong) {
      await currentSong.stopAsync();
      setCurrentSong(null);
    }
    songRef.current -= 1;
    if (songRef.current >= 0 && songRef.current < savedTracks.length) {
      const prevTack = savedTracks[songRef.current];
      setCurrentTrack(prevTack);
      await play(prevTack);
    } else {
      setCurrentTrack(savedTracks[0]);
      await play(savedTracks[0]);
    }
  };

  const handleSearch = (searchResults) => {
    setFilteredTracks(searchResults);
    console.log(searchResults);
  };

  useEffect(() => {
    getUserSaveTracks();
  }, []);

  const circleSize = 12;
  return (
    <>
      <LinearGradient
        colors={['#614385', '#516395']}
        style={styles.containerWrapper}
      >
        <ScrollView style={styles.container}>
          <Pressable
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Search onPress={handleSearch} tracks={savedTracks} />
          <View style={{ marginTop: 50 }} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Liked Songs</Text>
            <Text style={styles.subTitle}>
              {savedTracks?.length ?? 0} songs
            </Text>
          </View>

          <Pressable style={styles.overAllButtonContainer}>
            <Pressable style={styles.downButton}>
              <Feather name="arrow-down" size={20} color="white" />
            </Pressable>

            <View style={styles.playButtonContainer}>
              <MaterialCommunityIcons
                name="cross-bolnisi"
                size={24}
                color="#1db954"
              />
              <Pressable style={styles.playButton} onPress={playTrack}>
                <Entypo name="controller-play" size={24} color="white" />
              </Pressable>
            </View>
          </Pressable>
          {filteredTracks.length === 0 ? (
            <ActivityIndicator size="large" colors="gray" />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredTracks}
              renderItem={({ item, index }) => (
                <SongItem
                  item={item}
                  key={index}
                  onPress={play}
                  isPlaying={item === currentTrack}
                />
              )}
            />
          )}
        </ScrollView>
      </LinearGradient>
      {currentTrack && (
        <Pressable
          style={styles.audioPlayerWrapper}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.artistDetail}>
            <Image
              style={{ width: 40, height: 40 }}
              source={{ uri: currentTrack?.track?.album?.images[0].url }}
            />
            <Text style={styles.artistName} numberOfLines={1}>
              {currentTrack?.track?.name} +{' '}
              {currentTrack?.track?.artists[0].name}
            </Text>
          </View>
          <View style={styles.audioPlayer}>
            <Entypo name="heart" size={24} color="#1dB954" />
            <Pressable>
              <AntDesign name="pausecircle" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>
      )}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        // backdropOpacity={0}
      >
        <View style={styles.modalContent}>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.modalHeader}
          >
            <AntDesign color="white" name="down" size={24} />
            <Text style={styles.headerTitle}>{currentTrack?.track?.name}</Text>
            <Entypo name="dots-three-vertical" size={24} color="white" />
          </Pressable>
          <View style={{ height: 60 }} />
          <View style={{ padding: 10 }}>
            <Image
              style={{ width: '100%', height: 340, borderRadius: 4 }}
              source={{ uri: currentTrack?.track?.album?.images[0].url }}
            />
            <View
              style={{
                marginTop: 20,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}
                  numberOfLines={1}
                >
                  {currentTrack?.track?.name}
                </Text>
                <Text style={{ color: '#D3D3D3', marginTop: 4 }}>
                  {currentTrack?.track?.artists[0].name}
                </Text>
              </View>
              <Entypo name="heart" size={24} color="#1dB954" />
            </View>
            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  width: '100%',
                  marginTop: 10,
                  height: 3,
                  backgroundColor: 'gray',
                  borderRadius: 3,
                }}
              >
                <View
                  style={[styles.progressBar, { width: `${progress * 100}%` }]}
                />
                <View
                  style={[
                    {
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleSize / 2,
                      position: 'absolute',
                      top: -5,
                      backgroundColor: 'white',
                    },
                    {
                      left: `${progress * 100}%`,
                      marginLeft: -circleSize / 2,
                    },
                  ]}
                />
              </View>
              <View
                style={{
                  marginTop: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 15, color: '#D3D3D3' }}>
                  {formatTime(currentTime)}
                </Text>
                <Text style={{ fontSize: 15, color: '#D3D3D3' }}>
                  {formatTime(totalDuration)}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 17,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Pressable>
                <FontAwesome name="arrows" size={30} color="#03C03C" />
              </Pressable>
              <Pressable onPress={playPrevTrack}>
                <Ionicons name="play-skip-back" size={30} color="white" />
              </Pressable>
              <Pressable onPress={handlePlayPause}>
                {isPlaying ? (
                  <AntDesign name="pausecircle" size={60} color="white" />
                ) : (
                  <Entypo name="controller-play" size={60} color="white" />
                )}
              </Pressable>
              <Pressable onPress={playNextTrack}>
                <Ionicons name="play-skip-forward" color="white" size={30} />
              </Pressable>
              <Pressable>
                <Feather name="repeat" color="#03c03c" size={30} />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default LikedSongsScreen;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 50,
  },
  goBackButton: {
    marginHorizontal: 10,
  },
  titleContainer: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subTitle: {
    color: 'white',
    fontSize: 13,
    marginTop: 5,
  },
  overAllButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  downButton: {
    backgroundColor: '#1dB954',
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1dB954',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  audioPlayerWrapper: {
    width: '90%',
    backgroundColor: '#507287',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
    position: 'absolute',
    marginBottom: 15,
    left: 20,
    bottom: 10,
  },
  artistDetail: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  artistName: {
    fontSize: 13,
    width: 220,
    color: 'white',
  },
  audioPlayer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: 700,
    paddingTop: 10,
    backgroundColor: '#507287',
    // flex: 1,
  },
  modalHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    backgroundColor: 'white',
    height: '100%',
  },
});
