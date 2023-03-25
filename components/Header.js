import { View, Text, StyleSheet, Image, Pressable, Modal, Button, TouchableOpacity } from "react-native";
import React,{useEffect, useState} from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

function Header( props ) {

    const navigation = useNavigation();

    const[isVisible, setIsVisible] = useState(false)


    const[role, setRole] = useState(null);
    // const [isLogged, setIsLogged] = useState();

    useEffect(()=>{
        readAsyncStorage();
        
    },[])

    async function readAsyncStorage() {
        setRole(await AsyncStorage.getItem('role'));
        let isLogged = await AsyncStorage.getItem('isLogged');
        if(isLogged != 'true'){
            navigation.navigate('LoginScreen');
        }
    }


    function profileHandler(){
        if(role == 0){
            setIsVisible(false);
            navigation.navigate('AdminProfileScreen');
        } else if (role == 1){

        } else if (role == 2){

        }else if (role == 3){

        }
    }

    return ( 
        <View style={styles.container}>
            
            <Pressable android_ripple={{color:'#333333'}} style={{justifyContent: 'center',paddingHorizontal:15}} onPress={() => props.navigation.goBack(null)} >
                <MaterialCommunityIcons name="arrow-left" size={26} color={'white'}   />
            </Pressable>

            <View style={{justifyContent: 'center',}} >
                <Text style={styles.title}>{props.title}</Text>
            </View>

            <Pressable android_ripple={{color:'#e3e3e3'}} style={{justifyContent: 'center',paddingHorizontal:15}} onPress={()=>setIsVisible(true)} >
                <MaterialCommunityIcons name="dots-vertical" size={26} color={'white'}   />
            </Pressable>
          
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
                    <View style={{justifyContent: 'center', alignItems:'center'}}>
                        <TouchableOpacity style={styles.customBtn} onPress={profileHandler}>
                            <Text style={{color:'white', fontSize:18}} >View Profile</Text> 
                        </TouchableOpacity>
                        {role == 3 &&
                        <TouchableOpacity style={styles.customBtn} onPress={()=>{setIsVisible(false); navigation.navigate('PatientPrescription')}}>
                            <Text style={{color:'white', fontSize:18}} >My Prescriptions</Text> 
                        </TouchableOpacity>
                        }
                        <TouchableOpacity style={styles.customBtn} onPress={()=>{setIsVisible(false);navigation.navigate('LoginScreen'); AsyncStorage.clear()}}>
                            <Text style={{color:'white', fontSize:18}} >Logout</Text> 
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            

        </View>
        
     );
}

export default Header;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#003d4d',
        flex:0.1,
        flexDirection:'row', 
        justifyContent:'space-between',
        elevation:1

    },
    image:{
        width:30,
        height:30,
        color:'white',
        margin:10,
        tintColor:'white'
    },
    title:{
        color:'white',
        textAlign:"center",
        fontSize:20
    },
    imageDot:{
        width:30,
        height:30,
        color:'white',
        margin:10,
        tintColor:'white',
        textAlign: 'right'
    },
    modalContainer:{
        backgroundColor:'#003d4d',
        flex:0.4,
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
    }
});