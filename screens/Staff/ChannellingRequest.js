import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native";
import { TextInput } from "react-native";
import {firebase} from '../../config/FirebaseConfig';

function ChannellingRequest({ navigation }) {

  const [doc_name, setDoc_Name] = useState("");
  const [p_name, setP_Name] = useState();
  const [email, setEmail] = useState();
  const [contact, setContact] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [status, setStatus] = useState();
  const [id, setId] = useState();

  const channellingRef = firebase.firestore().collection('channellings');

  const [channellingsList, setChannellingsList] = useState([]);

  const [isDetails, setIsDetails] = useState(false);

  const [filteredChannellings, setFilteredChannellings] = useState([]);
  const [searchValue, setSearchValue] = useState("");


  //View channelling requests
  useEffect(() => {

     channellingRef.onSnapshot(
      querySnapshot => {
        let tempList = [];
        querySnapshot.forEach((doc)=>{
          tempList.push({
            id:doc.id,
            channelling:doc.data()
          })
        })
        // console.log(tempList);
        setChannellingsList(tempList);
        setFilteredChannellings(tempList);
      }
     )

  }, []);

  //Search 
    function handleSearch(){
      let tempList = [];
      if(searchValue != ""){
          for(let c of channellingsList){
              if(c.channelling.doc_name.toLowerCase().startsWith(searchValue.toLowerCase())){
                  tempList.push(c);
              }
          }
          setFilteredChannellings(tempList);
      } else{
          setFilteredChannellings(schedulesList)
      }    
    }

  //If selected the one channelling card then it will open with the relevant details.
  function setSelectedChannelling(doc) {
    setDoc_Name(doc.channelling.doc_name);
    setP_Name(doc.channelling.p_name);
    setEmail(doc.channelling.email);
    setContact(doc.channelling.contact);
    setDate(doc.channelling.date);
    setTime(doc.channelling.time);
    setStatus(doc.channelling.status);
    setId(doc.id);
  }

  //Update Channel Details
  function handleUpdateChannelling(value) {

    const channelling ={
      date:date,
      time: time,
      status:value,
    }
    console.log(id)
    channellingRef.doc(id)
    .update(channelling)
    .then(()=> {
      alert('Successfully update the channelling request');
    }).catch((err)=>{
      alert(err.message)
    })
  }

  //Select 'APPROVED' 'PENDING' & 'REJECT' Channelling requests.
  function handleRequest(value){
    let tempList = [];
      if(value != ""){
          for(let c of channellingsList){
              if(c.channelling.status.toLowerCase().startsWith(value.toLowerCase())){
                  tempList.push(c);
              }
          }
          setFilteredChannellings(tempList);
      } else{
          setFilteredChannellings(channellingsList)
      }    
  }

  return (
    <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{ flex: 1 }}>

      {/* Add Screen Title */}
      <Header title={"Channelling Requests"} navigation={navigation} />

      <View style={{ flex: 0.9 }}>
            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder='Search' value={searchValue} onChangeText={setSearchValue} />
                <TouchableOpacity style={styles.loginBtn} onPress={handleSearch}>
                    <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>Find</Text>
                </TouchableOpacity>
            </View>

          <ScrollView style={{ flex: 0.8 }}>

          {/* Searchbar */}
        <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.filterBtn} onPress={()=> handleRequest('')}>
                <Text  style={{color:'white'}}>ALL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} onPress={()=> handleRequest('PENDING')}>
                <Text  style={{color:'white'}}>PENDING</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} onPress={()=> handleRequest('APPROVED')} >
                <Text  style={{color:'white'}}>APPROVED</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} onPress={()=> handleRequest('REJECTED')}>
                <Text  style={{color:'white'}}>REJECTED</Text>
            </TouchableOpacity>
        </View>

        {filteredChannellings.map(
          doc=>
          <TouchableOpacity style={styles.floatingButton} key={doc.id} onPress={() => {setIsDetails(true); setSelectedChannelling(doc)}}>
          <View style={styles.channel_card}>
            <View style={{ justifyContent: 'center', marginBottom: 5, paddingLeft: 10 }} >
              <Text style={styles.inner_text_doctor}>Dr. {doc.channelling.doc_name}</Text>
              <Text style={styles.inner_text}>Patient: {doc.channelling.p_name}</Text>
              <Text style={styles.inner_text}>Email: {doc.channelling.email}</Text>
              <Text style={styles.inner_text}>Contact: {doc.channelling.contact}</Text>
              <Text style={styles.inner_text}>Date: {doc.channelling.date}</Text>
              <Text style={styles.inner_text}>Time: {doc.channelling.time}</Text>
              <Text style={styles.inner_text}>Status: {doc.channelling.status}</Text>
            </View>
          </View>
          </TouchableOpacity>
        )}

        </ScrollView>
      </View>

      {/* Approve or Reject Requests */}

      <Modal
      animationType="slide"
      transparent={true}
      visible={isDetails}
      onRequestClose={() => {
          // this.closeButtonFunction()
      }}>

      

        <View style={styles.modalContainer}>
          <Pressable android_ripple={{ color: '#e3e3e3' }} style={{ justifyContent: 'center', marginLeft: 'auto', padding: 15 }} onPress={() => setIsDetails(false)} >
            <MaterialCommunityIcons name="close" size={26} color={'white'} />
          </Pressable>

          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>Channelling Details</Text>
          </View>
                    
          <View style={styles.card_Container}>

            <View style={styles.textContainer}>
                <Text style={styles.innerTitle}>Doctor's Name : </Text>
                 <Text style ={styles.innerText}>Dr. {doc_name}</Text>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.innerTitle}>Patinet : </Text>
                 <Text style ={styles.innerText}>{p_name}</Text>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.innerTitle}>Email: </Text>
                 <Text style ={styles.innerText}>{email}</Text>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.innerTitle}>Contact : </Text>
                 <Text style ={styles.innerText}>{contact}</Text>
            </View>
            <View style={styles.textContainer}>
                 <Text style={styles.innerTitle}>Status : </Text>
                <Text style ={styles.innerText}>{status}</Text>
            </View>
            {status != 'PENDING' &&
            <> 
            <View style={styles.textContainer}>
                 <Text style={styles.innerTitle}>Date : </Text>
                  <Text style ={styles.innerText}>{date}</Text>
             </View>

             <View style={styles.textContainer}>
                 <Text style={styles.innerTitle}>Time : </Text>
                  <Text style ={styles.innerText}>{time}</Text>
             </View>
             </>
          }
            {status == 'PENDING'   &&
            <>
            <Text style ={styles.innerTitle}>Date of availability for channelling:</Text>
            <TextInput style={styles.input} placeholder='Date' value={date} onChangeText={setDate}/>

            <Text style ={styles.innerTitle}>Time:</Text>
            <TextInput style={styles.input} placeholder='Time' value={time} onChangeText={setTime}/>

              <View style={styles.btn_class}>
              <Button style={marginBottom = 20} color="blue" title="Approve" onPress={()=>handleUpdateChannelling("APPROVED")}/>
              <View>
                <Text></Text>
              </View>
              <Button style={styles.reject_btn} color="red" title="Reject" onPress={()=>handleUpdateChannelling("REJECTED")} />
            </View>
            </>
            }

            
          </View>
        </View>   
      </Modal>
    </ImageBackground>

  );
}

