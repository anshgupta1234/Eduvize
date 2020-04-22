import React, { Component } from 'react'
import {View, Text, Image, StyleSheet, ScrollView} from "react-native";
import {Body, Left, Right} from "native-base";
import { Header } from 'native-base'
export default class HomeScreen extends Component {
  render(){
    return (
      <View style={styles.container}>
        <Header style={styles.header}>
          <Body>
            <Text style={{ fontSize: 20, color: 'white' }}>Dashboard</Text>
          </Body>
          <Right>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center', height: '100%' }}>
              <Image style={{ width: 35, height: 35 }} source={require('../../assets/icon.png')} />
              <Text style={{ fontSize: 17, color: 'white' }}>  4568</Text>
            </View>
          </Right>
        </Header>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: 'black'
  },
  header: {
    backgroundColor: '#373737'
  }
});