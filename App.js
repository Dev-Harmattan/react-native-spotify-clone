import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './NativeStack';
import { PlayerProvider } from './PlayerContext';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <PlayerProvider>
        <Navigation />
      </PlayerProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
