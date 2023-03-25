import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

function DoctorsListView({navigation}) {

    const docRef = firebase.firestore().collection('doctors');


    const [isVisible, setIsVisible] = useState(false);

    const [doctorsList, setDoctorsList] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    const [selectedDoctor, setSelectedDoctor] = useState([]);

    const [searchValue, setSearchValue] = useState("");



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
               setFilteredDoctors(docList)
            }
        )  
    }, []);


    function handleSearch(){
        let tempList = [];
        if(searchValue != ""){
            for(let d of doctorsList){
                if(d.doctor.name.toLowerCase().startsWith(searchValue.toLowerCase())){
                    tempList.push(d);
                }
            }
            setFilteredDoctors(tempList);
        } else{
            setFilteredDoctors(doctorsList)
        }   
    }
 

    return ( 
        <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>
            <Header title={"Counselor List"} navigation={navigation} />

            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder='Search' value={searchValue} onChangeText={setSearchValue} />
                <TouchableOpacity style={styles.loginBtn} onPress={handleSearch}>
                    <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>Find</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={{flex:0.8}}>

            {filteredDoctors.map(
                    doc => 
                    <Pressable style={styles.doctorCard} key={doc.id}  android_ripple={{color:'#e3e3e3'}}  onPress={() => navigation.navigate('DoctorsProfile',{doctor:doc})}  >
                        <View >
                            <Text style={styles.innerText}>Dr. {doc.doctor.name}</Text>
                        </View>          
                    </Pressable>
                    )}
            </ScrollView>
        </ImageBackground>
        
     );
}

export default DoctorsListView;

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
      alignItems:'center'
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
        marginVertical:10,
        flexDirection:'row'
    },
    searchInput:{
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingLeft:15,
        width: '75%',
    },
    loginBtn:{
        width: '25%',
        backgroundColor: '#049DBF',
        borderRadius: 25,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',

    }

  });