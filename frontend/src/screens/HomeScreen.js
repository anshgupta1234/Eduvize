import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Linking,
  Button,
  TextInput,
  AsyncStorage,
  StatusBar,
  RefreshControl
} from "react-native";
import {Body, Left, Right} from "native-base";
import { Header } from 'native-base'
import {LinearGradient} from "expo-linear-gradient";
import Fitness from '@ovalmoney/react-native-fitness';
import * as WebBrowser from 'expo-web-browser'
import Modal from 'react-native-modal';
import { ip } from "../utils/exports";

export default class HomeScreen extends Component {

  componentDidMount(){
    this.getAmtTokens()
  }

  getAmtTokens = async() => {
    const cookie = await AsyncStorage.getItem('token2');
    console.log(cookie);
    this.setState({ refreshing: true });
    this.setState({ cookie });
    fetch(`http://${ip}/api/update`, {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    }).then(res => res.json())
      .then(async(res) => {
        this.setState({ khan: res["Khan Academy"], duo: res["Duolingo"], nitro: res["Nitrotype"], code: res["Codeacademy"], tokens: res["Total Points"], refreshing: false })
        await AsyncStorage.setItem('tokens', res["Total Points"].toString())
      });
  };

  state = {
    duoVisible: false,
    duoName: "",
    nitroVisible: false,
    nitroName: "",
    codeVisible: false,
    codeName: "",
    tokens: 0,
    refreshing: false
  };

