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
import { useIsFocused } from "@react-navigation/native";

function PatientReport({navigation}) {
    const isFocused = useIsFocused();
    // User Details
    const docRef = firebase.firestore().collection('doctors');
    const labRef = firebase.firestore().collection('labTest');

    const [isVisible, setIsVisible] = useState(false);

    const [doctorsList, setDoctorsList] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    const [selectedDoctor, setSelectedDoctor] = useState([]);

    const [searchValue, setSearchValue] = useState("");


    const [requestList, setRequestList] = useState([]);
    const [filteredRequestsList, setFilteredRequestsList] = useState([]);

    const [selectedRequest, setselectedRequest] = useState({
        data:{
            status:''
        }
    });

    useEffect(  () =>  {
        loadRequests(); 
    }, []);

    async function loadRequests(){ 

        const query = labRef.where('pid', '==', await AsyncStorage.getItem('uid'));
        query.onSnapshot((querySnapshot) => {
            const tempList = [];
          querySnapshot.docs.map((doc) => {
            tempList.push({
                id : doc.id,
                data : doc.data()
            })
          });
          setFilteredRequestsList(tempList);
          setRequestList(tempList);
        });
    }

    function handleSearch(){
        let tempList = [];
        if(searchValue != ""){
            for(let r of requestList){
                if(r.data.test.toLowerCase().startsWith(searchValue.toLowerCase())){
                    tempList.push(r);
                }
            }
            setFilteredRequestsList(tempList);
        } else{
            setFilteredRequestsList(requestList);
        }   
    }
    
    function handleDelete(){

        Alert.alert('Delete Prescription', 'Are you sure to delete '+selectedRequest.data.test +'?', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Yes', onPress: () => {
                labRef
                .doc(selectedRequest.id)
                .delete()
                .then(()=>{
                    alert("Deleted Successfully"); 
                    setIsVisible(false);
                }). catch(err=>{ 
                    alert(err);
                })
            }},
          ]);
    }

     // Function to request
    function handleRequest(value){
        let tempList = [];
          if(value != ""){
              for(let r of requestList){
                  if(r.data.status.toLowerCase().startsWith(value.toLowerCase())){
                      tempList.push(r);
                  }
              }
              setFilteredRequestsList(tempList);
          } else{
            setFilteredRequestsList(requestList)
          }    
      }
    
    return ( 
        <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>
            <Header title={"Request your Lab Report"} navigation={navigation} />

            <View style={{flex:0.9}}>

                <View style={styles.searchContainer}>
                    <TextInput style={styles.searchInput} placeholder='Search' value={searchValue} onChangeText={setSearchValue} />
                    <TouchableOpacity style={styles.loginBtn} onPress={handleSearch}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>Find</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.filterBtn} onPress={()=> handleRequest('')}>
                        <Text style={{color:'white'}}>ALL </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterBtn} onPress={()=> handleRequest('PENDING')}>
                        <Text style={{color:'white'}}>PENDING</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterBtn} onPress={()=> handleRequest('APPROVED')} >
                        <Text style={{color:'white'}}>APPROVED</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterBtn} onPress={()=> handleRequest('CANCELLED')}>
                        <Text style={{color:'white'}}>CANCELLED</Text>
                    </TouchableOpacity>
                </View>


                <ScrollView >
                        {filteredRequestsList.map(
                            req =>
                            <Pressable style={styles.doctorCard} key={req.id}  android_ripple={{color:'#e3e3e3'}}  onPress={() => {setselectedRequest(req); setIsVisible(true)}}  >
                                <View >
                                    <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>{req.data.test}</Text>
                                    <Text style={{color:'white', fontSize:15}}>Status :  {req.data.status}</Text>
                                </View>          
                            </Pressable>
                        )}

                </ScrollView>

                <TouchableOpacity style={styles.floatingButton} onPress={()=>navigation.navigate('MakeReportRequest')}>
                    <Text style={styles.floatingText}>+</Text>
                </TouchableOpacity>
            </View>

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

                    <View style={{flexDirection:'row', paddingHorizontal:10, marginBottom:30, borderBottomWidth:1,borderTopWidth:1, borderColor:'white', justifyContent:'space-around'}}>
                            {selectedRequest.data.status == 'PENDING' && 
                            <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center',padding:20}} onPress={() => {setIsVisible(false); navigation.navigate('EditRequest',{req:selectedRequest})}} >
                                <MaterialCommunityIcons name="pen" size={30} color={'white'}   />
                            </Pressable>
                            }
                            {selectedRequest.data.status == 'CANCELLED' && 
                                <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center',padding:20}} onPress={handleDelete} >
                                    <MaterialCommunityIcons name="delete" size={30} color={'white'}   />
                                </Pressable>
                            }
                    </View>
                    <View style={{paddingHorizontal:30, marginBottom:20}}>
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Test Name : </Text>
                        <Text style={{color:'white', }}>{selectedRequest.data.test}</Text>
                    </View>
                    <View style={{paddingHorizontal:30, marginBottom:20}}>
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Patient Name : </Text>
                        <Text style={{color:'white', }}>{selectedRequest.data.p_name}</Text>
                    </View>
                    <View style={{paddingHorizontal:30, marginBottom:20}}>
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Patient Mobile : </Text>
                        <Text style={{color:'white', }}>{selectedRequest.data.contact}</Text>
                    </View>
                    <View style={{paddingHorizontal:30, marginBottom:20}}>
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Status : </Text>
                        <Text style={{color:'white', }}>{selectedRequest.data.status}</Text>
                    </View>
                    <View style={{paddingHorizontal:30, marginBottom:20}}>
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Date : </Text>
                        <Text style={{color:'white', }}>{selectedRequest.data.date}</Text>
                    </View>
                  
                    
                </View>
            </Modal>                




        </ImageBackground>
        
     );
}

export default PatientReport;

const styles = StyleSheet.create({
    container: {
      backgroundColor:'#54C1FF',
      justifyContent:"center",
      alignItems:"center",
    },
    doctorCard:{
      backgroundColor:'#035E73',
      elevation:1,
      height:100,
      marginTop:10,
      marginHorizontal:30,
      borderRadius:15,
      paddingHorizontal:20,
      justifyContent:'center'
    },
    innerText:{
        fontSize:18,
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

    },
    btnContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        backgroundColor:'#049DBF',
        padding:15,
        elevation:10,
        borderRadius:20,
        marginHorizontal:30
      },
      modalContainer:{
        backgroundColor:'#003d4d',
        flex:0.7,
        marginTop: 'auto',
        elevation:5,
        borderTopEndRadius:30,
        borderTopStartRadius:30,

    },

  });