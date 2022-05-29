import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Button, Text, Animated } from 'react-native';
import { SvgUri } from 'react-native-svg';
import * as Font from 'expo-font'
import colors from '../../config/colors';
import Logo from '../assets/logo.svg'
import NewReminder from './NewReminder';
import { AntDesign } from '@expo/vector-icons';

function WelcomePage(props) {
    const {navigation} = props
    const [fontLoaded, setFontLoaded] = useState(false)
    let opacity = useState(new Animated.Value(0))[0]
    let transformVertical = useState(new Animated.Value(0))[0]

    useEffect(async () => {
        await Font.loadAsync({
            'Padauk-Regular': require('../assets/fonts/Padauk-Regular.ttf'),
        });
        setFontLoaded(true)

        // setTimeout(() => {
        //     Animated.timing(opacity, {
        //         toValue: 0,
        //         duration: 500,
        //         useNativeDriver: true
        //     }).start()
        //     navigation.navigate('ReminderLists')
        // }, 1000)
        Animated.timing(transformVertical, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start()
        })

    }, [])
    if(fontLoaded){
    return (
        <Animated.View style={{...styles.background}} >
            <Animated.View style={{...styles.logoContainer, transform: [{translateY: transformVertical}]}}>
                <Logo/>
                <Text 
                    style={{...styles.logoTitle, 
                            fontFamily: fontLoaded && 'Padauk-Regular'
                        }}>
                            ReminderAtLocation
                </Text>
            </Animated.View>
            <Animated.View style={{...styles.signInBtnContainer, opacity: opacity}}>
                <AntDesign name="google" size={24} color="black" />
                <Button color='black' style={{...styles.signInBtn}} title='Sign in with Google'/>    
            </Animated.View>        
        </Animated.View>
    );
    }else{
        return <Text>Font loading...</Text>
    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: colors.primary,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems:'center'
    },
    logoTitle:{
        fontSize: 20,
        color: '#fff',  
        marginTop: 10
    },
    signInBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5
    },
    signInBtn: {
        color: 'white'
    }
})

export default WelcomePage;