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

function PatientScreen({navigation}) {

    // User Details
    const [doctorName, setDoctorName] = useState();
    const [hospitalName, setHospitalname] = useState();
    const [specialization, setSpecialization] = useState();
    const [date, setDate] = useState();

    const docRef = firebase.firestore().collection('doctors');


    const [isVisible, setIsVisible] = useState(false);
    const [editIsVisible, setEditIsVisible] = useState(false);

    const [doctorsList, setDoctorsList] = useState([]);

    const [selectedDoctor, setSelectedDoctor] = useState([]);



    useEffect( () => {
        docRef.onSnapshot(
            querySnapshot => {
                const docList = [];
                querySnapshot.forEach((doc)=>{ 
                    docList.push({
                        id:doc.id,
                        doctor:doc.data()
                    })
                })
               setDoctorsList(docList);
            }
        )  
    }, []);


    async function handleAddDoctor(){
        let uid = null;

      await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((res)=>{
        uid = res.user.uid
      })
      .catch((err)=>{
        alert("Failed to add the user. Please try again.");
        console.log(err)
      });

      if(uid != null){

        const user = {
          uid:uid,
          name:name,
          specialization:specialization,
          phoneNumber:phoneNumber,
          email:email,
          role:1
        }

        await firebase.firestore().collection('doctors')
          .add(user)
          .then((res)=>{
            alert("User added successfully");
            reset();
          }).catch((err)=>{
            alert("Failed to add the user. Please try again.");
            console.log(err)
          });
      } else {
        alert("Failed to add the user. Please try again.");
      }

    } 

    function reset(){
        setDoctorName("");
        setHospitalname("");
        setSpecialization("");
        setDate("");
    }

    return ( 
        <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>
            <Header title={"Channel Your Doctor"} navigation={navigation} />

            <ScrollView style={{flex:0.8}}>
                <View style={styles.modalContainer}>
                    {/* <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center', marginLeft:'auto', padding:15}} onPress={()=>setIsVisible(false)} >
                        <MaterialCommunityIcons name="close" size={26} color={'white'}   />
                    </Pressable> */}

                    <View style={styles.formContainer}>
                        <Text style ={styles.textInput}>Doctor's Name</Text>
                        <TextInput style={styles.input} placeholder='Doctor Name' value={name} onChangeText={setDoctorName} />

                        <Text style ={styles.textInput}>Hospital Name</Text>
                        <TextInput style={styles.input} placeholder='Any Hospital' value={email} onChangeText={setHospitalname} />

                        <Text style ={styles.textInput}>Specialization</Text>
                        <TextInput style={styles.inputPr } placeholder='Any Specialization' value={specialization} onChangeText={setSpecialization} />

                        <Text style ={styles.textInput}>Date</Text>
                        <TextInput style={styles.input} placeholder='Any Date' value={date} onChangeText={setDate} />

                        <View style={{marginTop:60, marginBottom:60}}>
                            <Button title='Search' color='darkgrey' onPress={handleAddDoctor} />
                        </View>
                        <View style={{marginTop:60, marginBottom:60}}>
                            <Button title='Request Lap Report' color='darkgrey' onPress={handleAddDoctor} />
                        </View>
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.floatingButton} onPress={()=>setIsVisible(true)}>
                <Text style={styles.floatingText}>+</Text>
            </TouchableOpacity>

        </ImageBackground>
        
     );
}

export default PatientScreen;

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
    }

  });