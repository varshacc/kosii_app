import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image} from 'react-native' ;
// import firebase from 'firebase';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef } from 'react';
function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '100%', height: '100%'}}>
        <WebView 
          source={{ uri: 'https://www.koskii.com/'}}
          onLoad={console.log('Loaded home!')}
        />
        </View>
    </View>
  );
}

function CatScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '100%', height: '100%'}}>
        <WebView 
          source={{ uri: 'https://www.koskii.com/collections/categories'}}
          onLoad={console.log('categories Loaded!')}
        />
        </View>
    </View>
  );
}

function CartScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '100%', height: '100%'}}>
        <WebView 
          source={{ uri: 'https://www.koskii.com/cart'}}
          onLoad={console.log('cart Loaded!')}
        />
        </View>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '100%', height: '100%'}}>
        <WebView 
          source={{ uri: 'https://www.koskii.com/account/login?return_url=%2Faccount'}}
          onLoad={console.log('Profile Loaded!')}
        />
       
        </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
    initialRouteName="Feed"
    screenOptions={{
      activeTintColor: '#7a3331',
    }}
    >
      <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{
        title: 'Koskii',
        tabBarIcon: ({size,focused,color}) => {
          return (
            <Image
              style={{ width: size, height: size }}
              source={require('./icons/koskiilogo.png')}
            />
          );
        },
      }}
      />
      <Tab.Screen name="Categories" component={CatScreen} 
      options={{
        tabBarLabel: 'Categories',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="select-group" color={color} size={size} />
        ),
      }}/>
      <Tab.Screen name="Cart" component={CartScreen} 
      options={{
        tabBarLabel: 'Cart',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="cart" color={color} size={size} />
        ),
      }}/>
      <Tab.Screen name="Profile" component={ProfileScreen}
      options={{
        tabBarLabel:'Profile',
        tabBarIcon: ({color,size}) => (
        <MaterialCommunityIcons name="account" size={size} color = {color}/>
        )
      }}
      />
    </Tab.Navigator>
  );
}
// Show notifications when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    }
  },
})

export default function App() {
  useEffect(() => {
    // Permission for iOS
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then(statusObj => {
        // Check if we already have permission
        if (statusObj.status !== "granted") {
          // If permission is not there, ask for the same
          return Permissions.askAsync(Permissions.NOTIFICATIONS)
        }
        return statusObj
      })
      .then(statusObj => {
        // If permission is still not given throw error
        if (statusObj.status !== "granted") {
          throw new Error("Permission not granted")
        }
      })
      .then(() => {
        return Notifications.getExpoPushTokenAsync()
      })
      .then(response => {
        const deviceToken = response.data
        console.log({ deviceToken })
      })
      .catch(err => {
        return null
      })
  }, [])

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log("Notification Received!")
        console.log(notification)
      }
    )

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log("Notification Clicked!")
        console.log(response)
      })
    return () => {
      receivedSubscription.remove()
      responseSubscription.remove()
    }
  }, [])

  const triggerLocalNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Local Notification",
        body: "Hello this is a local notification!",
      },
      trigger: { seconds: 5 },
    })
  }
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
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
