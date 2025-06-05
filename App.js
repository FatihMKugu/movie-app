import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import ListScreen from './src/screens/ListScreen';
import { FavoritesProvider } from './src/context/FavoritesContext'; // context

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'Film Detayı' }} />
    </Stack.Navigator>
  );
}

function ListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Listem" component={ListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'Film Detayı' }} />
    </Stack.Navigator>
  );
}


// 
function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'Film Detayı' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'HomeStack') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'ListStack') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'SearchStack') {
                iconName = focused ? 'search' : 'search-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'red',
            tabBarInactiveTintColor: 'black',
          })}
        >
          <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Ana Sayfa' }} />
          <Tab.Screen name="ListStack" component={ListStack} options={{ title: 'Listem' }} />
          <Tab.Screen name="SearchStack" component={SearchStack} options={{ title: 'Ara' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}