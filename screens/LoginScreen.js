import { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { Entypo } from '@expo/vector-icons';
import {
  makeRedirectUri,
  useAuthRequest,
  refreshAsync,
} from 'expo-auth-session';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

import SignInButton from '../components/SigninButton';
import OutlineButton from '../components/UI/Buttons/OutlineButton';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const scopes = [
  'user-read-email',
  'user-read-private',
  'user-library-read',
  'user-read-recently-played',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
];

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
      scopes: scopes,
      usePKCE: false,
      redirectUri: makeRedirectUri({
        native: Linking.createURL(),
      }),
    },
    discovery
  );

  // Trigger the sign for Authorization code and access token
  useLayoutEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      const authorization = async () => {
        try {
          const tokenEndpoint = 'https://accounts.spotify.com/api/token';

          const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
              redirect_uri: makeRedirectUri({
                native: Linking.createURL(),
              }),
              code,
              grant_type: 'authorization_code',
              client_secret: process.env.EXPO_PUBLIC_SPOTIFY_SECRET_KEY,
            }).toString(),
          });
          const tokenData = await tokenResponse.json();
          const { access_token, expires_in, refresh_token } = tokenData;
          const tokenExpiredTime = new Date().getTime() + expires_in * 1000;
          await AsyncStorage.setItem('access_token', access_token);
          await AsyncStorage.setItem(
            'tokenExpiredTime',
            JSON.stringify(tokenExpiredTime)
          );
          await AsyncStorage.setItem('refresh_token', refresh_token);
          navigation.navigate('Main');
        } catch (error) {
          console.log(error);
          navigation.navigate('Login');
        } finally {
          setIsLoading(false);
        }
      };
      authorization();
    }
  }, [response]);

  // token validity and refresh
  useLayoutEffect(() => {
    const tokenValidity = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        const tokenExpiredTime = await AsyncStorage.getItem('tokenExpiredTime');

        if (token && tokenExpiredTime) {
          const currentTime = new Date().getTime();
          if (currentTime < parseInt(tokenExpiredTime)) {
            navigation.replace('Main');
          } else {
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('tokenExpiredTime');

            const refreshResponse = await refreshAsync(
              {
                clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
                clientSecret: process.env.EXPO_PUBLIC_SPOTIFY_SECRET_KEY,
                refreshToken: refreshToken,
                scopes: scopes,
              },
              discovery
            );

            const { accessToken, expiresIn } = refreshResponse;
            await AsyncStorage.setItem('access_token', accessToken);
            await AsyncStorage.setItem(
              'tokenExpiredTime',
              JSON.stringify(expiresIn)
            );
          }
        }
      } catch (error) {
        console.log(error);
        navigation.navigate('Login');
      }
    };
    tokenValidity();
  }, []);

  return (
    <LinearGradient colors={['#040306', '#131624']} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={styles.topView} />
        <Entypo
          style={styles.iconStyle}
          name="spotify"
          size={80}
          color="#1BB954"
        />
        <Text style={styles.title}>Millions of Songs Free on spotify!</Text>
        <View style={styles.topView} />
        <SignInButton
          disable={!request || isLoading}
          onPress={() => {
            promptAsync();
            setIsLoading(true);
          }}
        />
        <OutlineButton
          type="phone"
          size={24}
          title="Continue with your phone"
          color="white"
        />
        <OutlineButton
          type="google"
          size={24}
          title="Continue with Google"
          color="red"
        />
        <OutlineButton
          type="facebook"
          size={24}
          title="Sign In with Facebook"
          color="#3081D0"
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  topView: {
    marginTop: 80,
  },
  iconStyle: {
    textAlign: 'center',
  },
  title: {
    marginTop: 40,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 20,
  },
});
