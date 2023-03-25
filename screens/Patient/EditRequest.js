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

function EditRequest({navigation, route}) {


    const labRef = firebase.firestore().collection('labTest');
    const { req } = route.params;

    // User Details
    const [patientName, setPatientName] = useState(req.data.p_name);
    const [email, setEmail] = useState(req.data.email);
    const [phoneNumber, setPhoneNumber] = useState(req.data.contact)
    const [nic, setNic] = useState(req.data.nic);
    const [uid, setUid] = useState(req.data.pid);
    const [testName, setTestName] = useState(req.data.test);
    const [tid, setTid] = useState(req.id);

    async function handleUpdate(){
        const labTest = {
            p_name:patientName,
            test:testName,
            pid:uid,
            email:email,
            contact:phoneNumber,
            date:null,
            time:null,
            status:'PENDING'
        }


        await labRef
          .doc(tid)
          .update(labTest).then(()=>{
             alert("Successfully updated the request");
             navigation.goBack(null)
          }).catch((err)=>{
              alert(err.message)
          })


    }



    return ( 
        <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>
            <Header title={"Edit Request"} navigation={navigation} />

            <View style={{flex:0.9}}>
                <View style={styles.modalContainer}>
   

                    <View style={styles.formContainer}>
                       
                       
                        <Text style ={styles.textInput}>Test Name</Text>
                        <TextInput style={styles.input} placeholder='Test Name' value={testName} onChangeText={setTestName} />

                        <Text style ={styles.textInput}>Patient's Name</Text>
                        <TextInput style={styles.input} placeholder='MR./MRS.' value={patientName} onChangeText={setPatientName} />

                        <Text style ={styles.textInput}>Phone No</Text>
                        <TextInput style={styles.input} placeholder='+94 xxxxxxx' value={phoneNumber} onChangeText={setPhoneNumber} />

                        <Text style ={styles.textInput}>NIC</Text>
                        <TextInput style={styles.input} placeholder='xxxxxxxx' value={nic} onChangeText={setNic} />

                        <Text style ={styles.textInput}>Email</Text>
                        <TextInput style={styles.input} placeholder='user@gmail.com' value={email} onChangeText={setEmail} />
                        
                        <View style={{marginTop:20, marginBottom:60}}>
                            <Button title='SAVE' color='darkgrey' onPress={handleUpdate} />
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
        
     );
}

export default EditRequest;

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