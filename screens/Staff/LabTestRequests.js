import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React,{useEffect, useState} from "react";

import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native";
import { TextInput } from "react-native";
import {firebase} from '../../config/FirebaseConfig';
import Header from "../../components/Header";

function LabTestRequests({navigation}) {

    const [p_name, setP_name] = useState("");
    const [test, setTest] = useState("");
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [status, setStatus] = useState();
    const [id, setId] = useState();

    const testRef = firebase.firestore().collection('labTest');

    const [testsList, setTestsList] = useState([]);

    const [isVisible, setIsVisible] = useState(false);

    const [filteredTests, setFilteredTests] = useState([]);
    const [searchValue, setSearchValue] = useState("");


    //View Test List
    useEffect(() => {
        testRef.onSnapshot(
            quertSnapshot => {
                let tempList = [];
                quertSnapshot.forEach((doc)=>{
                    tempList.push({
                        id:doc.id,
                        test:doc.data()
                    })
                })
                setTestsList(tempList);
                setFilteredTests(tempList);
            }
        )
        
    }, []);

    //Search
    function handleSearch(){
        let tempList = [];
        if(searchValue != ""){
            for(let t of testsList){
                if(t.test.p_name.toLowerCase().startsWith(searchValue.toLowerCase())){
                    tempList.push(t);
                }
            }
            setFilteredTests(tempList);
        } else{
            setFilteredTests(testsList)
        }    
      }

      //If selected the test card then it will open with thw relevant details.
      function setSelectedTest(doc) {
        setP_name(doc.test.p_name);
        setTest(doc.test.test);
        setDate(doc.test.date);
        setTime(doc.test.time);
        setStatus(doc.test.status);
        setId(doc.id);

      }

      //Update test details as set date, time and status.
      function handleUpdateTest(tstatus){

        const test = {
            date:date,
            time:time,
            status:tstatus,
        }

        testRef.doc(id)
        .update(test)
        .then(() => {
            alert('Successfully update the ' + p_name );
            setIsVisible(false);
        }).catch((err) => {
            alert(err.message)
        })

      }

      //Select 'PENDING' & 'AVAILABLE' lab tests.
      function handleLabRequest(val){
        let tempList = [];
        if(val != ""){
            for(let t of testsList){
                if(t.test.status.toLowerCase().startsWith(val.toLowerCase())){
                    tempList.push(t);
                }
            }
            setFilteredTests(tempList);
        } else{
            setFilteredTests(testsList)
        }    
      }
    


    return ( 
        <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>

            {/* Add Screen Title */} 
            <Header title={"Lab Test"} navigation={navigation} />

            <View style={{flex:0.9}}>

            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder='Search' value={searchValue} onChangeText={setSearchValue} />
                <TouchableOpacity style={styles.loginBtn} onPress={handleSearch}>
                    <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>Find</Text>
                </TouchableOpacity>
            </View>

            {/* SearchBar */}
            <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.filterBtn} onPress={()=> handleLabRequest('')}>
                <Text style={{color:'white'}}>ALL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} onPress={()=> handleLabRequest('PENDING')}>
                <Text style={{color:'white'}}>PENDING</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} onPress={()=> handleLabRequest('APPROVED')} >
                <Text style={{color:'white'}}>APPROVED</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} onPress={()=> handleLabRequest('CANCELLED')} >
                <Text style={{color:'white'}}>CANCELLED</Text>
            </TouchableOpacity>
            </View>

            <ScrollView>
            {filteredTests.map(
             doc=>
                <TouchableOpacity key={doc.id} style={styles.floatingButton} onPress={() => {setIsVisible(true); setSelectedTest(doc)}}>

                   {/* test card */}
                    <View style={styles.test_card}>
                        <Text style={styles.doctor_details}>{doc.test.p_name}</Text>
                        <Text style={styles.sub_details}>Test: {doc.test.test}</Text>                       
                        <Text style={styles.sub_details}>Date: {doc.test.date}</Text>
                        {/* <Text style={styles.sub_details}>Time: {doc.test.time}</Text> */}
                        <Text style={styles.sub_details}>Status: {doc.test.status} </Text>

                    </View>
                </TouchableOpacity>
            )}
            </ScrollView>
            </View>



