import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import LikedSongsScreen from './screens/LikedSongsScreen';
import SongInfoScreen from './screens/SongInfoScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { color: 'white' },
        tabBarStyle: {
          backgroundColor: 'rgba(0,0,0,0.5)',
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 4,
          shadowOpacity: 4,
          shadowRadius: 4,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        component={HomeScreen}
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="home" size={24} color="white" />
            ) : (
              <Ionicons name="home-outline" size={24} color="white" />
            ),
        }}
      />
      <Tab.Screen
        component={ProfileScreen}
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="white" />
            ) : (
              <Ionicons name="person-outline" size={24} color="white" />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Liked"
          options={{ headerShown: false }}
          component={LikedSongsScreen}
        />
        <Stack.Screen
          name="Info"
          options={{ headerShown: false }}
          component={SongInfoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
