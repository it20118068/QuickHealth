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
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function PatientPrescription({navigation}) {

    const presciptionRef = firebase.firestore().collection('prescriptions');

    const [presciptionList, setPresciptionList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const [isVisible, setIsVisible] = useState(false);
    const [editIsVisible, setEditIsVisible] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const [selectedPres, setSelectedPres] = useState({
          prescription: {
           doctorName:"ss",
           name:"ss",
           mobile:"ss",
           date:"ss",
           presciptionDetail:"ss"
        }
    });

    
    useEffect(  () =>  {
        loadPrescriptions(); 
    }, []);

    async function loadPrescriptions(){ 
        const query = presciptionRef.where('mobile', '==', await AsyncStorage.getItem('phoneNumber'));
        query.onSnapshot((querySnapshot) => {
            const tempList = [];
          querySnapshot.docs.map((doc) => {
            tempList.push({
                id:doc.id,
                prescription:doc.data()
            })
          });
          setFilteredList(tempList);
          setPresciptionList(tempList);
        });
    }

    function handleSearch(){
        let tempList = [];
        if(searchValue != ""){
            for(let p of presciptionList){
                if(p.prescription.doctorName.toLowerCase().startsWith(searchValue.toLowerCase())){
                    tempList.push(p);
                }
            }
            setFilteredList(tempList);
        } else{
            setFilteredList(presciptionList)
        }      
    }
    
    return ( 
        <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>
            <Header title={"Prescriptions"} navigation={navigation} />

            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder='Search' value={searchValue} onChangeText={setSearchValue} />
                <TouchableOpacity style={styles.loginBtn} onPress={handleSearch}>
                    <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>Find</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{flex:0.8}}>
                            
                {filteredList.map(
                    pres => 
                 
                        <Pressable style={styles.doctorCard} key={pres.id}  android_ripple={{color:'#e3e3e3'}}  onPress={() => {setSelectedPres(pres); setIsVisible(true); }} >
                            <View style={{alignItems:'flex-start', padding:25}} >
                                <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>Dr. {pres.prescription.doctorName}</Text>
                                <Text style={styles.innerText}>Date : {pres.prescription.date}</Text>
                            </View>
                        </Pressable>
                
                    )}
            </ScrollView>
           
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    // this.closeButtonFunction()
                }}>
                <View style={styles.modalContainer}>
                    <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center', marginLeft:'auto', padding:15}} onPress={()=>setIsVisible(false)} >
                        <MaterialCommunityIcons name="close" size={26} color={'white'}   />
                    </Pressable>

                    <View style={{justifyContent:'center', alignItems:'center', borderBottomWidth:1, borderColor:'white',marginBottom:20}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:25, marginBottom:20}}>Prescription Details</Text>
                    </View>
                    <ScrollView>

                        <View style={{paddingHorizontal:30, marginBottom:20}}>
                            <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Doctor's Name : </Text>
                            <Text style={{color:'white', }}>{selectedPres.prescription.doctorName}</Text>
                        </View>
                        <View style={{paddingHorizontal:30, marginBottom:20}}>
                                <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Patient Name : </Text>
                                <Text style={{color:'white', }}>{selectedPres.prescription.name}</Text>
                            </View>
                        <View style={{paddingHorizontal:30, marginBottom:20}}>
                            <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Patient Mobile : </Text>
                            <Text style={{color:'white', }}>{selectedPres.prescription.mobile}</Text>
                        </View>

                        <View style={{paddingHorizontal:30, marginBottom:20}}>
                            <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Date :  </Text>
                            <Text style={{color:'white', }}>{selectedPres.prescription.date}</Text>
                        </View>
                        <View style={{paddingHorizontal:30, marginBottom:20}}>
                            <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Prescription : </Text>
                            <Text style={{color:'white', }}>{selectedPres.prescription.presciptionDetail}</Text>
                        </View>
                    </ScrollView>
                    
                </View>
            </Modal>

        </ImageBackground>
        
     );
}

export default PatientPrescription;

const styles = StyleSheet.create({
    container: {
      backgroundColor:'#54C1FF',
      justifyContent:"center",
      alignItems:"center",
    },
    doctorCard:{
      backgroundColor:'#035E73',
      elevation:1,
    //   justifyContent: 'center',
      alignItems:'center',
      height:80,
      marginTop:10,
      marginHorizontal:30,
      borderRadius:15,
      flexDirection:'row', 
    //   justifyContent:'space-around',
    },
    innerText:{
        // fontSize:10,
        textAlign:"center",
        marginTop:5,
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
 
    modalContainer:{
        backgroundColor:'#003d4d',
        flex:0.7,
        marginTop: 'auto',
        elevation:5,
        borderTopEndRadius:30,
        borderTopStartRadius:30,

    },
    customBtn:{
        width: '50%',
        // backgroundColor: 'white',
        // borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderColor:'#049DBF',
        borderBottomWidth:1
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