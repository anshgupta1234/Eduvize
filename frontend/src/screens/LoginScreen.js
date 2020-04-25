import React, {Component} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Image, Dimensions, AsyncStorage, Text} from 'react-native';
import SubmitButton from "../components/SubmitButton";
import {normalize} from "react-native-elements";
import {NavigationContainer} from "@react-navigation/native";
import { Input } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const baseUrl = "https://10.0.2.2:3001";


const width = Dimensions.get('window').width;

class LoginTab extends Component {

state = {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      usernameErrorMessage: '',
      emailErrorMessage: '',
      passwordErrorMessage: '',
      confirmPasswordErrorMessage: '',
      fullNameErrorMessage: '',
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

  storeToken = async(token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (e) {
      alert(e)
    }
  };

  sendInfo(name, email, username, password, password2, signup) {
    if (signup) {
      fetch("https://ns.21xayah.com/auth/signup", {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          email: email,
          password_1: password,
          password_2: password2,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(response => response.json())
        .then(response => {
          if (response.success === true) {
            this.login(username, password);
            this.props.navigation.navigate('HomeScreen');
          }
          else {
            switch (response.data.message()) {
              case 'already_exists':
                this.setState({emailErrorMessage: "An account already exists with this e-mail."});
                break;
              case 'invalid_email':
                this.setState({emailErrorMessage: "The email is invalid."});
                break;
              case 'username_short':
                this.setState({usernameErrorMessage: "The username must be 4 characters or longer."});
                break;
              case 'password_missmatch':
                this.setState({confirmPasswordErrorMessage: "Passwords do not match"});
                break;
              case 'password_short':
                this.setState({passwordErrorMessage: "The password must be 8 characters or longer."});
                break;
            }
          }
        })
    } else this.login(username, password)
  }

  login(username, password){
    this.props.navigation.navigate('App')
    /*fetch("https://ns.21xayah.com/auth/login", {
      method: 'POST',
      body: JSON.stringify({
        name: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
      .then(response => {
        if(response.success === true){
          this.storeToken(response.data.token);
          this.props.navigation.navigate('HomeScreen');
        }
        else if(response.data.message === 'not_found'){
          if(password === '') this.setState({ passwordErrorMessage: 'Email or Password is incorrect' });
        }
      })*/
  }

  fieldsEmpty(){
    const { username, password, confirmPassword, fullName, email } = this.state;
    let fieldEmpty = true;
    if(username === '') this.setState({ usernameErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(password === '') this.setState({ passwordErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(confirmPassword === '') this.setState({ confirmPasswordErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(fullName === '') this.setState({ fullNameErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(email === '') this.setState({ usernameErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
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
          } if (username.length < 4) {
            this.setState({ usernameErrorMessage: "The username must be 4 characters or longer." })
          } else if(!this.fieldsEmpty()) {
            validated = true
          }
      } else if(!this.fieldsEmpty()) {
        validated = true
      }

      //if (validated) this.sendInfo(fullName, email, username, password, confirmPassword, this.signup);
      if (validated) this.props.navigation.navigate("App");
      else this.setState({ passwordErrorMessage: 'Email or Password is wrong' })
  };

  onChangeText = (stateObject, text) => {
      this.setState({
          [stateObject]: text,
          usernameErrorMessage: '',
          emailErrorMessage: '',
          passwordErrorMessage: '',
          confirmPasswordErrorMessage: '',
          fullNameErrorMessage: '',
      });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Eduvize</Text>
        <Input
            leftIcon={{ type: 'material', name: 'mail', color: '#999', marginRight: 10 }}
            onChangeText={(text) => this.onChangeText('username', text)}
            placeholder="Email"
            secureTextEntry={false}
            value={this.state.username}
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
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      usernameErrorMessage: '',
      emailErrorMessage: '',
      passwordErrorMessage: '',
      confirmPasswordErrorMessage: '',
      fullNameErrorMessage: '',
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

  sendInfo(name, email, username, password, password2, signup) {
    if (signup) {
      fetch("https://ns.21xayah.com/auth/signup", {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          email: email,
          password_1: password,
          password_2: password2,
          full_name: name,
          gToken: this.token
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(response => response.json())
        .then(response => {
          if (response.success === true) {
            this.login(username, password);
            this.props.navigation.navigate('HomeScreen');
          }
          else {
            switch (response.data.message()) {
              case 'already_exists':
                this.setState({emailErrorMessage: "An account already exists with this e-mail."});
                break;
              case 'invalid_email':
                this.setState({emailErrorMessage: "The email is invalid."});
                break;
              case 'username_short':
                this.setState({usernameErrorMessage: "The username must be 4 characters or longer."});
                break;
              case 'password_missmatch':
                this.setState({confirmPasswordErrorMessage: "Passwords do not match"});
                break;
              case 'password_short':
                this.setState({passwordErrorMessage: "The password must be 8 characters or longer."});
                break;
            }
          }
        })
    } else this.login(username, password)
  }

  login(username, password){
    fetch("https://ns.21xayah.com/auth/login", {
      method: 'POST',
      body: JSON.stringify({
        name: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
      .then(response => {
        if(response.success === true){
          this.storeToken(response.data.token);
          this.props.navigation.navigate('HomeScreen');
        }
        else if(response.data.message === 'not_found'){
          if(password === '') this.setState({ passwordErrorMessage: 'Email or Password is incorrect' });
        }
      })
  }

  fieldsEmpty(){
    const { username, password, confirmPassword, fullName, email } = this.state;
    let fieldEmpty = true;
    if(username === '') this.setState({ usernameErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(password === '') this.setState({ passwordErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(confirmPassword === '') this.setState({ confirmPasswordErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(fullName === '') this.setState({ fullNameErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
    if(email === '') this.setState({ usernameErrorMessage: "This field cannot be empty" }); fieldEmpty =  false;
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
          } if (username.length < 4) {
            this.setState({ usernameErrorMessage: "The username must be 4 characters or longer." })
          } else if(!this.fieldsEmpty()) {
            validated = true
          }
      } else if(!this.fieldsEmpty()) {
        validated = true
      }

      //if (validated) this.sendInfo(fullName, email, username, password, confirmPassword, this.signup);
      if (validated) this.props.navigation.navigate("App");
      else this.setState({ passwordErrorMessage: 'Email or Password is wrong' })
  };

  onChangeText = (stateObject, text) => {
      this.setState({
          [stateObject]: text,
          usernameErrorMessage: '',
          emailErrorMessage: '',
          passwordErrorMessage: '',
          confirmPasswordErrorMessage: '',
          fullNameErrorMessage: '',
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
            placeholder="Username"
            secureTextEntry={false}
            value={this.state.username}
            containerStyle={[styles.input, {marginBottom: 30}]} inputContainerStyle={{ borderBottomWidth: 0 }}
            showBottomBorder={false}
            errorMessage={this.state.usernameErrorMessage}
        />
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
        fontSize: normalize(16),
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