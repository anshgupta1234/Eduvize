import React, { Component } from 'react'
import {View, Text, Image, StyleSheet, ScrollView, TouchableHighlight, Animated, Easing, Dimensions, AsyncStorage} from "react-native";
import {Body, Header, Left, Right} from "native-base";
import {Icon} from "react-native-elements";
import {LinearGradient} from "expo-linear-gradient";
import {ip} from "../utils/exports";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default class ExploreScreen extends Component {

  componentDidMount() {
    this.setup();
  }

  setup = async() => {
    const token = await AsyncStorage.getItem('cookie');
    fetch(`http://${ip}/explore/recommend/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Cookie': token
      }
    }).then(res => res.json()).then(res => this.setState({ data: res, loaded: true }))
  };

  state = {
    x: new Animated.Value(-Dimensions.get('window').width),
    data: {},
    loaded: false
  };

  slide = () => {
    Animated.timing(this.state.x, {
      toValue: 0,
      easing: Easing.linear(),
      duration: 1000,
      delay: 200
    }).start();
  };

  render() {
    this.slide();
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <Header style={styles.header}>
            <Body style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22, color: 'white', textAlign: 'center', marginRight: 10 }}>Explore</Text>
              <Icon style={{ alignSelf: 'center' }} name="school" type="material" size={40} color="white"/>
            </Body>
          </Header>
          <ScrollView contentContainerStyle={styles.explore}>
            <AnimatedGradient colors={["#7CFC00", "#32cd32"]} style={[{ borderRadius: 10, backgroundColor: 'green', width: '100%', padding: 10, marginBottom: 40  }, {
              transform: [
                {translateX: this.state.x},
                {perspective: 1000}
              ]
            }]}>
              <Text style={{ color: 'white', fontSize: 15 }}>It gets boring at home sometimes. Based on your preferences, here's some new areas to explore during the quarantine!</Text>
            </AnimatedGradient>
            <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
              {
                Object.keys(this.state.data).map((keyName, index) => {
                  return (
                    <View style={{ width: '100%', height: 80, flexDirection: 'row', marginBottom: 10, borderRadius: 10, backgroundColor: '#373737', alignItems: 'center', padding: 10 }}>
                      <Image source={{ uri: this.state.data[keyName] }} style={{ height: 60, width: 60 }} />
                      <Text style={{ color: 'white', paddingLeft: 15 }}>{keyName}</Text>
                    </View>
                  )
                })
              }
            </View>
          </ScrollView>
        </View>
      )
    } else return null
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
  },
  explore: {
    padding: 20,
    alignItems: 'center',
  },
  interest: {
    width: '45%',
    height: 320,
    backgroundColor: '#48D1CC',
    margin: 7,
    marginTop: 0,
    borderRadius: 10
  }
});