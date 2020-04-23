import React from 'react';
import {StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native'
import {normalize} from "react-native-elements";

const SubmitButton = ({ text, onPress, color }) => {
    color = color === undefined ? '#9B51E0' : color;
    const styles = StyleSheet.create({
        buttonContainer: {
            backgroundColor: color,
            paddingVertical: 15,
            borderRadius: 15,
            width: Dimensions.get('window').width * 0.9
        },
        buttonText: {
            textAlign: 'center',
            fontSize: normalize(16),
        },
    });
  return (
      <TouchableOpacity style={styles.buttonContainer} onPress={() => onPress()}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    );
};

export default SubmitButton