{/* The way of open Individual Test Card */}


           <Modal
           animationType="slide"
           transparent={true}
           visible={isVisible}
           onRequestClose={() => {
               // this.closeButtonFunction()
           }}>
                <View style={styles.modalContainer}>
                    <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center', marginLeft:'auto', padding:15}} onPress={() => setIsVisible(false)}>
                        <MaterialCommunityIcons name="close" size={26} color={'white'}   />
                    </Pressable>
                    <View style={styles.modalTitleContainer}>
                        <Text style={styles.modalTitle}>Request Details</Text>
                    </View>


 
                    <View style={styles.formContainer}>

                        <View style={styles.textContainer}>
                            <Text style={styles.innerTitle}>Test Name : </Text>
                            <Text style ={styles.innerText}>{test}</Text>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.innerTitle}>Patient Name : </Text>
                            <Text style ={styles.innerText}>{p_name}</Text>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.innerTitle}>Status : </Text>
                            <Text style ={styles.innerText}>{status}</Text>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.innerTitle}>Date : </Text>
                            <Text style ={styles.innerText}>{date}</Text>
                        </View>

      
                        
                        {status == 'PENDING' &&
                        
                        <>
                        <Text style={styles.textInput}>Date of availability of test report:</Text>
                        <TextInput style={styles.input} placeholder='Date' value={date} onChangeText={setDate} />

                        {/* <Text style={styles.textInput}>Time:</Text>
                        <TextInput style={styles.input} placeholder='Time' value={time} onChangeText={setTime} /> */}
                        

                        <View style={{marginTop:20}}>
                            <Button title='The report is available' color='#696969' onPress={()=>handleUpdateTest('APPROVED')}/>
                            <Text></Text>
                            <Button title='CANCELLED' color='#696969' onPress={()=>handleUpdateTest('CANCELLED')}/>
                        </View>
                        </>
                         } 

                         
                    </View>
                </View>
            </Modal>

        </ImageBackground>
        
     );
}

export default LabTestRequests;

const styles = StyleSheet.create({
    container: {
      backgroundColor:'#54C1FF',
      justifyContent:"center",
      alignItems:"center",
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
    test_card: {
       marginTop: 20,
       marginHorizontal: 50,
       height: 170,
       backgroundColor:'#035E73',
       borderRadius: 10, 
       paddingLeft: 35,
       elevation:5
    },
    doctor_details: {
        marginTop: 30,
        // marginLeft: 20,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sub_details: {    
        fontSize:15,
        marginBottom:4,
        fontWeight: 500,
        color: 'white',

    },
    action_btns:{
        marginLeft:190,
        flexDirection: 'row',
        
    },
    modalContainer:{
        backgroundColor:'#003d4d',
        marginTop: 'auto',
        elevation:5,
        flex:1, 
    },
    modalTitleContainer:{
        justifyContent: 'center',
        alignItems:'center',
        marginBottom: 25,
    },
    modalTitle:{
        fontSize:23,
        color:'white',

    },
    input: {
        height: 40,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding:5
      },
    textInput_name:{
        marginTop: 10,
        marginBottom: 30,
        fontWeight: '500',
        color:'white',
        textAlign: 'center',
        fontSize:20,
      },
    textInput: {
        marginTop: 10,
        marginBottom: 10,
        fontWeight: '500',
        color:'white',
        fontSize:18,
    },
    formContainer:{
        backgroundColor: '#008080',
        marginVertical:50,
        marginHorizontal:30,
        height:550,
        borderRadius: 10,
        padding: 40,
        
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
    
      textContainer:{
        marginBottom:10
      },
      innerTitle:{
        color:'white',
        fontWeight:'bold',
        fontSize:18
      },
      innerText:{
        color:'white'
      }
      

    

  });