import React, {Component} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Image, Dimensions, AsyncStorage, Text} from 'react-native';
import SubmitButton from "../components/SubmitButton";
import {normalize} from "react-native-elements";
import {NavigationContainer} from "@react-navigation/native";
import { Input } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ip } from "../utils/exports";


const width = Dimensions.get('window').width;

class LoginTab extends Component {

state = {
      email: 'yeet@gmail.com',
      password: 'prince101',
      emailErrorMessage: '',
      passwordErrorMessage: '',
  };

  constructor(props) {
    super(props);
    this.signup = false;
  }

  isAlphaNumeric(str) {
      let code, i, len;
      for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)
              return false;
          }
      }
      return true;
  };

  login(){
    fetch(`https://${ip}/auth/login/`, {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      }),
      headers: {
        'Content-type': 'application/json',
      },
      credentials: "include"
    }).then(async(res) => {
      const cookie = res.headers.map['set-cookie'].replace('; HttpOnly; Path=/', '');
      await AsyncStorage.setItem('token2', cookie);
      return res.json()
    }).then((res) => {
      if(res.success){
        this.props.navigation.navigate('App');
      } else {
        this.setState({ passwordErrorMessage: "Wrong password / email!" })
      }
    });
  }

  fieldsEmpty(){
    const { username, password, confirmPassword, fullName, email } = this.state;
    let fieldEmpty = true;
    if(password === '') this.setState({ passwordErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(email === '') this.setState({ usernameErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    return fieldEmpty
  }

  process = () => {
      const { username, password, confirmPassword, fullName, email } = this.state;
      let validated = false;
      let errorMessage = '';
      if(!this.fieldsEmpty()) {
        this.login()
      }

      else this.setState({ passwordErrorMessage: 'Email or Password is wrong' })
  };

  onChangeText = (stateObject, text) => {
      this.setState({
          [stateObject]: text,
          emailErrorMessage: '',
          passwordErrorMessage: '',
      });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Eduvize</Text>
        <Input
            leftIcon={{ type: 'material', name: 'mail', color: '#999', marginRight: 10 }}
            onChangeText={(text) => this.onChangeText('email', text)}
            placeholder="Email"
            secureTextEntry={false}
            value={this.state.email}
            containerStyle={[styles.input, {marginBottom: 30}]} inputContainerStyle={{ borderBottomWidth: 0 }}
            showBottomBorder={false}
            errorMessage={this.state.usernameErrorMessage}
        />
        <Input
            leftIcon={{ type: 'material', name: 'lock', color: '#999', marginRight: 10 }}
            onChangeText={(text) => this.onChangeText('password', text)}
            placeholder="Password"
            secureTextEntry={true}
            value={this.state.password}
            containerStyle={[styles.input, {marginBottom: 30}]} inputContainerStyle={{ borderBottomWidth: 0 }}
            showBottomBorder={false}
            errorMessage={this.state.passwordErrorMessage}
        />
        <SubmitButton
            text={this.signup ? "Sign Up" : "Login"}
            color="#6FCF97"
            onPress={this.process}
        />
        <View style={{ height: 60 }}/>
      </KeyboardAvoidingView>
    );
  }
}

class SignupTab extends Component {

  state = {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      emailErrorMessage: '',
      passwordErrorMessage: '',
      confirmPasswordErrorMessage: '',
      usernameErrorMessage: ''
  };

  constructor(props) {
    super(props);
    this.signup = true;
  }

  isAlphaNumeric(str) {
      let code, i, len;
      for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)
              return false;
          }
      }
      return true;
  };

  validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email)
  }

  storeToken = async(token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (e) {
      alert(e)
    }
  };

  sendInfo() {
    fetch(`https://${ip}/auth/register/`, {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        display_name: this.state.username
      }),
      headers: {
        'Content-type': 'application/json',
      },
      credentials: "include"
    }).then(async(res) => {
      const cookie = res.headers.map['set-cookie'].replace('; HttpOnly; Path=/', '');
      await AsyncStorage.setItem('token', cookie);
      return res.json()
    }).then((res) => {
      if(res.success){
        this.props.navigation.navigate('App');
      } else {
        this.setState({ passwordErrorMessage: "Wrong password / email!" })
      }
    });
  }

  fieldsEmpty(){
    const { username, password, confirmPassword, fullName, email } = this.state;
    let fieldEmpty = true;
    if(password === '') this.setState({ passwordErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(confirmPassword === '') this.setState({ confirmPasswordErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(email === '') this.setState({ emailErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(username === '') this.setState({ usernameErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    return fieldEmpty
  }

  process = () => {
      const { username, password, confirmPassword, fullName, email } = this.state;
      let validated = false;
      let errorMessage = '';
      if (this.signup) {
          if (password !== confirmPassword) {
            this.setState({ confirmPasswordErrorMessage: "Passwords do not match"})
          } if (password.length < 7) {
            this.setState({ passwordErrorMessage: "The password must be 7 characters or longer." })
          } else if (!this.isAlphaNumeric(password)) {
            this.setState({ passwordErrorMessage: "The password must be alphanumeric(a-z, 0-9)" })
          } if (!this.validateEmail(email)) {
            this.setState({ emailErrorMessage: "The email is invalid." })
          } else if(!this.fieldsEmpty()) {
            validated = true
          }
      } else if(!this.fieldsEmpty()) {
        validated = true
      }

      //if (validated) this.sendInfo(fullName, email, username, password, confirmPassword, this.signup);
      if (validated) this.sendInfo();
      else this.setState({ passwordErrorMessage: 'Email or Password is wrong' })
  };

  onChangeText = (stateObject, text) => {
      this.setState({
          [stateObject]: text,
          emailErrorMessage: '',
          passwordErrorMessage: '',
          confirmPasswordErrorMessage: '',
          usernameErrorMessage: '',
      });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Eduvize</Text>
        <Input
            leftIcon={{ type: 'material', name: 'person', color: '#999', marginRight: 10 }}
            onChangeText={(text) => this.onChangeText('username', text)}
            placeholder="Display Name"
            value={this.state.username}
            containerStyle={[styles.input, {marginBottom: 30}]} inputContainerStyle={{ borderBottomWidth: 0 }}
            showBottomBorder={false}
            errorMessage={this.state.usernameErrorMessage} />
        {this.signup &&
            <Input
                leftIcon={{ type: 'material', name: 'mail', color: '#999', marginRight: 10 }}
                onChangeText={(text) => this.onChangeText('email', text)}
                placeholder="Email"
                secureTextEntry={false}
                value={this.state.email}
                containerStyle={[styles.input, {marginBottom: 30}]} inputContainerStyle={{ borderBottomWidth: 0 }}
                showBottomBorder={false}
                errorMessage={this.state.emailErrorMessage}
            />}
        <Input
            leftIcon={{ type: 'material', name: 'lock', color: '#999', marginRight: 10 }}
            onChangeText={(text) => this.onChangeText('password', text)}
            placeholder="Password"
            secureTextEntry={true}
            value={this.state.password}
            containerStyle={[styles.input, {marginBottom: 30}]} inputContainerStyle={{ borderBottomWidth: 0 }}
            showBottomBorder={false}
            errorMessage={this.state.passwordErrorMessage}
        />
        { this.signup &&
            <Input
                leftIcon={{ type: 'material', name: 'check', color: '#999', marginRight: 10 }}
                onChangeText={(text) => this.onChangeText('confirmPassword', text)}
                placeholder="Confirm Password"
                secureTextEntry={true}
                value={this.state.confirmPassword}
                containerStyle={[styles.input, {marginBottom: 30}]} inputContainerStyle={{ borderBottomWidth: 0 }}
                showBottomBorder={false}
                errorMessage={this.state.confirmPasswordErrorMessage}
            />}
        <SubmitButton
            text={this.signup ? "Sign Up" : "Login"}
            color="#6FCF97"
            onPress={this.process}
        />
        <View style={{ height: 60 }}/>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5FCFF",
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    input: {
        backgroundColor: "#e6e6e6",
        borderRadius: 15,
        overflow: "hidden",
        height: 60,
        justifyContent: 'center',
        width: width * 0.9
    },
    logo: {
      width: 100,
      height: 100,
      resizeMode: 'contain'
    },
});


const Tab = createBottomTabNavigator();

function LoginNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: {
          fontSize: 18
        },
        tabStyle: {
          justifyContent: 'center'
        }
      }}
    >
      <Tab.Screen name="Login" component={LoginTab} />
      <Tab.Screen name="Signup" component={SignupTab} />
    </Tab.Navigator>
  )
}

export default LoginNavigator;