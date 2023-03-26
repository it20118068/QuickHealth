import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React,{useEffect, useState} from "react";
import Header from "../../components/Header";
import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native";
import { TextInput } from "react-native";
import {firebase} from '../../config/FirebaseConfig';

function CreateSchedule({navigation}) {

    const [doc_Id, setDocId] = useState();
    const [name, setName] = useState("");
    const [specialization, setSpecialization] = useState();
    const [day, setDay] = useState("");
    const [from_time, setFrom_time] = useState("");
    const [to_time, setTo_time] = useState("");
    const [id, setId] = useState("");

    const scheduleRef = firebase.firestore().collection('schedules');
    const docRef = firebase.firestore().collection('doctors');

    const [schedulesList, setSchedulesList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const [isVisible, setIsVisible] = useState(false);
    const [editIsVisible, setEditIsVisible] = useState(false);

    const [doctorsList, setDoctorsList] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [searchValue, setSearchValue] = useState("");


   //View Schedules.
    useEffect(() => {
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
        scheduleRef.onSnapshot(
            querySnapshot => {
                const scheduleList = [];
                querySnapshot.forEach((doc)=>{
                    scheduleList.push({
                        id:doc.id,
                        schedule:doc.data()
                    })

                })
                setSchedulesList(scheduleList);
                setFilteredList(scheduleList);
            }
        )     
    }, []);


    //Create Schedules.
    function handleAddSchedule() {


        if(day == "" || from_time == "" || to_time == ""){
            alert("Please fill all the input fields.");
            return;
        }
       
            const schedule = {
                name: selectedDoctor.doctor.name,
                doc_Id: selectedDoctor.doctor.uid,
                specialization: selectedDoctor.doctor.specialization,
                day: day,
                from_time: from_time,
                to_time: to_time,

            }

            firebase.firestore().collection('schedules')
            .add(schedule)
            .then((res) => {
                alert("Schedule added successfully");
                setIsVisible(false);
                setSelectedDoctor(null);
                reset();
            }).catch((err) => {
                alert("Failed to add the schedule. Please try again.");
                console.log(err)
            });

    }

    //Refresh page.
    function reset(){
        setDocId("");
        setName("");
        setSpecialization("");
        setDay("");
        setFrom_time("");
        setTo_time("");
    }

    //When user needs to update the relevant schedule then click the edit icon and it will show with the relevant details. 
    function setSelectedSchedule(doc) {
        setName(doc.schedule.name);
        setDocId(doc.schedule.doc_Id);
        setSpecialization(doc.schedule.specialization);
        setDay(doc.schedule.day);
        setFrom_time(doc.schedule.from_time);
        setTo_time(doc.schedule.to_time);
        setId(doc.id);
    }

    //Update Schedule.
    function handleUpdateSchedule() {
        
        const schedule = {
            doc_Id:doc_Id,
            name: name,
            specialization: specialization,
            day: day,
            from_time: from_time,
            to_time: to_time,
            
        }
        scheduleRef.doc(id)
        .update(schedule)
        .then(() => {
            alert('Successfully update the schedule');
            reset();
            setEditIsVisible(false)
        }).catch((err) => {
            alert(err.message)
        })

    }

    //Search 
    function handleSearch(){
        let tempList = [];
        
        if(searchValue != ""){
            console.log(searchValue)
            for(let s of schedulesList){
                console.log(s.schedule.name)
                if(s.schedule.name.toLowerCase().startsWith(searchValue.toLowerCase())){
                    tempList.push(s);
                }
            }
            
            setFilteredList(tempList);
        } else{
            setFilteredList(schedulesList)
        }
        console.log(tempList)
        
    }

    function handleSearchDoctor(){
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

    //Delete Schedule.
    function handleDeleteSchedule(schedule) {

        Alert.alert('Delete Schedule', 'Do you want to delete '+ 'Dr. ' + schedule.schedule.name+ "'s " + schedule.schedule.day + ' schedule ?', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Yes', onPress: () => {
                scheduleRef
                .doc(schedule.id)
                .delete()
                .then(()=>{
                    alert("Deleted Successfully"); 
                }). catch(err=>{ 
                    alert(err);
                })
            }},
          ]);

    }
    


    return ( 
        <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>

            {/* Add Screen Title */}
            <Header title={"Schedule List"} navigation={navigation} />

            <View style={{flex:0.9}}>

            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder='Search' value={searchValue} onChangeText={setSearchValue} />
                <TouchableOpacity style={styles.loginBtn} onPress={handleSearch}>
                    <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>Find</Text>
                </TouchableOpacity>
            </View>

                <ScrollView style={{flex:0.8}}>

{/* Doctor card: 1 */}
                {filteredList.map(
                    doc=>
                
                    <View style={styles.doctor_card} key={doc.id}>
                        <Text style={styles.doctor_details}>Dr. {doc.schedule.name}</Text>
                        <Text style={styles.sub_details}>Specialization: {doc.schedule.specialization}</Text>
                        {/* <Text style={styles.sub_details}>ID: {doc.schedule.doc_Id}</Text> */}
                        <Text style={styles.sub_details}>Day: {doc.schedule.day}</Text>
                        <Text style={styles.sub_details}>Time: {doc.schedule.from_time} to {doc.schedule.to_time}</Text>

                        <View style={styles.action_btns}>

                        <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center', marginLeft:'auto', padding:15}} onPress={() => {setEditIsVisible(true); setSelectedSchedule(doc)}} >
                        <MaterialCommunityIcons name="pen" size={27} color={'#c7ffff'}   />
                        </Pressable>

                        <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center', marginLeft:'auto', padding:15}} onPress={()=>handleDeleteSchedule(doc)} >
                        <MaterialCommunityIcons name="delete" size={27} color={'#c7ffff'}   />
                        </Pressable>

                        </View>

                    </View>
                    )}

                </ScrollView>

                <TouchableOpacity style={styles.floatingButton} onPress={()=>setIsVisible(true)}>
                    <Text style={styles.floatingText} >+</Text>
                </TouchableOpacity>
            </View>


            {/* Add Doctor Modal */}
            

            <Modal
              animationType="slide"
              transparent={true}
              visible={isVisible}
              onRequestClose={() => {
                  // this.closeButtonFunction()
              }}>

                <View style={styles.modalContainer}>
                    <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center', marginLeft:'auto', padding:15}} onPress={()=>{setIsVisible(false);setSelectedDoctor(null)}} >
                        <MaterialCommunityIcons name="close" size={26} color={'white'}   />
                    </Pressable>
                    <View style={styles.modalTitleContainer}>
                        <Text style={styles.modalTitle}>Create Doctor's Schedule</Text>
                    </View>

                    {selectedDoctor == null && 
                        <>  

                            <View style={styles.searchContainer}>
                                <TextInput style={styles.searchInput} placeholder='Search' value={searchValue} onChangeText={setSearchValue} />
                                <TouchableOpacity style={styles.loginBtn} onPress={handleSearchDoctor}>
                                    <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>Find</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <ScrollView>
                                    {filteredDoctors != null && filteredDoctors.map(
                                        doc =>
                                        <TouchableOpacity style={styles.docBtn}  onPress={()=>setSelectedDoctor(doc)}>
                                            <Text style={{color:'white'}} >{doc.doctor.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                </ScrollView>
                            </View>
                        </>
                    }
                    {selectedDoctor != null && 
                    <ScrollView>

                    <View style={styles.formContainer}>
                        <Text style ={styles.textInput}>Name</Text>
                        <TextInput style={styles.input} editable={false} placeholder='Name' value={selectedDoctor.doctor.name} onChangeText={setName}/>

                        <Text style ={styles.textInput}>Specialization</Text>
                        <TextInput style={styles.input}  editable={false}  placeholder='Specialization' value={selectedDoctor.doctor.specialization} onChangeText={setSpecialization}/>

                        <Text style ={styles.textInput}>Day</Text>
                        <TextInput style={styles.input} placeholder='Day' value={day} onChangeText={setDay}/>

                        <View style={{flexDirection:'row'}}>

                        <Text style ={styles.textInput}>From</Text>
                        <TextInput style={styles.input_stime} placeholder='Time' value={from_time} onChangeText={setFrom_time}/>

                        <Text style ={styles.textInput}>To</Text>
                        <TextInput style={styles.input_stime} placeholder='Time' value={to_time} onChangeText={setTo_time}/>

                        </View>
                        <View style={{marginTop:30}}>
                            <Button title='Add' color='grey' onPress={handleAddSchedule}/>
                        </View>
                        <View style={{marginTop:20}}>
                            <Button title='back' color='grey' onPress={()=>setSelectedDoctor(null)}/>
                        </View>
                    </View>

                    </ScrollView>
                    }
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
                    <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center', marginLeft:'auto', padding:15}} onPress={()=>setEditIsVisible(false)}>
                        <MaterialCommunityIcons name="close" size={25} color={'white'}   />
                    </Pressable>
                    <View style={styles.modalTitleContainer}>
                        <Text style={styles.modalTitle}>Edit Schedule</Text>
                    </View>

                    <ScrollView>

                    <View style={styles.formContainer}>
                        <Text style ={styles.textInput}>Name</Text>
                        <TextInput style={styles.input} editable={false} placeholder='Name' value={name} onChangeText={setName}/>


                        <Text style ={styles.textInput}>Specialization</Text>
                        <TextInput style={styles.input} placeholder='Specialization' value={specialization} onChangeText={setSpecialization}/>

                        <Text style ={styles.textInput}>Day</Text>
                        <TextInput style={styles.input} placeholder='Day' value={day} onChangeText={setDay} />

                        <View style={{flexDirection:'row'}}>

                        <Text style ={styles.textInput}>From</Text>
                        <TextInput style={styles.input_stime} placeholder='Time' value={from_time} onChangeText={setFrom_time}/>

                        <Text style ={styles.textInput}>To</Text>
                        <TextInput style={styles.input_stime} placeholder='Time' value={to_time} onChangeText={setTo_time}/>

                        </View>

                        <View style={{marginTop:50}}>
                            <Button title='SAVE' color='grey' onPress={handleUpdateSchedule}/>
                        </View>
                        
                    </View>

                </ScrollView>
                </View>
            </Modal>
           
        </ImageBackground>
        
     );
}

export default CreateSchedule;

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
    doctor_card: {
       marginTop: 20,
       marginHorizontal: 50,
       height: 175,
       backgroundColor:'#035E73',
       borderRadius: 10,
       paddingLeft: 15,
    },
    doctor_details: {
        marginTop: 10,
        // marginLeft: 20,
        color: 'white',
        fontSize: 18,
        fontWeight: 400,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    sub_details: {    
        fontSize:15,
        marginBottom:4,
        fontWeight: 500,
        color: 'white',

    },
    docBtn:{
        borderBottomWidth:1,
        borderColor:'white',
        width:200,
        justifyContent:'center',
        alignItems:'center',
        padding:20
    },
    action_btns:{
        marginLeft:190,
        flexDirection: 'row',
        
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
        alignItems:'center',
        marginBottom:25
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
    textInput: {
        marginBottom: 10,
        fontWeight: '500',
        color:'white',
        fontSize:18
    },
    formContainer:{
        marginVertical:25,
        marginHorizontal:25,
    },
    input_stime: {
        marginLeft:10,
        width: 60,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
  });