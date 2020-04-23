import React, { Component } from 'react'
import {View, Text, ScrollView, TouchableWithoutFeedback, AsyncStorage, TouchableHighlight, StyleSheet, Image, StatusBar, Dimensions } from 'react-native';

function GiftCard({ color, logo, textColor, price }) {
  return (
    <View style={{ backgroundColor: color, width: '100%', height: 175, borderRadius: 20, padding: 30, marginTop: 30 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={logo} style={{ width: 50, height: 50, marginRight: 40 }} />
        <Image source={require('../../assets/icon.png')} style={{ width: 40, height: 40 }} />
        <Text style={{ color: textColor, fontSize: 18 }}>  {price}</Text>
      </View>
      <Text style={{ color: textColor, marginTop: 40, fontSize: 20 }}>X-X-X-X  X-X-X-X  X-X-X-X</Text>
    </View>
  )
}

export default GiftCard;