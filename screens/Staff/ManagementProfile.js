import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React,{useEffect, useState} from "react";
import Header from "../components/Header";
import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native";
import { TextInput } from "react-native";

function ManagementProfile({navigation}) {


    useEffect(() => {
        
    }, [] );


    return ( 
        <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>

            {/* Add Screen Title */}
            <Header title={"Profile"} navigation={navigation} />

            <View style={{flex:0.9}}>

                <View style={styles.profile_card}>

                    <Text style={styles.profile_heading}>Akila Perera</Text>

                  <View style={styles.profile_details}>
                    
                    <Text style={styles.sub_details}>Name :  Akila Perera</Text>

                    <Text style={styles.sub_details}>Employee Id :  EMP001</Text>

                    <Text style={styles.sub_details}>Email :  akila@gmail.com</Text>

                    <Text style={styles.sub_details}>Contact :  076497675</Text>

                    <Text style={styles.sub_details}>Address:  Galle Rd, Colombo</Text>

                 </View>

                </View>
          
               {/* Your Design */}


            </View>
           
        </ImageBackground>
        
     );
}

export default ManagementProfile;

const styles = StyleSheet.create({
    container: {
      backgroundColor:'#54C1FF',
      justifyContent:"center",
      alignItems:"center",
    },
    profile_card:{
        marginTop: 100,
        marginHorizontal: 30,
        width: 350,
        height: 400,
        backgroundColor: '#008b8b',
        borderRadius: 10,
    },
    profile_heading:{

        marginTop: 60,
        textAlign: "center",
        fontSize: 25,
        fontWeight: 500,
        color: 'white',
        marginBottom: 50,
        // paddingLeft: 70,
        
    },
    profile_details:{
        paddingLeft: 80,

    },
    sub_details: {
        fontSize: 18,
        color: 'white',
        marginBottom: 15,
        fontSize: 15,
    }
    

  });