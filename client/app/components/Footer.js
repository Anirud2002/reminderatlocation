import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import colors from '../../config/colors';


function Footer(props) {
    let {height} = useDimensions().screen
    return (
        <View style={{position: 'absolute', top: height - 50, width: '100%', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.footerText}>Made by Anirud</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    footerText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: '600',
    }
})

export default Footer;