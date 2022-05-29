import React, {useState, useEffect, useRef} from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import globalcss from '../../config/globalcss';
import LogoFaded from '../assets/logofaded.svg';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {useDimensions} from '@react-native-community/hooks';
import colors from '../../config/colors';
import axios from 'axios';
import * as Device from 'expo-device';
import ReminderBox from '../components/ReminderBox';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

function ReminderLists({navigation}) {
    let [currentLocation, setCurrentLocation] = useState({})
    let [reminders, setReminders] = useState([])
    let [reminderClicked, setReminderClicked] = useState(false)
    let [activeRemId, setActiveRemId] = useState('')
    const deviceHeight = useDimensions().screen.height
    const [action, setAction] = useState('')
    const reminderClickedRef = useRef()
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    reminderClickedRef.current = reminderClicked

    // gets all the reminders from database
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            axios.get('https://reminder-at-location-server.herokuapp.com/reminder/getreminders')
            .then(res => {
                if(res.data){
                    reminders = res.data.result
                    setReminders(reminders)
                }
            })
            .catch(err => console.log(err))
        })
        return unsubscribe
    }, [navigation])

    // updates user location in regular interval
    useEffect(async ()=> {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert("Permission Not Granted")
            return;
        }
        let locationSubscription = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 5 //meters
            }, location => {
                currentLocation = location.coords
                setCurrentLocation(currentLocation)
                let latUser = currentLocation.latitude
                let lonUser = currentLocation.longitude
                if(reminders.length > 0){
                    reminders.forEach(reminder => {
                        let latLocation = reminder.location.locationDetails.lat
                        let lonLocation = reminder.location.locationDetails.lng
                        let distance = getDistanceFromLatLonInKm(latLocation, lonLocation, latUser, lonUser)
                        if(validateNotificationCondition(reminder, distance)){
                            schedulePushNotification()
                        }
                    })
                }
        })

        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
        });

        return () => {
            locationSubscription.unsubscribe();
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        }
    }, [])

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }
        
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    
        return token;
    }

    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
          },
          trigger: { seconds: 2 },
        });
    }

    // validates if notification should be pushed
    let validateNotificationCondition = (reminder, distance) => {
        reminder.location.reminders.forEach(rem => {
            if (rem.radius >= distance){
                return true
            }
            return false
        })
    }

    // gets distance between current user's location and desination in miles
    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return 0.62137 * d; // distance in mile
      }
      
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      } 

    // handles done and delete event for reminderBox
    const handleDoneAndDeleteReminder = (reminderParentId, reminder) => {
        reminderClicked = !reminderClicked
        setReminderClicked(reminderClicked)

        if (reminderClicked){
            activeRemId = reminder.rem_id
            setActiveRemId(activeRemId)
        }

        setTimeout(() => {
            if(reminderClickedRef.current){
                axios.put(`https://reminder-at-location-server.herokuapp.com/reminder/deletereminder/${reminderParentId}/${reminder.rem_id}`, reminder)
                .then(res => {
                    setReminders(res.data)
                    setReminderClicked(false)
                }) 
            }
        }, action === "DELETE" ? 800 : 1200) 
    }

    return (
        <SafeAreaView style={styles.background}>
            <LogoFaded style={styles.imageBackground}/>
            <Text style={styles.heading}>Reminders</Text>
            {reminders.length > 0 && (
                <View style={styles.reminderContainer}>
                    {reminders.map(reminder => {
                        return <View key={reminder._id} style={styles.reminder}>
                            <View style={styles.location}>
                                <View><Ionicons name="location-sharp" size={24} color={colors.secondary} /></View>
                                <View><Text style={styles.locationName}>{reminder.location.locationName}</Text></View>
                            </View>
                            {reminder.location.reminders.map(rem => {
                                return <ReminderBox
                                        action={action}
                                        setAction={setAction}
                                        handleDoneAndDeleteReminder={handleDoneAndDeleteReminder}
                                        rem={rem}
                                        reminderId={reminder._id}
                                        reminder={reminder}
                                        key={rem.rem_id}
                                        navigation={navigation}
                                        reminderClicked={reminderClicked}
                                        activeRemId={activeRemId}
                                        />
                            })}
                        </View>
                    })}
                </View>
            )}
            <View style={{...styles.addReminderBtn, top: deviceHeight - 200}}>
                <Entypo onPress={() => navigation.navigate('NewReminder')}
                    size={50} name="plus"
                    color={colors.secondary}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#fff'
    },

    imageBackground: {
        width: 100,
        height: 100,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [
        {
            translateX: -50,
        },
        {
            translateY: -50
        },
        {
            scale: 1.2
        }]
    },

    heading: {
        marginLeft: globalcss.screenMargin,
        marginTop: globalcss.screenMargin,
        fontSize: 26,
        fontWeight: '600'
    },

    reminderContainer: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 10,
    },

    reminder: {
        marginVertical: 10
    },

    location: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },

    locationName: {
        fontSize: 14, 
        fontWeight: '600',
        color: colors.textPrimary
    },  

    addReminderBtn: {
        width: 50,
        height: 50,
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        marginRight: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 3
    }
})

export default ReminderLists;