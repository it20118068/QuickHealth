import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {firebase} from '../config/FirebaseConfig';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    const docRef = firebase.firestore().collection('doctors');
    const roleRef = firebase.firestore().collection('roles');
    const userRef = firebase.firestore().collection('users');
  
    async function handleLogin () {

        let user = null;

        if(email == '' || password == ''){
          alert("Please enter all input fields");
          return;
        }

        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // User logged in successfully
          user = userCredential.user;
          // console.log(user);
          // navigation.navigate('MainScreen');
        })
        .catch((error) => {
          // Handle errors
          console.log(error.code, error.message);
        });

        if(user != null){
          AsyncStorage.setItem("uid", user.uid);
          const userQuery = userRef.where('uid', '==', user.uid);
          userQuery.onSnapshot((querySnapshot) => {
            const userData = querySnapshot.docs.map((doc) => doc.data())[0];
           
            if (userData) {
              AsyncStorage.setItem("email", userData.email);
              AsyncStorage.setItem("name", userData.name);
              AsyncStorage.setItem("nic", userData.nic);
              AsyncStorage.setItem("phoneNumber", userData.phoneNumber);
              
              
            }
          });



          const query = roleRef.where('uid', '==', user.uid);
          const subscriber = query.onSnapshot((querySnapshot) => {
            const userData = querySnapshot.docs.map((doc) => doc.data())[0];
            if (userData) {
              AsyncStorage.setItem("role", userData.role.toString());
              AsyncStorage.setItem("isLogged", "true");
              navigation.navigate('MainScreen');
            }
          });

          return () => {
            subscriber();
          };
        }
    };
  
    return (
      <View style={styles.container}>
        {/* <Text style={styles.logo}>eChanneling</Text> */}
        <Image style={styles.image} source={require('../assets/logo.png')} />
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>LOGIN</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={{color:'#049DBF', fontWeight:'bold', fontSize:18}} >Register Now</Text> 
          </TouchableOpacity>
        </View>
      </View>
    );
  };

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#035E73',
    marginBottom: 40,
  },
  image:{
    width:250,
    height:250
  },
  inputView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
    borderBottomColor:'#049DBF',
    borderBottomWidth:1
  },
  registerBtn: {
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderColor:'#049DBF',
    borderWidth:1
  },
  loginText: {
    color: 'white',
  },
  textContainer:{
    marginTop:30,
    justifyContent:'center',
    alignItems:'center',
    width:'100%'
  },
  loginBtn:{
    width: '50%',
    backgroundColor: '#049DBF',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  }
  });