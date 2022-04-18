import React, {useState, useRef, useEffect} from 'react';
import {AppRegistry, View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import {Slider} from '@miblanchard/react-native-slider';
import LogoFaded from "../assets/logofaded.svg"
import globalcss from '../../config/globalcss';
import colors from '../../config/colors';
import {useDimensions} from '@react-native-community/hooks'
import { MaterialIcons } from '@expo/vector-icons'; 
import axios from 'axios'

function EditReminder({navigation, route}) {
    const {parentReminder, rem} = route.params
    const ref = useRef()
    useEffect(() => {
        ref.current?.setAddressText(parentReminder.location.locationName)
    }, [])
    const deviceHeight = useDimensions().screen.height
    let [editReminder, setEditReminder] = useState({
        location: {
            locationName: parentReminder.location.locationName,
            reminders: [],
            locationDetails: {
                lat: parentReminder.location.locationDetails.lat,
                lng: parentReminder.location.locationDetails.lng,
            }
        }
    })
    console.log(editReminder)

    const [reminderDetails, setReminderDetails] = useState({
        rem_id: rem.rem_id,
        reminderTitle: rem.reminderTitle,
        reminderDescription: rem.reminderDescription,
        radius: rem.radius
    })

    const handleSubmitReminder = async () => {
        editReminder.location.reminders.push(reminderDetails)
        setEditReminder(editReminder)
         console.log(editReminder)
        await axios.put(`http://localhost:3000/reminder/edit/${parentReminder._id}/${rem.rem_id}`, editReminder)
        .then((res) => {
            if(res.data.success){
                setEditReminder({
                    location: {
                        locationName: '',
                        reminders: [],
                        locationDetails: {
                            lat: 0,
                            lng: 0,
                        }
                    }
                })
                ref.current.clear()
                navigation.navigate('ReminderLists')
            }
        })
        .catch(err => console.log(err))

        
        

    }
    return (
        <SafeAreaView style={styles.background}>
            <LogoFaded style={styles.imageBackground}/>
            <View style={styles.header}>
                    <Ionicons onPress={() => navigation.goBack() } name='chevron-back' size={32} color='#000'/>
                <Text style={styles.heading}>Edit Reminder</Text>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.googleAutoComplete}>
                    <Text style={styles.label}>Location:</Text>
                    <GooglePlacesAutocomplete 
                        ref={ref}
                        placeholder='Search'
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            console.log(data)
                            setEditReminder({...editReminder, location: {...editReminder.location, 
                                locationName: details.name,
                                locationDetails: {
                                    ...editReminder.location.locationDetails,
                                    lat: details.geometry.location.lat,
                                    lng: details.geometry.location.lng,
                                }
                            }})
                        }
                    }
                        query={{
                            key: 'AIzaSyAJORjFPaRVF0UB_C-e8zwww5lNIleTIAU',
                            language: 'en',
                        }}
                        styles={{
                        textInput: {
                            ...styles.input
                        }}
                    }
                    />
                </View>
                <View style={styles.firstInputBox}>
                    <Text style={styles.label}>Radius: {reminderDetails.radius} mi</Text>
                    <Slider 
                        minimumTrackTintColor={colors.primary}
                        thumbTintColor={colors.secondary}
                        style={styles.slider} value={reminderDetails.radius} 
                        onValueChange={(value) => {
                            setReminderDetails({
                                ...reminderDetails,
                                radius: Math.round(value * 10) / 10
                            })    
                        }}
                    />
                </View>
                <View style={styles.inputBox}>
                    <Text style={styles.label}>Reminder:</Text>
                    <TextInput value={reminderDetails.reminderTitle} onChangeText={(text) => {
                        setReminderDetails({...reminderDetails, reminderTitle: text})
                    }} style={styles.input}/>
                </View>
                <View style={styles.inputBox}>
                    <Text style={styles.label}>Description:</Text>
                    <TextInput value={reminderDetails.reminderDescription} onChangeText={text => {
                        setReminderDetails({...reminderDetails, reminderDescription: text})
                    }} style={styles.input}/>
                </View>     
            </View>
            <View style={{...styles.saveReminderBtn, top: deviceHeight - 200}}>
                <MaterialIcons onPress={handleSubmitReminder} size={40} name="done" color={colors.secondary}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#fff'
    },

    header: {
        display: 'flex',
        marginLeft: globalcss.screenMargin,
        flexDirection: 'row',
        alignItems:'center'
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
        fontSize: 26,
        fontWeight: '600'
    },

    inputContainer: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 20,
    },

    firstInputBox: {
        marginTop: 90
    },  

    inputBox: {
        width: '100%',
        marginVertical: 10
    },

    googleAutoComplete:{
        position: 'absolute',
        height: 'auto',
        zIndex: 100,
        width: '100%',
    },

    label: {
        fontSize: 14,
        fontWeight: '600'
    },

    input: {
        width: '100%',
        height: 50,
        marginTop: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 5,
        color: 'rgba(105, 104, 104, 1)',
        fontSize: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderRadius: 5
    },
    
    slider: {
        width: '50%',
        
    },

    saveReminderBtn: {
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

AppRegistry.registerComponent('SliderExample', () => SliderExample);

export default EditReminder;