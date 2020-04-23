import React, { Component } from 'react'
import {View, Text, Image, StyleSheet, ScrollView, TouchableHighlight, Animated, Easing, Dimensions} from "react-native";
import {Body, Header, Left, Right} from "native-base";
import {Icon} from "react-native-elements";
import {LinearGradient} from "expo-linear-gradient";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default class ExploreScreen extends Component {

  state = {
    x: new Animated.Value(-Dimensions.get('window').width)
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
            <View style={styles.interest}>
              <Image source={require('../../assets/coding.jpg')} style={{ height: 190, maxWidth: '100%' }} />
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 17, textAlign: 'center' }}>Web Development</Text>
                <Text style={{ textAlignVertical: 'bottom', color: '#666', fontSize: 12, fontStyle: 'italic', marginTop: 20 }}>Based on your interest in: Art, Mathematics</Text>
              </View>
            </View>
            <View style={styles.interest}>
              <Image source={require('../../assets/coding.jpg')} style={{ height: 190, maxWidth: '100%' }} />
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 17, textAlign: 'center' }}>Web Development</Text>
                <Text style={{ textAlignVertical: 'bottom', color: '#666', fontSize: 12, fontStyle: 'italic', marginTop: 20 }}>Based on your interest in: Writing, Mathematics</Text>
              </View>
            </View>
            <View style={styles.interest}>
              <Image source={require('../../assets/coding.jpg')} style={{ height: 190, maxWidth: '100%' }} />
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 17, textAlign: 'center' }}>Web Development</Text>
                <Text style={{ textAlignVertical: 'bottom', color: '#666', fontSize: 12, fontStyle: 'italic', marginTop: 20 }}>Based on your interest in: Writing, Mathematics</Text>
              </View>
            </View>
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
    alignItems: 'center'
  },
  header: {
    backgroundColor: '#373737',
    width: '100%',
  },
  explore: {
    padding: 20,
    alignItems: 'center',
  },
  interest: {
    width: '45%',
    height: 320,
    backgroundColor: '#48D1CC',
    margin: 9,
    marginTop: 0,
  }
});