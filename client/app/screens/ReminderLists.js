import React, {useState, useEffect} from 'react';
import { View, Text, SafeAreaView, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import globalcss from '../../config/globalcss';
import LogoFaded from '../assets/logofaded.svg';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {useDimensions} from '@react-native-community/hooks';
import colors from '../../config/colors';
import axios from 'axios'

function ReminderLists({navigation}) {
    const deviceHeight = useDimensions().screen.height
    const [reminders, setReminders] = useState([])
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            axios.get('http://localhost:3000/reminder/getreminders')
            .then(res => {
                setReminders(res.data)
            })
        })
        return unsubscribe
    }, [navigation])

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
                            return <View key={rem.rem_id} style={styles.reminderBox}>
                                        <View style={styles.checkCircle}></View>
                                        <View>
                                            <Text style={styles.reminderTitle}>{rem.reminderTitle}</Text>
                                            {rem.remDescription && (
                                                <Text style={styles.reminderDescription}>{rem.reminderDescription}</Text>
                                            )}
                                        </View>
                                    </View>
                        })}
                        
                    </View>
                })}
            </View>
            <View style={{...styles.addReminderBtn, top: deviceHeight - 200}}>
                <Entypo onPress={() => navigation.navigate('NewReminder')} size={50} name="plus" color={colors.secondary}/>
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

    reminderBox: {
        width: '100%',
        height: 50,
        marginTop: 5,
        paddingHorizontal: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderRadius: 5
    },

    checkCircle: {
        width: 25,
        height: 25,
        borderWidth: 3,
        borderColor: colors.primary,
        borderRadius: 50,
        marginRight: 20
    },  

    reminderTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: colors.textPrimary
    },  

    reminderDescription: {
        color: colors.textSecondary
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