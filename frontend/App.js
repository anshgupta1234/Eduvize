import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from "./src/screens/SettingsScreen";
import { Icon } from "react-native-elements";
import HomeScreen from "./src/screens/HomeScreen";
import StoreScreen from "./src/screens/StoreScreen";

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = 'ios-home';
              return <Icon name={iconName} size={size} color={color} type='ionicon'/>;
            } else if (route.name === 'Store') {
              iconName = 'ios-settings';
              return <Image source={require('./assets/icon.png')} style={{ width: size, height: size }}/>
            } else if (route.name === 'Profile') {
              iconName = 'ios-settings';
              return <Image source={require('./assets/profile-pic.jpeg')} style={{ width: size, height: size, borderRadius: size/2 }}/>
            }

            // You can return any component that you like here!

          },
        })}
        tabBarOptions={{
          activeTintColor: '#9C56FF',
          inactiveTintColor: 'gray',
          activeBackgroundColor: '#373737',
          inactiveBackgroundColor: '#373737'
        }}
      >
        <Tab.Screen name="Dashboard" component={HomeScreen} />
        <Tab.Screen name="Store" component={StoreScreen} />
        <Tab.Screen name="Profile" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
