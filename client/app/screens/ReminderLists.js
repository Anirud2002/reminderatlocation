import React, {useState, useEffect, useRef} from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import globalcss from '../../config/globalcss';
import LogoFaded from '../assets/logofaded.svg';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {useDimensions} from '@react-native-community/hooks';
import colors from '../../config/colors';
import axios from 'axios'
import ReminderBox from '../components/ReminderBox';
import * as TaskManager from "expo-task-manager"
import * as Location from 'expo-location';

function ReminderLists({navigation}) {
    let [currentLocation, setCurrentLocation] = useState({})
    const deviceHeight = useDimensions().screen.height
    const [action, setAction] = useState('')
    let [reminders, setReminders] = useState([])
    let [reminderClicked, setReminderClicked] = useState(false)
    let [activeRemId, setActiveRemId] = useState('')
    const reminderClickedRef = useRef()
    reminderClickedRef.current = reminderClicked

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            axios.get('http://localhost:3000/reminder/getreminders')
            .then(res => {
                if(res.data){
                    reminders = res.data
                    setReminders(reminders)
                }
            })
        })
        return unsubscribe
    }, [navigation])

    // updates user loaction oftenly
    useEffect(async ()=> {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert("Permission Not Granted")
            return;
        }

        let locationSubscription = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 50 //meters
            }, location => {
                currentLocation = location.coords
                setCurrentLocation(currentLocation)
                // foreach on each reminder and then we calculate the distance
                // between our current and location's lat and long and compare that with the
                // the radius with each of the reminders
                // associated with the location as a logic to push the notification
        })
    }, [])

    const handleDoneAndDeleteReminder = (reminderParentId, reminder) => {
        reminderClicked = !reminderClicked
        setReminderClicked(reminderClicked)

        if (reminderClicked){
            activeRemId = reminder.rem_id
            setActiveRemId(activeRemId)
        }

        setTimeout(() => {
            if(reminderClickedRef.current){
                axios.put(`http://localhost:3000/reminder/deletereminder/${reminderParentId}/${reminder.rem_id}`, reminder)
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