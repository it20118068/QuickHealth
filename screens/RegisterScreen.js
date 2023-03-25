import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {firebase} from '../config/FirebaseConfig';

function RegisterScreen({navigation}) {

    const [name, setName] = useState();
    const [role, setRole] = useState(3);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState('');
    const [nic, setNic] = useState();

    const userRef = firebase.firestore().collection('users');
  
    const roleRef = firebase.firestore().collection('roles');

    async function handleRegister(){
      let uid = null;

      await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((res)=>{
        uid = res.user.uid
      })
      .catch(error => setError(error.message));

      if(uid != null){

        const user = {
          uid:uid,
          name:name,
          phoneNumber:phoneNumber,
          email:email,
          nic:nic,
        }
        await roleRef.add({uid:uid, role:3});
        await userRef
          .add(user)
          .then((res)=>{
            alert("User Registered Successfully");
            navigation.navigate('LoginScreen');
          }).catch((err)=>{
            console.log(err)
          });
      }


    }

    return (
      <View style={styles.container}>
         <Image style={styles.image} source={require('../assets/logo.png')} />

        <View style={styles.inputView}>
          <TextInput style={styles.inputText} placeholder="Name" placeholderTextColor="#003f5c" value={name} onChangeText={setName}/>
        </View>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText} placeholder="Email" placeholderTextColor="#003f5c" value={email} onChangeText={setEmail}/>
        </View>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText} placeholder="NIC" placeholderTextColor="#003f5c" value={nic} onChangeText={setNic}/>
        </View>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText} placeholder="Mobile No" placeholderTextColor="#003f5c" value={phoneNumber} onChangeText={setPhoneNumber}/>
        </View>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText} placeholder="Password" placeholderTextColor="#003f5c" secureTextEntry value={password} onChangeText={setPassword}/>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>REGISTER</Text>
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={{color:'#049DBF', fontWeight:'bold', fontSize:18}}>LOGIN</Text> 
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  export default RegisterScreen;


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
      width:150,
      height:150
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
    loginBtn: {
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
    registerBtn:{
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