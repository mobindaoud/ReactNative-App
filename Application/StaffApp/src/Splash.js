
 import React,{Component} from 'react';
 import {StyleSheet,View,Text,Dimensions,Image,ActivityIndicator,TextInput} from 'react-native';
 import LinearGradient from 'react-native-linear-gradient';
 import {createStackNavigator} from 'react-navigation-stack';
 import {createAppContainer,NavigationActions,StackActions} from 'react-navigation';
 import Modal, { ModalFooter, ModalButton, ModalContent  } from 'react-native-modals';
 import AsyncStorage from '@react-native-community/async-storage';

 export default class Splash extends Component{
	
	componentDidMount()
	 {
		   this.detectLogin()
	 }
	 nav(){
		setTimeout(()=>{this.props.navigation.navigate('SelectionScreen');},0)		
	}
	constructor(props)
	{
		super(props);
		this.state = {
			visibleModal:false,
			username:'',
			password:'',
			loadingNav:false,
			loading1:true,
			loadingforSignin:false,		
		};
		this.detectLogin = this.detectLogin.bind(this);
		this.BackEndSendSignin = this.BackEndSendSignin.bind(this);
	}
	async BackEndSendSignin(email,password){
		try{
		console.log(email,password);

		fetch("http://192.168.10.5:3001/signin",
			{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     },
		     body:JSON.stringify({
				"email":email,
				"password":password,
			})
		 }).then(res => res.json()).then(users=>{
			 if(users.id == 0)
			 {
				 alert("fields are empty")
			 }else if(users.id == 1)
			 {
				 alert("no user exit")

			 }else if(users.id == 2)
			 {
				 alert("wrong password")
				 
			 }else if(users.id == 3)
			 {
				 console.log("id matched")
				 this.setState({visibleModal:false})
				AsyncStorage.setItem('email',this.state.username).then(()=>{
						this.setState({username:'',password:'',visibleModal:false})
					})
					this.nav()
			 }
			 
		 }).catch((error)=>console.log(error));

		}catch{(error)=>alert("Sign In",error.message)}						
  }
	 	async detectLogin(){
    const token = await AsyncStorage.getItem('email');
        if(token){
			this.setState({loadingNav:true,loading1:false});

		}else{
			this.setState({loadingNav:false,loading1:false});
			setTimeout(()=>{this.setState({visibleModal:true});},600);
        
		}
	}

	render(){
		 return(
			this.state.loading1?<View style={{
    flex:1,
    justifyContent:"center",
    alignItems:"center" ,
	...StyleSheet.absoluteFill,
	backgroundColor:'transparent'	
			}}> 
				<ActivityIndicator size="large" color="blue" />
		   </View>:
		 this.state.loadingNav?<View>{this.nav()}</View>:
			<LinearGradient colors={['#90ee90','#ffffff']} style={styles.box}>
				<View  style={{justifyContent:'center',alignItems:'center',borderRadius:55,marginTop:100,marginBottom:30,borderRadius:30}}>
					<Image source = {require('./images/GarbageMan.png')}/>
				</View>

				<View style={{
			justifyContent:'center',		
			borderBottomWidth:3,
			borderBottomColor:'lightgrey',
			marginLeft:(DeviceWidth/6),
			width:(DeviceWidth/1.5),
			borderStyle:'dotted'}}>	
				</View>

				<View>
					<Text style = {styles.tex1}>
						Grabage Collector's
					</Text>
				</View>
			
				<View style={{
			justifyContent:'center',		
			borderBottomWidth:3,
			borderBottomColor:'lightgrey',
			marginLeft:(DeviceWidth/6),
			width:(DeviceWidth/1.5),
			borderStyle:'dotted',
			marginTop:100
			
			}}>	
				</View>
			
				
				<View style = {{flexDirection:'row',marginTop:DeviceHeight/4,marginLeft:DeviceWidth/10}}>

				<View  style={{borderRadius:55}}>
					<Image source = {require('./images/garbageSystem.png')}/>
				</View>
	
					<Text style = {{...styles.tex,marginTop:25,marginLeft:10}}>
						Smart Trash Collection System
					</Text>
				</View>

				
				
			  <Modal
				visible={this.state.visibleModal}
				footer={
				  <ModalFooter>
					<ModalButton
					  text="OK"
					  onPress={() => {
							this.BackEndSendSignin(this.state.username,this.state.password);
						  }}
					/>
				  </ModalFooter>
				}				
								
			  >
				<ModalContent>
				{
					<>

					<View style = {{flexDirection:'row',marginBottom:10}}>
						<View style = {{marginTop:15}}><Text>Username:</Text></View>
						<View>
							<TextInput onChangeText={(text)=>this.setState({username:text})} value={this.state.username} 
								style={{marginLeft:60,borderStyle: 'dotted',borderRadius:55,borderColor:'black',borderWidth:1,width:200}}
								placeholderTextColor="black" >
							</TextInput>
						</View>
					</View>
					<View style = {{flexDirection:'row',marginBottom:10}}>
						<View style = {{marginTop:15}}><Text>Password:</Text></View>
						<View>
							<TextInput onChangeText={(text)=>this.setState({password:text})} value={this.state.password} 
								secureTextEntry={true} style={{marginLeft:60,borderStyle: 'dotted',borderRadius:55,borderColor:'black',borderWidth:1,width:200}}
								placeholderTextColor="black" >
							</TextInput>
						</View>
					</View>


					
					</>
				}
				</ModalContent>
			  </Modal>								
			
			
			
			
			
			</LinearGradient>

			
			
			
			
			
		 );
			
	 }
 }
 
const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;


 const styles = StyleSheet.create({
	    box:
		{
			flex:1,
		},
		tex:
		{
			textAlign: 'center',
			fontSize: 15 ,
			fontWeight: 'bold',
			color:'green',
		},
		tex1:
		{
			textAlign: 'center',
			fontSize: 35 ,
			fontWeight: 'bold',
			color:'green',
			fontStyle:'italic',
			marginTop:70			
		},
		line:
		{
			borderBottomWidth:3,
			borderBottomColor:'grey',
			marginLeft:(DeviceWidth/6),
			width:(DeviceWidth/1.5),
			borderStyle:'dotted'
			
		}

 });
