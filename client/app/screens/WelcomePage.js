import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Image, Text, Animated } from 'react-native';
import { SvgUri } from 'react-native-svg';
import * as Font from 'expo-font'
import colors from '../../config/colors';
import Logo from '../assets/logo.svg'
import NewReminder from './NewReminder';

function WelcomePage(props) {
    const {navigation} = props
    const [fontLoaded, setFontLoaded] = useState(false)
    const opacity = useState(new Animated.Value(1))[0]

    useEffect(async () => {
        await Font.loadAsync({
            'Padauk-Regular': require('../assets/fonts/Padauk-Regular.ttf'),
        });
        setFontLoaded(true)

        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            }).start()
            navigation.navigate('ReminderLists')
        }, 1000)

    }, [])
    if(fontLoaded){
    return (
        <Animated.View style={{...styles.background, opacity: opacity}} >
            <View style={styles.logoContainer}>
                <Logo/>
                <Text 
                    style={{...styles.logoTitle, 
                            fontFamily: fontLoaded && 'Padauk-Regular'
                        }}>
                            ReminderAtLocation
                </Text>
            </View>
        </Animated.View>
    );
    }else{
        return <Text>Thulu</Text>
    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: colors.primary,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoContainer: {
        alignItems:'center'
    },
    logoTitle:{
        fontSize: 20,
        color: '#fff',
        marginTop: 10
    }
})

export default WelcomePage;