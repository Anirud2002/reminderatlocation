import React, { useState } from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton, TouchableHighlight } from 'react-native-gesture-handler';
import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

function ReminderBox({rem, 
    reminderId,
    handleDeleteReminder, 
    handleDoneReminder,
    reminderClicked,
    activeRemId
}) {


    const renderRightActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [5, 10, 20, 21],
        });

        return (
          <RectButton style={styles.leftAction} onPress={() => handleDeleteReminder(reminderId, rem)}>
            <Animated.Text
              style={[
                styles.actionText,
                {
                  transform: [{ translateX: trans }],
                },
              ]}>
              <Ionicons name="trash" size={28} color="black" />
            </Animated.Text>
          </RectButton>
        );
      };

    return (
        <Swipeable renderRightActions={renderRightActions}>
                    <View key={rem.rem_id} style={styles.reminderBox}>
                        <TouchableHighlight style={styles.checkCircle} onPress={() => handleDoneReminder(reminderId, rem)}>
                            {(reminderClicked && rem.rem_id === activeRemId) && (
                                <View style={styles.circleChecked}></View>
                            )}
                        </TouchableHighlight>
                        <View>
                            <Text style={styles.reminderTitle}>{rem.reminderTitle}</Text>
                            {rem.remDescription && (
                                <Text style={styles.reminderDescription}>{rem.reminderDescription}</Text>
                            )}
                        </View>
                    </View>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    leftAction: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
        marginRight: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },  

    circleChecked: {
        width: 15,
        height: 15,
        borderRadius: 50,
        backgroundColor: colors.primary
    },  

    reminderTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: colors.textPrimary
    },  

    reminderDescription: {
        color: colors.textSecondary
    },
})

export default ReminderBox;