export default ChannellingRequest;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#54C1FF',
    justifyContent: "center",
    alignItems: "center",
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
  channel_card: {
    backgroundColor: '#035E73',
    elevation: 1,
    height: 200,
    marginTop: 15,
    marginHorizontal: 40,
    borderRadius: 10,
    justifyContent:'center',
    paddingHorizontal:25


  },
  inner_text_doctor: {
    fontSize: 20,
    textAlign: "left",
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white',
    borderBottomWidth:1,
    borderColor:'white',

  },
  inner_text: {
    fontSize: 16,
    textAlign: "left",
    color: 'white'
  },
  modalContainer: {
    backgroundColor: '#003d4d',
    marginTop: 'auto',
    elevation: 5,
    flex: 1,
  },
  modalTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 30,
    color: 'white',
  },
  card_Container: {
    marginTop:20,
    marginHorizontal: 50,
    height: 600,
    backgroundColor: '#008b8b',
    borderRadius: 7,
    padding: 25,
  },
  text_output_doctor: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  text_output_details: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 15,
  },
  approve_btnContainer: {
    backgroundColor: "#009688",

  },
  approve_btn: {
    marginBottom: 20,
  },
  reject_btn: {
    marginTop: 20,
    backgroundColor: 'black',
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
    fontWeight: '500',
    color:'#d3d3d3',
    fontSize:17,
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