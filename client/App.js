// need to put gesture handler on top of the project
import 'react-native-gesture-handler';
import {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WelcomePage from './app/screens/WelcomePage';
import ReminderLists from './app/screens/ReminderLists';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Footer from './app/components/Footer';
import NewReminder from './app/screens/NewReminder';
import EditReminder from './app/screens/EditReminder';

const Stack = createNativeStackNavigator(); 
export default function App() {
  
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="WelcomePage" component={WelcomePage}/>
          <Stack.Screen name="ReminderLists" component={ReminderLists}/>
          <Stack.Screen name="NewReminder" component={NewReminder}/>
          <Stack.Screen name="EditReminder" component={EditReminder}/>
        </Stack.Navigator>
        <Footer/>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({

});
