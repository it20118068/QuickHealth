import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React,{useEffect, useState} from "react";
import Header from  "../../components/Header";
import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native";
import { TextInput } from "react-native";
import {firebase} from '../../config/FirebaseConfig';
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function PatientBooking({navigation, route}) {


    const { doctor } = route.params;

    const channelRef = firebase.firestore().collection('channellings');

    useEffect(()=>{
        readAsyncStorage();
        
    },[])

    async function readAsyncStorage() {
        setPatientName(await AsyncStorage.getItem('name'));
        setPhoneNumber(await AsyncStorage.getItem('phoneNumber'));
        setNic(await AsyncStorage.getItem('nic'));
        setEmail(await AsyncStorage.getItem('email'));
        setUid(await AsyncStorage.getItem('uid'));  
    }

    // User Details
    const [patientName, setPatientName] = useState("");
    const [email, setEmail] = useState();
    const [phoneNumber, setPhoneNumber] = useState('')
    const [nic, setNic] = useState('');
    const [uid, setUid] = useState('');

    async function handleMakeRequest(){
        const channeling = {
            doc_name:doctor.doctor.name,
            p_name:patientName,
            pid:uid,
            email:email,
            contact:phoneNumber,
            date:null,
            time:null,
            did:doctor.doctor.uid,
            status:'PENDING'
        }


        await channelRef
          .add(channeling)
          .then((res)=>{
            alert("Channeling Request Successfully Created");
            navigation.navigate('MainScreen');
          }).catch((err)=>{
            alert("Failed to create the channeling request. Please try again.");
            console.log(err)
          });


    }

    function reset(){
        setPatientName("");
        setEmail("");
        setPhoneNumber("");
    }

    return ( 
        <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>
            <Header title={"Channel Your Doctor"} navigation={navigation} />

            <View style={{flex:1}}>
                <View style={styles.modalContainer}>
   

                    <View style={styles.formContainer}>
                        <View style={{marginBottom:25}}>
                            <Text style ={styles.textInput}>Doctor's Name</Text>
                            <Text style ={{color:'white'}}>{"Dr. " + doctor.doctor.name}</Text>
                        </View>
                       

                        <Text style ={styles.textInput}>Patient's Name</Text>
                        <TextInput style={styles.input} placeholder='MR./MRS.' value={patientName} onChangeText={setPatientName} />

                        <Text style ={styles.textInput}>Phone No</Text>
                        <TextInput style={styles.input} placeholder='+94 xxxxxxx' value={phoneNumber} onChangeText={setPhoneNumber} />

                        <Text style ={styles.textInput}>NIC</Text>
                        <TextInput style={styles.input} placeholder='xxxxxxxx' value={nic} onChangeText={setNic} />

                        <Text style ={styles.textInput}>Email</Text>
                        <TextInput style={styles.input} placeholder='user@gmail.com' value={email} onChangeText={setEmail} />
                        
                        <View style={{marginTop:20, marginBottom:60}}>
                            <Button title='Make Channel Request' color='darkgrey' onPress={handleMakeRequest} />
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
        
     );
}

export default PatientBooking;

const styles = StyleSheet.create({
    container: {
      backgroundColor:'#54C1FF',
      justifyContent:"center",
      alignItems:"center",
    },
    doctorCard:{
      backgroundColor:'#035E73',
      elevation:1,
      justifyContent: 'center',
      height:60,
      marginTop:10,
      marginHorizontal:30,
      borderRadius:15,
      flexDirection:'row', 
      justifyContent:'space-between',
    },
    innerText:{
        fontSize:18,
        textAlign:"center",
        color:'white'
    },
    floatingButton:{
        position:"absolute",
        bottom:20,
        right:20,
        width:60,
        height:60,
        borderRadius:30,
        backgroundColor:'#049DBF',
        alignItems:'center',
        justifyContent:'center',
        elevation:8
    },
    floatingText:{
        fontSize:24,
        color:'white',
        fontWeight:'bold'
    },
    modalContainer:{
        backgroundColor:'#003d4d',
        marginTop: 'auto',
        elevation:5,
        flex:1, 
    },
    modalTitleContainer:{
        justifyContent: 'center',
        alignItems:'center'
    },
    modalTitle:{
        fontSize:30,
        color:'white',

    },
    input: {
        height: 40,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding:5
      },
      inputPr: {
        height: 120,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding:5,
      },

    textInput: {
        fontWeight: 'bold',
        color:'white',
        fontSize:20,
        marginBottom:10
    },
    formContainer:{
        marginVertical:25,
        marginHorizontal:25,
    },
    searchContainer:{
        marginHorizontal:35,
        marginVertical:10
    },
    searchInput:{
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingLeft:15,
    }

  });