  connectKhan = async() => {
    fetch(`http://${ip}/api/ka`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Cookie': this.state.cookie
      }
    }).then(res => res.json()).then(async(res) => {
      await WebBrowser.openBrowserAsync(res.url)
    });
  };

  connectDuo = async() => {
    this.setState({ duoVisible: false });
    fetch(`http://${ip}/api/duolingo`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Cookie': this.state.cookie
      },
      body: JSON.stringify({
        username: this.state.duoName
      })
    }).then(WebBrowser.openBrowserAsync(`http://${ip}/api/duolingo`))
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

  connectCode = () => {
    this.setState({ codeVisible: false });
    fetch(`http://${ip}/api/ca?username=` + this.state.codeName, {
      method: 'GET',
      'Cookie': this.state.cookie
    }).then(res => this.setState({ codeVisible: false }))
  };

  connectNitro = () => {
    fetch(`http://${ip}/api/nt?q=${this.state.nitroName}`, {
      method: 'GET',
      headers: {
        'Cookie': this.state.cookie
      },
    }).then(res => res.json()).then(res => {
      if (res.results[0] !== null) {
        const account = res.results[0];
        fetch(`http://${ip}/api/nt`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Cookie': this.state.cookie
          },
          body: JSON.stringify({
            accountId: account.accountId
          })
        }).then(() => this.setState({ nitroVisible: false }))
      }
    })
  };

  render(){
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header style={styles.header}>
          <Body style={{ alignItems: 'flex-start', paddingLeft: 5 }}>
            <Text style={{ fontSize: 20, color: 'white' }}>Dashboard</Text>
          </Body>
          <Right>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center', height: '100%' }}>
              <Image style={{ width: 35, height: 35 }} source={require('../../assets/icon.png')} />
              <Text style={{ fontSize: 17, color: 'white' }}>  {this.state.tokens}</Text>
            </View>
          </Right>
        </Header>
        <Modal isVisible={this.state.duoVisible || this.state.nitroVisible || this.state.codeVisible}>
          <View style={{ width: 300, height: 175, backgroundColor: 'white', alignSelf: 'center', borderRadius: 20, padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>{this.state.duoVisible ? 'DuoLingo' : this.state.codeVisible ? 'Codecademy' : 'Nitrotype'} Username</Text>
            <TextInput
              style={{ width: '100%', height: 50, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, backgroundColor: '#EEE' }}
              placeholder="Enter your Username"
              value={this.state.duoVisible ? this.state.duoName : this.state.codeVisible ? this.state.codeName : this.state.nitroName}
              onChangeText={text => this.state.duoVisible ? this.setState({ duoName: text }) : this.state.codeVisible ? this.setState({ codeName: text }) : this.setState({ nitroName: text }) }
            />
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <TouchableHighlight
                onPress={() => this.state.duoVisible ? this.setState({ duoVisible: false }) : this.state.codeVisible ? this.setState({ codeVisible: false }) : this.setState({ nitroVisible: false })}
                style={{ width: '45%', height: 40, borderRadius: 20, backgroundColor: 'gray', margin: 5, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ color: 'white', fontSize: 18 }}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={this.state.duoVisible ? this.connectDuo : this.state.codeVisible ? this.connectCode : this.connectNitro}
                style={{ width: '45%', height: 40, borderRadius: 20, backgroundColor: 'blue', margin: 5, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ color: 'white', fontSize: 18 }}>Submit</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <View style={{ paddingLeft: 15 }}>
          <ScrollView
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.getAmtTokens} />}
            contentContainerStyle={{ alignItems: 'center', padding: 30, justifyContent: 'center' }}>
            <LinearGradient colors={['#9C56FF', '#b168e0']} style={{ margin: 10, width: '100%', borderRadius: 5, alignSelf: 'flex-end' }}>
              <View style={{ padding: 15 }}>
                 <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginHorizontal: 20 }}>Connect to these services to earn more points!</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5, width: '100%', flex: 1, flexWrap: 'wrap' }}>
                    {
                      this.state.khan ? null : (
                        <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15, width: '20%', height: 80 }} onPress={this.connectKhan}>
                          <Image source={require('../../assets/khan.png')} style={{ height: 80, width: 80,  }}/>
                        </TouchableHighlight>
                      )
                    }
                    {
                      this.state.duo ? null : (
                         <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15, width: '20%', height: 80 }} onPress={() => this.setState({ duoVisible: true })}>
                          <Image source={require('../../assets/duo.png')} style={{ height: 60, width: 60,  }}/>
                        </TouchableHighlight>
                      )
                    }
                    {
                      this.state.fitbit ? null : (
                        <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15, width: '20%', height: 80 }} onPress={this.getHealthData}>
                          <Image source={require('../../assets/fitbit.png')} style={{ height: 60, width: 60,  }}/>
                        </TouchableHighlight>
                      )
                    }
                    {
                      this.state.nitro ? null : (
                        <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15, width: '20%', height: 80 }} onPress={() => this.setState({ nitroVisible: true })}>
                          <Image source={require('../../assets/nitro.png')} style={{ height: 60, width: 60,  }}/>
                        </TouchableHighlight>
                      )
                    }
                    {
                      this.state.code ? null : (
                        <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15, width: '20%', height: 80 }} onPress={() => this.setState({ codeVisible: true })}>
                          <Image source={require('../../assets/code.png')} style={{ height: 60, width: 60,  }}/>
                        </TouchableHighlight>
                      )
                    }
                  </View>
              </View>
            </LinearGradient>
            <Text style={{ fontSize: 18, color: 'white', marginVertical: 20, width: '100%' }}>Lifetime Tokens</Text>
            {
              this.state.khan ? (
                <View style={{ width: '100%', height: 75, backgroundColor: '#102b61', borderRadius: 15, justifyContent: 'space-between', padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                  <Image source={require('../../assets/khan.png')} style={{ width: 60, height: 60 }} />
                  <Text style={{ fontSize: 20, color: '#32CD32' }}>+{this.state.khan}</Text>
                </View>
              ) : null
            }
            {
              this.state.code ? (
                <View style={{ width: '100%', height: 75, backgroundColor: 'white', borderRadius: 15, justifyContent: 'space-between', padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                  <Image source={require('../../assets/code.png')} style={{ width: 60, height: 60 }} />
                  <Text style={{ fontSize: 20, color: '#32CD32' }}>+{this.state.code}</Text>
                </View>
              ) : null
            }
            {
              this.state.duo ? (
                <View style={{ width: '100%', height: 75, backgroundColor: 'yellow', borderRadius: 15, justifyContent: 'space-between', padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                  <Image source={require('../../assets/duo.png')} style={{ width: 60, height: 60 }} />
                  <Text style={{ fontSize: 20, color: '#32CD32' }}>+{this.state.duo}</Text>
                </View>
              ) : null
            }
            {
              this.state.nitro ? (
                <View style={{ width: '100%', height: 75, backgroundColor: '#d72b37', borderRadius: 15, justifyContent: 'space-between', padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                  <Image source={require('../../assets/nitro2.png')} style={{ width: 60, height: 60 }} />
                  <Text style={{ fontSize: 20, color: '#32CD32' }}>+{this.state.nitro}</Text>
                </View>
              ) : null
            }
          </ScrollView>
        </View>
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
    width: '100%',
    borderBottomWidth: 0
  }
});