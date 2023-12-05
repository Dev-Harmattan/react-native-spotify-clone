import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Entypo,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SongInfoScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [tracks, setTracks] = useState([]);
  const albumUrl = item?.track?.album?.uri;
  const albumId = albumUrl.split(':')[2];

  useLayoutEffect(() => {
    const fetAlbumTracks = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const response = await fetch(
          `https://api.spotify.com/v1/albums/${albumId}/tracks`,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          }
        );
        const tracks = await response.json();
        setTracks(tracks?.items);
      } catch (error) {
        console.log(error);
      }
    };

    fetAlbumTracks();
  }, [albumId, item, route]);
  return (
    <LinearGradient colors={['#040306', '#131624']} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="white"
          />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              style={{ width: 200, height: 200 }}
              source={{ uri: item?.track?.album?.images[0].url }}
            />
          </View>
        </View>
        <Text
          style={{
            fontSize: 22,
            color: 'white',
            marginHorizontal: 12,
            marginTop: 10,
            fontWeight: 'bold',
          }}
        >
          {item?.track?.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 12,
            marginTop: 10,
            flexWrap: 'wrap',
            gap: 7,
          }}
        >
          {item?.track?.artists?.map((artist, index) => (
            <Text
              style={{ color: '#909090', fontWeight: 'bold', fontSize: 13 }}
              key={index}
            >
              {artist.name}
            </Text>
          ))}
        </View>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}
        >
          <Pressable
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: '#1DB954',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AntDesign name="arrowdown" size={20} color="white" />
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <MaterialCommunityIcons
              name="cross-bolnisi"
              size={24}
              color="#1DB954"
            />
            <Pressable
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1DB954',
              }}
            >
              <Entypo name="controller-play" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>

        <View>
          <View style={{ marginTop: 10, marginHorizontal: 12 }}>
            {tracks?.map((track, index) => (
              <Pressable
                style={{
                  marginVertical: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text
                    style={{ fontSize: 16, fontWeight: '500', color: 'white' }}
                  >
                    {track?.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 5,
                    }}
                  >
                    {track?.artists?.map((item, index) => (
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '500',
                          color: 'gray',
                        }}
                      >
                        {item?.name}
                      </Text>
                    ))}
                  </View>
                </View>
                <Entypo name="dots-three-vertical" size={24} color="white" />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SongInfoScreen;

const styles = StyleSheet.create({});
