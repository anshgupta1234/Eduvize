import React, { Component } from 'react'
import {View, Text, Image, StyleSheet, ScrollView, TouchableHighlight} from "react-native";
import {Body, Left, Right} from "native-base";
import { Header } from 'native-base'
import {LinearGradient} from "expo-linear-gradient";
import Fitness from '@ovalmoney/react-native-fitness';

export default class HomeScreen extends Component {

  connectKhan = () => {

  };

  connectDuo = () => {

  };

  getHealthData = () => {
    const permissions = [
      { kind: Fitness.PermissionKind.Step, access: Fitness.PermissionAccess.Write },
    ];

    Fitness.isAuthorized(permissions)
      .then((authorized) => {
        console.warn(Fitness.getSteps({ startDate: new Date(2020, 4, 12) }))
      })
      .catch((error) => {
        // Do something
      });
  };

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
        <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 30 }}>
          <LinearGradient colors={['#9C56FF', '#b168e0']} style={{ margin: 10, width: '100%', borderRadius: 5, height: 150, alignSelf: 'flex-end' }}>
            <View style={{ padding: 15 }}>
               <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginHorizontal: 20 }}>Connect to these services to earn more points!</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                  <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15 }} onPress={this.connectKhan}>
                    <Image source={require('../../assets/khan.png')} style={{ height: 80, width: 80,  }}/>
                  </TouchableHighlight>
                  <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15 }} onPress={this.connectDuo}>
                    <Image source={require('../../assets/duo.png')} style={{ height: 60, width: 60,  }}/>
                  </TouchableHighlight>
                  <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15 }} onPress={this.getHealthData}>
                    <Image source={require('../../assets/fitbit.png')} style={{ height: 60, width: 60,  }}/>
                  </TouchableHighlight>
                </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center'
  },
  header: {
    backgroundColor: '#373737',
    width: '100%'
  }
});