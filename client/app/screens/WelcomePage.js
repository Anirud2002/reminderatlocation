import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { SvgUri } from 'react-native-svg';
import * as Font from 'expo-font'
import colors from '../../config/colors';
import Logo from '../assets/logo.svg'
import NewReminder from './NewReminder';

function WelcomePage(props) {
    const {navigation} = props
    const [fontLoaded, setFontLoaded] = useState(false)
    useEffect(async () => {
        await Font.loadAsync({
            'Padauk-Regular': require('../assets/fonts/Padauk-Regular.ttf'),
        });
        setFontLoaded(true)
    }, [])
    if(fontLoaded){
    return (
        <View style={styles.background} >
            <View style={styles.logoContainer}>
                <Logo/>
                <Text 
                    onPress={() => navigation.navigate('ReminderLists')}
                    style={{...styles.logoTitle, 
                            fontFamily: fontLoaded && 'Padauk-Regular'
                        }}>
                            ReminderAtLocation
                </Text>
            </View>
        </View>
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