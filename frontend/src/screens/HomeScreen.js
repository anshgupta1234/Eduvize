import React, { Component } from 'react'
import {View, Text, Image, StyleSheet, ScrollView, TouchableHighlight, Linking, Button, TextInput} from "react-native";
import {Body, Left, Right} from "native-base";
import { Header } from 'native-base'
import {LinearGradient} from "expo-linear-gradient";
import Fitness from '@ovalmoney/react-native-fitness';
import * as WebBrowser from 'expo-web-browser'
import Modal from 'react-native-modal';
export default class HomeScreen extends Component {

  componentDidMount(){

  }

  state = {
    duoVisible: false,
    duoName: "",
  };

  connectKhan = async() => {
    const result = await WebBrowser.openBrowserAsync('http://192.168.10.104:5000/api/ka')
  };

  connectDuo = async() => {
    this.setState({ duoVisible: false });
    fetch('http://192.168.10.104:5000/api/duolingo', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.duoName
      })
    }).then(WebBrowser.openBrowserAsync('http://192.168.10.104:5000/api/duolingo'))
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
        <Modal isVisible={this.state.duoVisible}>
          <View style={{ width: 300, height: 175, backgroundColor: 'white', alignSelf: 'center', borderRadius: 20, padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>DuoLingo Username</Text>
            <TextInput
              style={{ width: '100%', height: 50, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, backgroundColor: '#EEE' }}
              placeholder="Enter your Username"
              value={this.state.duoName}
              onChangeText={text => this.setState({ duoName: text })}
            />
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <TouchableHighlight onPress={() => this.setState({ duoVisible: false })} style={{ width: '45%', height: 40, borderRadius: 20, backgroundColor: 'gray', margin: 5, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this.connectDuo} style={{ width: '45%', height: 40, borderRadius: 20, backgroundColor: 'blue', margin: 5, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Submit</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 30, justifyContent: 'center' }}>
          <LinearGradient colors={['#9C56FF', '#b168e0']} style={{ margin: 10, width: '100%', borderRadius: 5, height: 150, alignSelf: 'flex-end' }}>
            <View style={{ padding: 15 }}>
               <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginHorizontal: 20 }}>Connect to these services to earn more points!</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                  <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15 }} onPress={this.connectKhan}>
                    <Image source={require('../../assets/khan.png')} style={{ height: 80, width: 80,  }}/>
                  </TouchableHighlight>
                  <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15 }} onPress={() => this.setState({ duoVisible: true })}>
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