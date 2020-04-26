import React, { Component } from 'react';
import {View, Text, ScrollView, TouchableWithoutFeedback, AsyncStorage, TouchableHighlight, StyleSheet, Image, StatusBar } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import {normalize} from "react-native-elements";

export default class SettingsScreen extends Component {

  render(){
    return (
      <View style={styles.container}>
        <Image style={{ width: 150, height: 150, borderRadius: 100, margin: 20 }} source={require('../../assets/profile-pic.jpeg')} />
        <Text style={{ fontWeight: "bold", fontSize: 20, color: 'white' }}>Ansh Gupta</Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Image style={{ width: 35, height: 35 }} source={require('../../assets/icon.png')} />
          <Text style={{ fontSize: 17, color: 'white' }}>  4568</Text>
        </View>
        <ScrollView style={styles.settingsContainer}>
          <View style={styles.accountType}>
            <View style={{ marginLeft: 10, flexDirection: 'column', alignSelf: 'flex-start', height: '100%', flex: 1, justifyContent: 'center' }}>
              <Text style={styles.text}>Account Type</Text>
              <Text style={{ color: '#99ccff', fontSize: 14 }}>Basic</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center'}}>
              <LinearGradient colors={['#9C56FF', '#E06BDA']} style={{ margin: 10, width: 125, justifyContent: 'center', borderRadius: 5, height: 40, alignSelf: 'flex-end' }}>
                <TouchableWithoutFeedback style={{ flex: 1, alignItems: 'center', height: 50, justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center', color: 'white', fontSize: 14 }}>UPGRADE</Text>
                </TouchableWithoutFeedback>
              </LinearGradient>
            </View>
          </View>
          <View style={styles.settingsBaseContainer}>
            <TouchableHighlight
              style={[styles.settingsBase, { borderTopLeftRadius: 5, borderTopRightRadius: 5 }]}
            >
              <Text style={styles.text}>Options</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.settingsBase}>
              <Text style={styles.text}>My Account</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.settingsBase}>
              <Text style={styles.text}>Help Center</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.settingsBase, { borderBottomRightRadius: 5, borderBottomLeftRadius: 5, borderBottomWidth: 0 }]}>
              <Text style={styles.text}>About</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    resizeMode: 'contain',
    width: normalize(200),
    height: 80,
    marginTop: 10
  },
  settingsContainer: {
    width: '85%',
    marginTop: 30,
  },
  accountType: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#000',
    height: 75,
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: '#373737'
  },
  settingsBase: {
    borderBottomWidth: 1,
    borderColor: '#000',
    height: 75,
    justifyContent: 'center',
    backgroundColor: '#373737',
    paddingLeft: 10
  },
  settingsBaseContainer: {
    borderRadius: 10,
    borderWidth: 1
  },
  text: {
    fontSize: 16,
    color: 'white'
  }
});