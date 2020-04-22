import React, { Component } from 'react'
import {View, Text, Image, StyleSheet, ScrollView} from "react-native";
import {Body, Header, Right} from "native-base";
import {ButtonGroup, Icon} from "react-native-elements";
import GiftCard from "../components/GiftCard";

export default class StoreScreen extends Component {

  state = {
    selectedIndex: 0,
    value: 5
  };

  render(){
    return (
      <View style={styles.container}>
        <Header style={styles.header}>
          <Body>
            <Text style={{ fontSize: 20, color: 'white' }}>Store</Text>
          </Body>
          <Right>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center', height: '100%' }}>
              <Image style={{ width: 35, height: 35 }} source={require('../../assets/icon.png')} />
              <Text style={{ fontSize: 17, color: 'white' }}>  4568</Text>
            </View>
          </Right>
        </Header>
        <ScrollView contentContainerStyle={styles.store}>
          <Icon name="card-giftcard" type="material" color="white" size={70} containerStyle={{ backgroundColor: 'green', padding: 20, borderRadius: 55, marginBottom: 10 }}/>
          <Text style={{ fontWeight: "bold", fontSize: 17, color: 'white', letterSpacing: 1.5, textAlign: 'center' }}>Buy giftcards with your tokens!</Text>
          <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
            <Text style={{ color: 'lightgreen', fontSize: 18, textAlign: 'left' }}>Amount: </Text>
            <ButtonGroup
              containerStyle={{ width: 240, backgroundColor: 'transparent', borderWidth: 0 }}
              buttonStyle={{ marginHorizontal: 5, borderRadius: 5, backgroundColor: 'white' }}
              innerBorderStyle={{ width: 0 }}
              buttons={[ "$5", "$10", "$15", "$20" ]}
              selectedIndex={this.state.selectedIndex}
              onPress={selectedIndex => this.setState({ value: (selectedIndex + 1) * 5, selectedIndex })}
            />
          </View>
          <GiftCard price={this.state.value * 1050} textColor="#FFF" color="#373737" logo={require('../../assets/amazon.png')} />
          <GiftCard price={this.state.value * 1020} textColor="#FFF" color="#18339e" logo={require('../../assets/steam.png')} />
          <GiftCard price={this.state.value * 1000} textColor="#666" color="#fff" logo={require('../../assets/google.png')} />
          <GiftCard price={this.state.value * 1040} textColor="#666" color="#AAA" logo={require('../../assets/apple.png')} />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  header: {
    backgroundColor: '#373737'
  },
  store: {
    alignItems: 'center',
    padding: 20
  }
});