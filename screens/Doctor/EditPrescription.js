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
import { useIsFocused } from "@react-navigation/native";

function EditPrescription({ route, navigation }) {
    const presciptionRef = firebase.firestore().collection('prescriptions');

 

    const [isVisible, setIsVisible] = useState(false);


    const isFocused = useIsFocused();
    const { pres } = route.params;

    const [mobile, setMobile] = useState(pres.prescription.mobile);
    const [doctorName, setDoctorName] = useState(pres.prescription.doctorName);
    const [name, setName] = useState(pres.prescription.name);
    const [date, setDate] = useState(pres.prescription.date);
    const [presciptionDetail, setPresciptionDetail] = useState(pres.prescription.presciptionDetail);
    const [id, setId] = useState(pres.id);

    useEffect( () => {
       
    }, []);


    function handleUpdate(){
       
        const presciption = {
            doctorName:doctorName,
            name:name,
            mobile:mobile,
            date:date,
            presciptionDetail:presciptionDetail
         }

         presciptionRef.doc(id)
            .update(presciption).then(()=>{
               alert("Successfully updated the prescription");
               reset();
               navigation.navigate('MainScreen');
            }).catch((err)=>{
                alert(err.message)
            })
    }

    async function handleAddPrescription(){
        const presciption = {
           doctorName:doctorName,
           name:name,
           mobile:mobile,
           date:date,
           presciptionDetail:presciptionDetail
        }
        console.log(presciption)
        await presciptionRef
            .add(presciption)
            .then((res)=>{
                alert("Prescription Created Successfully");
                reset();
        }).catch((err)=>{
                alert("Failed to create the prescription. Please try again.");
                console.log(err)
        });
    }


    function reset(){
        setName("");
        setMobile("");
        setDate("");
        setPresciptionDetail("");
        setDoctorName("")
    }

    return ( 
        <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>
            <Header title={"Edit Prescription"} navigation={navigation} />

            <ScrollView style={{flex:0.8}}>
                <View style={styles.modalContainer}>
                    {/* <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center', marginLeft:'auto', padding:15}} onPress={()=>setIsVisible(false)} >
                        <MaterialCommunityIcons name="close" size={26} color={'white'}   />
                    </Pressable> */}

                    <View style={styles.formContainer}>

                        <Text style ={styles.textInput}>Patient Name</Text>
                        <TextInput style={styles.input} placeholder='Doctor Name' value={doctorName} onChangeText={setDoctorName} />

                        <Text style ={styles.textInput}>Patient Name</Text>
                        <TextInput style={styles.input} placeholder='Patient Name' value={name} onChangeText={setName} />

                        <Text style ={styles.textInput}>Patient Mobile</Text>
                        <TextInput style={styles.input} placeholder='Patient Mobile' value={mobile} onChangeText={setMobile} />


                        <Text style ={styles.textInput}>Date</Text>
                        <TextInput style={styles.input} placeholder='Date' value={date} onChangeText={setDate} />

                        <Text style ={styles.textInput}>Prescription</Text>
                        <TextInput style={styles.inputPr } placeholder='Prescription' value={presciptionDetail} onChangeText={setPresciptionDetail} />

                        <View style={{marginTop:20, marginBottom:60}}>
                            <Button title='Save' color='darkgrey' onPress={handleUpdate} />
                        </View>
                    </View>
                </View>
            </ScrollView>

        </ImageBackground>
        
     );
}

export default EditPrescription;

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