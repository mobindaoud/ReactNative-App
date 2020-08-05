import React,{Component} from 'react';
import {View,Button,Text,TouchableOpacity,Alert,Image,Dimensions,ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

export default class SelectionScreen extends Component{	
	
	
	render(){
		return(
			<LinearGradient colors={['#CFFFE5','#ffffff']} style={{flex:1}}>
				<View style={{flexDirection:'row'}}>
					<Text style={{marginTop:25,marginBottom:25,color:'green',fontSize:30,fontWeight:'bold',fontStyle:'italic',textDecorationLine: 'underline'}}>
						Options:
					</Text>
					<View style={{position: 'absolute', right: 0,marginTop:25,marginRight:25}}>
						<TouchableOpacity onPress={()=>{
						Alert.alert('Logging out','Do you want to Logout?',
						[{text:'No'},{text:'Yes',onPress:async()=>{
							await AsyncStorage.removeItem('email').then(()=>{
								this.props.navigation.navigate('Splash')
								}).catch((error)=>console.log(error))
							
						}}],
						{cancelable:false})						
						}}>
							<Image source = {require('./images/crossexit.png')} style={{width:50,height:50}}/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{marginLeft:DeviceWidth/20,justifyContent:'center',alignItems:'center'}}>
				<View style={{backgroundColor:'white',
					borderRadius:10,
					alignItems:'center',
					justifyContent:'center',
					shadowOffset:{width:2,height:2},
					shadowColor:'black',
					marginBottom:10,
					shadowOpacity:0.5,width:300,shadowRadius:16,elevation:5
						}}>
					<TouchableOpacity onPress= {()=>this.props.navigation.navigate('App')} >
						<Image source = {require('./images/GetRoute.png')} style={{width:280,height:150,marginTop:10}}/>
						<Text style={{padding:10,fontSize:20,color:'grey',fontWeight:'bold',fontStyle:'italic'}}>
							Start your Route Journey
						</Text>
					</TouchableOpacity>
				</View>
				<View style={{backgroundColor:'white',
					borderRadius:10,
					alignItems:'center',
					justifyContent:'center',
					shadowOffset:{width:2,height:2},
					shadowColor:'black',
					marginBottom:10,
					shadowOpacity:0.5,width:300,shadowRadius:16,elevation:5
						}}>
					<TouchableOpacity onPress= {()=>this.props.navigation.navigate('InstalationScreen')}>
						<Image source = {require('./images/install.png')} style={{width:280,height:150,marginTop:10}}/>
						<Text style={{padding:10,fontSize:20,color:'grey',fontWeight:'bold',fontStyle:'italic'}}>

							Install a bin
						</Text>
					</TouchableOpacity>
				</View>

				<View style={{backgroundColor:'white',
					borderRadius:10,
					alignItems:'center',
					justifyContent:'center',
					shadowOffset:{width:2,height:2},
					shadowColor:'black',
					marginBottom:10,
					shadowOpacity:0.5,width:300,shadowRadius:16,elevation:5
						}}>
					<TouchableOpacity onPress= {()=>this.props.navigation.navigate('BillingScreen')}>
						<Image source = {require('./images/billing.png')} style={{width:280,height:150,marginTop:10}}/>
						<Text style={{padding:10,fontSize:20,color:'grey',fontWeight:'bold',fontStyle:'italic'}}>
							Get money from client
						</Text>
					</TouchableOpacity>
				</View>
				</View>
			</LinearGradient>		
		);

	}	
} 
const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;
