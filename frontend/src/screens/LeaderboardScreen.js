import React, { Component } from 'react';
import Leaderboard from 'react-native-leaderboard';
import {Body, Header, Right} from "native-base";
import {AsyncStorage, Image, StyleSheet, Text, View} from "react-native";
import {ip} from "../utils/exports";

export default class LeaderboardScreen extends Component {

  componentDidMount(){
    fetch(`https://${ip}/api/lb`, {
      methods: 'GET',
    }).then(res => res.json()).then(res => this.setState({ data: res.Leaderboard }));
    this.getTokens()
  }

  getTokens = async() => {
    const tokens = await AsyncStorage.getItem('tokens');
    this.setState({ tokens })
  };

  state = {
    data: [
      { display_name: "shit", "Total Points": 69 },
      { display_name: "lol", "Total Points": 420 },
    ],
  };

  render(){
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Header style={styles.header} noLeft={true}>
          <Body style={{ alignItems: 'flex-start', paddingLeft: 5 }}>
            <Text style={{ fontSize: 20, color: 'white' }}>Store</Text>
          </Body>
          <Right>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center', height: '100%' }}>
              <Image style={{ width: 35, height: 35 }} source={require('../../assets/icon.png')} />
              <Text style={{ fontSize: 17, color: 'white' }}>  {this.state.tokens}</Text>
            </View>
          </Right>
        </Header>
        <View style={{ alignItems: 'center' }}>
          <View style={{ backgroundColor: '#00FF00', margin: 20, marginTop: 30, padding: 20, borderRadius: 70 }}>
            <Image source={require('../../assets/leaderboard.png')} style={{ width: 100, height: 100 }} />
          </View>
          <Text style={{ color: 'white', fontSize: 25 }}>Leaderboard</Text>
          <Text style={{ color: 'white', marginBottom: 30 }}>See where you rank!</Text>
          <Leaderboard sortBy='Total Points' labelBy='display_name' data={this.state.data} evenRowColor='black' oddRowColor='#272727' labelStyle={{ color: 'white' }} rankStyle={{ color: 'white' }} scoreStyle={{ color: 'white' }}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    header: {
      backgroundColor: '#373737',
      borderBottomWidth: 0,
    },
});