import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React,{useEffect, useState} from "react";
//import Header from "../components/Header";
import Header from  "../../components/Header";
import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native";
import { TextInput } from "react-native";
//import {firebase} from '../config/FirebaseConfig';
import {firebase} from '../../config/FirebaseConfig';
import { ScrollView } from "react-native";

function DoctorsProfile({navigation, route}) {



  const docRef = firebase.firestore().collection('doctors');
  const scheduleRef = firebase.firestore().collection('schedules');

  const { doctor } = route.params;

  const [schedules, setSchedules] = useState([]);


  useEffect(  () =>  {
    leadSchedules(); 
  }, []);



  async function leadSchedules(){ 
      const query = scheduleRef.where('doc_Id', '==', doctor.doctor.uid);
      query.onSnapshot((querySnapshot) => {
          const tempList = [];
        querySnapshot.docs.map((doc) => {
          tempList.push({
              id:doc.id,
              data:doc.data()
          })
        });
        setSchedules(tempList);
      });
  }


   

    return ( 
        <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>
            <Header title={"Doctor Profile"} navigation={navigation} />
                <View style={styles.doctorCard}>
                <View style={{justifyContent:'center', alignItems:'center', padding:30}}>
                  <Image style={styles.image} source={require('../../assets/profile.jpg')} />
                </View>
                      <View>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                              <Text style={{color:'white', fontSize:25}}>Dr. {doctor.doctor.name}</Text>
                            </View>
                            <ScrollView>
                              <View style={{marginLeft:20, marginTop:20}}>
                                <View style={styles.textContainer}>
                                  <Text style={styles.innertitle}>Email : </Text>
                                  <Text style={styles.innerText}>{doctor.doctor.email}</Text>
                                </View>
                                <View style={styles.textContainer}>
                                  <Text style={styles.innertitle}>Specialization : </Text>
                                  <Text style={styles.innerText}>{doctor.doctor.specialization}</Text>
                                </View>
                                <View style={styles.textContainer}> 
                                  <Text style={styles.innertitle}>Mobile : </Text>
                                  <Text style={styles.innerText}>{doctor.doctor.phoneNumber}</Text>
                                </View>
                              <View style={styles.textContainer}> 
                                  <Text style={styles.innertitle}>Available Days : </Text>
                                  {schedules.map(
                                    sch =>
                                      <Text key={sch.id} style={styles.innerText} >{sch.data.day} : {sch.data.from_time} to {sch.data.to_time}</Text>
                                        
                                    
                                  )}
                                  
                                </View>
                              </View>
                            </ScrollView>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                              <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('PatientBooking',{doctor:doctor})} >
                                <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>Make Request</Text>
                              </TouchableOpacity>
                            </View>
                            
                            
                      </View>
                  </View>

        </ImageBackground>
        
     );
}

export default DoctorsProfile;

const styles = StyleSheet.create({
    container: {
      backgroundColor:'#54C1FF',
      justifyContent:"center",
      alignItems:"center",
    },
    doctorCard:{
      backgroundColor:'#035E73',
      elevation:1,
      borderRadius:15,
      flex:0.9,
      marginHorizontal:30,
      marginVertical:35
    },
    innerText:{
        fontSize:18,
        textAlign:"left",
        color:'white',
    },
    innerText1:{
        fontSize:22,
        marginLeft: 80,
        fontWeight: 'bold',
        color:'white',
        marginTop:-50
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
    textInput: {
        marginBottom: 10,
        fontWeight: 'bold',
        color:'white',
        fontSize:20
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
    },
    image:{
      width:75,
      height:75,
      borderRadius:150,
      
  },
  innertitle:{
    fontSize:18,
    color:'white',
    fontWeight:'bold'
  },
  textContainer:{
    marginBottom:20
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