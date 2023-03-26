import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React,{useEffect, useState} from "react";
import Header from "../components/Header";
import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native";
import { TextInput } from "react-native";
import {firebase} from '../config/FirebaseConfig';
import { ScrollView } from "react-native";


function DoctorsScreen({navigation}) {


    // User Details
    const [name, setName] = useState("");
    const [email, setEmail] = useState();
    const [specialization, setSpecialization] = useState();
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState();
    const [id, setId] = useState();

    const docRef = firebase.firestore().collection('doctors');
    const roleRef = firebase.firestore().collection('roles');

    const [isVisible, setIsVisible] = useState(false);
    const [editIsVisible, setEditIsVisible] = useState(false);
    const [isVisibleView, setIsVisibleView] = useState(false);
    const [doctorsList, setDoctorsList] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    const [selectedDoctor, setSelectedDoctor] = useState({
        doctor:{
            name:" ",


        }
    });
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


    function handleDelete(doctor){

        Alert.alert('Delete User', 'Are you to delete '+doctor.doctor.name +'?', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Yes', onPress: () => {

                 //Delete role
                 const query = roleRef.where('uid', '==', doctor.doctor.uid);
                 query.get().then(querySnapshot => {
                     querySnapshot.forEach(documentSnapshot => {
                       documentSnapshot.ref.delete();
                     });
                 });

                docRef
                .doc(doctor.id)
                .delete()
                .then(()=>{
                    alert("Deleted Successfully"); 
                }). catch(err=>{ 
                    alert(err);
                })
            }},
          ]);
    }

   
    function validateMobile(no){
        const pattern = /^0[0-9]{9}$/; 
        return pattern.test(no);
    }


    async function handleAddDoctor(){
        let uid = null;

      
        if(email == "" || password == "" || name == "" || specialization =="" || phoneNumber == ""){
            alert("Please fill all the input fields.");
            return;
        }
        
        if(!validateMobile(phoneNumber)){
            alert("Invalid Mobile number")
            return;
        }


      await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((res)=>{
        uid = res.user.uid
      })
      .catch((err)=>{
        // alert("Failed to add the user. Please try again.");
        alert(err);
        console.log(err)
      });

      if(uid != null){

        await roleRef.add({uid:uid, role:1});

        const user = {
          uid:uid,
          name:name,
          specialization:specialization,
          phoneNumber:phoneNumber,
          email:email,
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
        setName("");
        setEmail("");
        setSpecialization("");
        setPhoneNumber("");
        setPassword("");
    }

    async function setSelectedDoc(doc){
        setEmail(doc.doctor.email);
        setName(doc.doctor.name);
        setEmail(doc.doctor.email);
        setSpecialization(doc.doctor.specialization);
        setPhoneNumber(doc.doctor.phoneNumber);
        setPassword(doc.doctor.password);
        setId(doc.id)
    }

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

     function handleUpdateDoctor(){
       
        const user = {
            name:name,
            specialization:specialization,
            phoneNumber:phoneNumber,
            email:email,
        }

         docRef.doc(id)
            .update(user).then(()=>{
               alert("Successfully updated the user");
               reset();
               setEditIsVisible(false)
            }).catch((err)=>{
                alert(err.message)
            })
    }



    return ( 
        
        <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>
            <Header title={"Doctors"} navigation={navigation} />

            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder='Search' value={searchValue} onChangeText={setSearchValue} />
                <TouchableOpacity style={styles.loginBtn} onPress={handleSearch}>
                    <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>Find</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{flex:0.8}}>

                {filteredDoctors.map(
                    doc => 
                    <View style={styles.doctorCard} key={doc.doctor.uid}>
                        <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center',paddingHorizontal:15}} onPress={() => {setEditIsVisible(true); setSelectedDoc(doc)}} >
                            <MaterialCommunityIcons name="pen" size={26} color={'white'}   />
                        </Pressable>
 
                        <Pressable  android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center',paddingHorizontal:30}} onPress={() => {setIsVisibleView(true); setSelectedDoc(doc)}}  >
                            <Text style={styles.innerText}>Dr. {doc.doctor.name}</Text>
                        </Pressable>

                        <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center',paddingHorizontal:15}} onPress={()=>handleDelete(doc)} >
                            <MaterialCommunityIcons name="delete" size={26} color={'white'}   />
                        </Pressable>
                    </View>
                    )}


            </ScrollView>
            <TouchableOpacity style={styles.floatingButton} onPress={()=>{setIsVisible(true); reset()}}>
                <Text style={styles.floatingText}>+</Text>
            </TouchableOpacity>


            {/* Add Doctor Modal */}
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
                    <View style={styles.modalTitleContainer}>
                        <Text style={styles.modalTitle}>Add Doctor</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style ={styles.textInput}>Name</Text>
                        <TextInput style={styles.input} placeholder='Name' value={name} onChangeText={setName} />

                        <Text style ={styles.textInput}>Email</Text>
                        <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />

                        <Text style ={styles.textInput}>Specialization</Text>
                        <TextInput style={styles.input} placeholder='Specialization' value={specialization} onChangeText={setSpecialization} />

                        <Text style ={styles.textInput}>Mobile</Text>
                        <TextInput style={styles.input} placeholder='Mobile' value={phoneNumber} onChangeText={setPhoneNumber} />

                        <Text style ={styles.textInput}>Password</Text>
                        <TextInput style={styles.input} secureTextEntry placeholder='Password' value={password} onChangeText={setPassword} />

                        <View style={{marginTop:20}}>
                            <Button title='Add' color='darkgrey' onPress={handleAddDoctor} />
                        </View>
                    </View>
                </View>
            </Modal>


            {/* Edit Doctor modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editIsVisible}
                onRequestClose={() => {
                    // this.closeButtonFunction()
                }}>
                <View style={styles.modalContainer}>
                    <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center', marginLeft:'auto', padding:15}} onPress={()=>setEditIsVisible(false)} >
                        <MaterialCommunityIcons name="close" size={26} color={'white'}   />
                    </Pressable>
                    <View style={styles.modalTitleContainer}>
                        <Text style={styles.modalTitle}>Edit Doctor</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style ={styles.textInput}>Name</Text>
                        <TextInput style={styles.input} placeholder='Name' value={name} onChangeText={setName} />

                        <Text style ={styles.textInput}>Email</Text>
                        <TextInput style={styles.input} editable = {false}  placeholder='Email' value={email} onChangeText={setEmail} />

                        <Text style ={styles.textInput}>Specialization</Text>
                        <TextInput style={styles.input} placeholder='Specialization' value={specialization} onChangeText={setSpecialization} />

                        <Text style ={styles.textInput}>Mobile</Text>
                        <TextInput style={styles.input} placeholder='Mobile' value={phoneNumber} onChangeText={setPhoneNumber} />

                        <View style={{marginTop:20}}>
                            <Button title='Save' color='darkgrey' onPress={handleUpdateDoctor} />
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisibleView}
                onRequestClose={() => {
                    // this.closeButtonFunction()
                }}>
                <View style={styles.modalViewContainer}>
                    <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center', marginLeft:'auto', padding:15}} onPress={()=>setIsVisibleView(false)} >
                        <MaterialCommunityIcons name="close" size={26} color={'white'}   />
                    </Pressable>

                    <View style={{justifyContent:'center', alignItems:'center', borderBottomWidth:1, borderColor:'white',marginBottom:20}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:25, marginBottom:20}}>User Details</Text>
                    </View>

                    <View style={{paddingHorizontal:30, marginBottom:20}}>
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Doctor's Name : </Text>
                        <Text style={{color:'white', }}>{name}</Text>
                    </View>
                    
                    <View style={{paddingHorizontal:30, marginBottom:20}}>
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Mobile : </Text>
                        <Text style={{color:'white', }}>{phoneNumber}</Text>
                    </View>

                    <View style={{paddingHorizontal:30, marginBottom:20}}>
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Email : </Text>
                        <Text style={{color:'white', }}>{email}</Text>
                    </View>

                    <View style={{paddingHorizontal:30, marginBottom:20}}>
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>Specialization : </Text>
                        <Text style={{color:'white', }}>{specialization}</Text>
                    </View>
              
                </View>
            </Modal>            

        </ImageBackground>
        
     );
}

export default DoctorsScreen;

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
    modalViewContainer:{
        backgroundColor:'#003d4d',
        flex:0.7,
        marginTop: 'auto',
        elevation:5,
        borderTopEndRadius:30,
        borderTopStartRadius:30,
        padding:20

    } 

  });