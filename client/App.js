import 'react-native-gesture-handler';
import {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Easing, StyleSheet, Text, View } from 'react-native';
import WelcomePage from './app/screens/WelcomePage';
import ReminderLists from './app/screens/ReminderLists';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Footer from './app/components/Footer';
import { useDimensions } from '@react-native-community/hooks';
import NewReminder from './app/screens/NewReminder';

const Stack = createNativeStackNavigator(); 
export default function App() {

  const closeConfig = {
    animation: 'timing',
    config: {
      duration: 500,
      easing: Easing.linear
    }
  }
  
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="WelcomePage" component={WelcomePage}/>
          <Stack.Screen name="ReminderLists" component={ReminderLists}/>
          <Stack.Screen name="NewReminder" component={NewReminder}/>
        </Stack.Navigator>
        <Footer/>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({

});
