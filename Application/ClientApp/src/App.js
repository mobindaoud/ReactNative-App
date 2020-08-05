 import React,{Component} from 'react';
 import {ActivityIndicator,Animated,StyleSheet,View,Text,Dimensions,Image,TouchableOpacity,TextInput,TouchableNativeFeedback,Keyboard} from 'react-native';
 import AsyncStorage from '@react-native-community/async-storage';
 import {createAppContainer,createSwitchNavigator} from 'react-navigation';
 import MainScreen from './MainScreen.js';
 export default class App extends Component{
	
	constructor(){
		super();
		this.state = {			
			signinOpacity: new Value(1),
			forgetPassword: new Value(1),
			
			signin:false,
			fgtPassword:false,
			
			email:'',
			password:'',
			address:'',
			name:'',
			cellphone:'',
			
			forgetEmail:'',
			code:null,
			newPassword:'',
			matchPassword:'',
			codeEditable:false,
			passwordEditable:false,
			emailEditable:true,
			resetCellphone:null,
			navCheck:false,
			navCheckSignin:false,
			
			loadingNav:false,
			loading1:true,
			loadingforSignin:false,
			loadingforVerfication:false,
			loadingforCode:false,
			loadingforPass:false
		};
		this.BackEndSendSignin = this.BackEndSendSignin.bind(this);			
		this.Verification = this.Verification.bind(this);
		this.VerificationCode = this.VerificationCode.bind(this);
		this.update=this.update.bind(this);
		
		this.detectLogin = this.detectLogin.bind(this);
		this.nav = this.nav.bind(this);

		this.buttonY= this.state.signinOpacity.interpolate({inputRange:[0,1],outputRange:[100,0],extrapolate:'clamp'});
		this.bgY = this.state.signinOpacity.interpolate({inputRange:[0,1],outputRange:[-DeviceHeight/3,0],extrapolate:'clamp'});

		this.fadeY = this.state.signinOpacity.interpolate({inputRange:[0,1],outputRange:[0,100],extrapolate:'clamp'});
		this.fadeZindex = this.state.signinOpacity.interpolate({inputRange:[0,1],outputRange:[1,-1],extrapolate:'clamp'});
		this.fadeOpacity = this.state.signinOpacity.interpolate({inputRange:[0,1],outputRange:[1,0],extrapolate:'clamp'});

		this.buttonY1= this.state.forgetPassword.interpolate({inputRange:[0,1],outputRange:[100,0],extrapolate:'clamp'});
		this.bgY1 = this.state.forgetPassword.interpolate({inputRange:[0,1],outputRange:[-DeviceHeight/1.8,0],extrapolate:'clamp'});

		this.fadeY1 = this.state.forgetPassword.interpolate({inputRange:[0,1],outputRange:[0,100],extrapolate:'clamp'});
		this.fadeZindex1 = this.state.forgetPassword.interpolate({inputRange:[0,1],outputRange:[1,-1],extrapolate:'clamp'});
		this.fadeOpacity1 = this.state.forgetPassword.interpolate({inputRange:[0,1],outputRange:[1,0],extrapolate:'clamp'});
		
		this.siginload = this.siginload.bind(this);

	}
		siginload(){
	  this.setState({loadingforSignin:false})	
	}
		loadingforVerfication(){
	  this.setState({loadingforVerfication:true})	
	}
		loadingforCode(){
	  this.setState({loadingforCode:true})	
	}
		loadingforPass(){
	  this.setState({loadingforPass:true})	
	}

	
	async update(email,password){
		try
		{
			const response = await fetch("http://192.168.10.5:3000/updating",
			{
				 method:"POST",
				 headers: {
				'Content-Type': 'application/json'
				 },
				 body:JSON.stringify({
					"email":email,
					"password":password,
				})
			}).then(res=>res.json()).then(data=> {
				console.log(data)
				if(data.nModified == 1)
				{
					AsyncStorage.setItem('email',this.state.forgetEmail).then(()=>{
						this.props.navigation.navigate("MainScreen");
						this.setState({email:'',password:'',loadingforPass:false,loadingforCode:false,loadingforVerfication:false,newPassword:'',matchPassword:'',code:null,forgetEmail:'',codeEditable:false,emailEditable:true,passwordEditable:false})
					})

				}else{
					this.setState({navCheckSignin:false})
				}
				});
			
		}catch(error){
			console.log(error)
			alert("Error updating",error.message);
		}	
	}

	
	Verification(email){
		fetch("http://192.168.10.5:3000/ForgetPassword",
			{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     },
		     body:JSON.stringify({
				"email":email
				})
			}).then(res => res.json()).then((response)=>{
				if(response.status == 200)
				{			
					this.setState({codeEditable:true,loadingforVerfication:false,emailEditable:false,resetCellphone:response.cellphone})
				}
				
				
			}).catch((err)=>console.log(err));	
	}

	VerificationCode(code,cellphone){
		fetch("http://192.168.10.5:3000/VerifyCode",
			{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     },
		     body:JSON.stringify({
				"code":code,
				"cellphone":this.state.resetCellphone
				})
			}).then(res => res.json()).then((response)=>{
				console.log(response)
				if(response == 'approved')
				{			
					this.setState({codeEditable:false,loadingforCode:false,emailEditable:false,passwordEditable:true})
				}
				
				
			}).catch((err)=>console.log(err));	
	}


	async detectLogin(){
    const token = await AsyncStorage.getItem('email');
        if(token){
			this.setState({loadingNav:true,loading1:false});
        }else{
			this.setState({loadingNav:false,loading1:false});
        }
	}
	nav(){
		setTimeout(()=>{this.props.navigation.navigate('MainScreen');},0)		
	}
	async BackEndSendSignin(email,password){
		try{
		console.log(email,password);

		let response = await fetch("http://192.168.10.5:3000/signin",
			{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     },
		     body:JSON.stringify({
				"email":email,
				"password":password,
			})
		 }).catch((error)=>console.log(error));

		 console.log(response)
		if(response.ok)
		{
			await AsyncStorage.setItem('email',email)
		   this.setState({navCheckSignin:true,email:'',password:''})

        }else{
			this.setState({navCheckSignin:false})
		}
		}catch{(error)=>alert("Sign In",error.message)}						
  }
	componentDidMount(){
	  this.detectLogin()
	}
	render(){
		 return(		 
		   
		   this.state.loading1?<View style={styles.loading}> 
				<ActivityIndicator size="large" color="blue" />
		   </View>:
		 !this.state.loadingNav?
		 <View style={{flex:1,justifyContent:'flex-end',backgroundColor:'transparent`'}}>
				<Animated.View style={this.state.fgtPassword?{...StyleSheet.absoluteFill,transform:[{translateY:this.bgY1}]}:{...StyleSheet.absoluteFill,transform:[{translateY:this.bgY}]}}>
				<Image source={require('./images/binTrash.png')} style={{flex:1,height:null,width:null}}/>
				<Image source={require('./images/FrontTrash.png')} style={{marginLeft:DeviceWidth/4.5,top:(DeviceHeight/12),position:'absolute'}}/>

				</Animated.View>

				<View style={{height:DeviceHeight/4.15,justifyContent:'center'}}>
					
					<TouchableOpacity onPress={()=>{
					this.setState({fgtPassword:false})
					Animated.timing(this.state.signinOpacity,{
							toValue:0,
							duration:600
						}).start();
					}}>
						<Animated.View style={{...styles.button1,backgroundColor:'lightgreen',opacity:((this.state.fgtPassword)?this.state.forgetPassword:this.state.signinOpacity),transform:[{translateY:(this.state.fgtPassword)?this.buttonY1:this.buttonY}]}}>
							<Text style={{fontSize:26,fontStyle:'italic',fontWeight:'bold',color:'white'}}>Sign In </Text>							
						</Animated.View>
				
					</TouchableOpacity>

					<TouchableOpacity onPress={()=>{
						this.setState({fgtPassword:true})
						Animated.timing(this.state.forgetPassword,{
							toValue:0,
							duration:600
						}).start();
					}}>
						<Animated.View style={{...styles.button1,backgroundColor:'#24A0ED',opacity:((this.state.fgtPassword)?this.state.forgetPassword:this.state.signinOpacity),transform:[{translateY:(this.state.fgtPassword)?this.buttonY1:this.buttonY}]}}>
							<Text style={{fontSize:20,color:'white',textDecorationLine: 'underline',fontWeight:'bold'}}>Forget Password </Text>							
						</Animated.View>
				
					</TouchableOpacity>
					
					
					<TouchableNativeFeedback onPress={()=>{
						Keyboard.dismiss();
						if(!this.state.fgtPassword)
						{Animated.timing(
						this.state.signinOpacity,
						{
							toValue:1,
							duration:500
						}).start()
						}else{
						Animated.timing(
						this.state.forgetPassword,
						{
							toValue:1,
							duration:500
						}).start()
													
						}
						this.setState({loadingforPass:false,loadingforCode:false,loadingforVerfication:false,email:'',password:'',newPassword:'',matchPassword:'',code:null,forgetEmail:'',codeEditable:false,emailEditable:true,passwordEditable:false})
					}}>
						<Animated.View style={{...styles.closeButton,transform:[{translateY:((this.state.fgtPassword)?this.fadeY1:this.fadeY)}],zIndex:((this.state.fgtPassword)?this.fadeZindex1:this.fadeZindex),opacity:((this.state.fgtPassword)?this.fadeOpacity1:this.fadeOpacity),
						top:(this.state.fgtPassword)?-DeviceHeight/1.86:-DeviceHeight/3.2}}>
							<Text style={{fontSize:20,fontWeight:'bold'}}>X</Text>
						</Animated.View>
					</TouchableNativeFeedback>
				
				{	this.state.loadingforSignin&&<View style={styles.loading}> 
														<ActivityIndicator size="large" color="blue" />
													</View>

				}
				{	this.state.loadingforVerfication&&<View style={{...styles.loading,position:'absolute',zIndex:5,flex:1}}> 
				
														<ActivityIndicator size="large" color="blue" />
													</View>
				}
				{	this.state.loadingforCode&&<View style={{...styles.loading,position:'absolute',zIndex:5,flex:1}}> 
														<ActivityIndicator size="large" color="blue" />
									</View>
				}
				{	this.state.loadingforPass&&<View style={{...styles.loading,position:'absolute',zIndex:5,flex:1}}> 
														<ActivityIndicator size="large" color="blue" />
													</View>
				}

				{
					!(this.state.fgtPassword)?<Animated.View style={{height:DeviceHeight/3.2,...StyleSheet.absoluteFill,top:null,
					zIndex:this.fadeZindex,
					opacity:this.fadeOpacity,
					justifyContent:'center',
					transform:[{translateY:this.fadeY}]
					}}>
							
							<TextInput onChangeText={(text)=>this.setState({email:text})} value={this.state.email} placeholder="username" style={styles.textinput} placeholderTextColor="black"/>
							<TextInput secureTextEntry={true} onChangeText={(text)=>this.setState({password:text})} value={this.state.password} placeholder="password" style={styles.textinput} placeholderTextColor="black"/>
						
							<TouchableOpacity onPress={()=>{
								this.setState({loadingforSignin:true})
								this.BackEndSendSignin(this.state.email,this.state.password).then(()=>
								{
									this.siginload();
									(this.state.navCheckSignin == true)?this.props.navigation.navigate('MainScreen'):alert("recheck form")
								}
								)}}>			
								<Animated.View style={{...styles.button2,opacity:this.fadeOpacity,transform:[{translateY:this.fadeY}]}}>
									<Text style={{fontSize:20,fontWeight:'bold',color:'white'}}>Sign In </Text>
								</Animated.View>
							</TouchableOpacity>					
					</Animated.View>
					:<Animated.View style={{height:DeviceHeight/1.8,...StyleSheet.absoluteFill,top:null,
					zIndex:this.fadeZindex1,
					opacity:this.fadeOpacity1,justifyContent:'center',
					transform:[{translateY:this.fadeY1}]}}>
							
					<TextInput editable={this.state.emailEditable} onChangeText={(text)=>this.setState({forgetEmail:text})} value={this.state.forgetEmail} placeholder="email" style={this.state.emailEditable?{...styles.textinput}:{...styles.textinput,backgroundColor:'lightgrey'}} placeholderTextColor={(this.state.emailEditable)?"black":"grey"}/>
					<TextInput editable={this.state.codeEditable} keyboardType="numeric" onChangeText={(text)=>this.setState({code:text})} value={this.state.code} placeholder="code" style={this.state.codeEditable?{...styles.textinput}:{...styles.textinput,backgroundColor:'lightgrey'}} placeholderTextColor={(this.state.codeEditable)?"black":"grey"}/>
					<TextInput secureTextEntry={true} editable={this.state.passwordEditable} onChangeText={(text)=>this.setState({newPassword:text})} value={this.state.newPassword} placeholder="Password" style={this.state.passwordEditable?{...styles.textinput}:{...styles.textinput,backgroundColor:'lightgrey'}} placeholderTextColor={(this.state.passwordEditable)?"black":"grey"}/>
					<TextInput secureTextEntry={true} editable={this.state.passwordEditable} onChangeText={(text)=>this.setState({matchPassword:text})} value={this.state.matchPassword} placeholder="Confirm Password" style={this.state.passwordEditable?{...styles.textinput}:{...styles.textinput,backgroundColor:'lightgrey'}} placeholderTextColor={(this.state.passwordEditable)?"black":"grey"}/>

					<TouchableOpacity onPress={()=>{
						if( this.state.codeEditable != true && this.state.forgetEmail.length > 0)
						{
							this.loadingforVerfication();
							this.Verification(this.state.forgetEmail);
						}else 
							if(this.state.codeEditable)
							{
								this.setState({emailEditable:false});
							}
						}}>			
						{
							(this.state.codeEditable != true && this.state.passwordEditable != true)&&<Animated.View style={{...styles.button2,opacity:this.fadeOpacity1,transform:[{translateY:this.fadeY1}]}}>
									<Text style={{fontSize:20,fontWeight:'bold',color:'white'}}>Get Code</Text>
								</Animated.View>
						}		
							</TouchableOpacity>
							
							{
								(this.state.codeEditable == true && this.state.passwordEditable == false)&&<TouchableOpacity onPress={()=>{
									this.loadingforCode();
									this.VerificationCode(this.state.code,this.state.resetCellphone)}}>			
								<Animated.View style={{...styles.button2,opacity:this.fadeOpacity1,transform:[{translateY:this.fadeY1}]}}>
									<Text style={{fontSize:20,fontWeight:'bold',color:'white'}}>Verification</Text>
								</Animated.View>							
							
								</TouchableOpacity>
							}
							{
								(this.state.codeEditable == false && this.state.passwordEditable == true)&&<TouchableOpacity onPress={()=>{
									if(this.state.newPassword == this.state.matchPassword)
									{
										this.loadingforPass();
				
										this.update(this.state.forgetEmail,this.state.newPassword)
									}
									else
										alert("Password Not Matched")
									}}>			
								<Animated.View style={{...styles.button2,opacity:this.fadeOpacity1,transform:[{translateY:this.fadeY1}]}}>
									<Text style={{fontSize:20,fontWeight:'bold',color:'white'}}>Change Password</Text>
								</Animated.View>							
							
								</TouchableOpacity>
							}
							
							
					</Animated.View>
				}
				</View>

			</View>:<View>{this.nav()}</View>


			
		 );
			
	 }
 }

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;
const {Value,interpolate} = Animated;
let numb= ''
 const styles = StyleSheet.create({
    loading:{
    flex:1,
    justifyContent:"center",
    alignItems:"center" ,
	...StyleSheet.absoluteFill,
	backgroundColor:'transparent'
    },
	container:{
		flex:1,
		alignItems:'center',
		justifyContent:'center'
		
	},
	button1:{
		backgroundColor:'white',
		height:70,
		marginHorizontal:20,
		marginVertical:5,
		borderRadius:35,
		alignItems:'center',
		justifyContent:'center',
		shadowOffset:{width:2,height:2},
		shadowColor:'black',
		shadowOpacity:0.5
		
	},
	button2:{
		backgroundColor:'lightgreen',
		height:70,
		marginHorizontal:20,
		marginVertical:5,
		borderRadius:35,
		alignItems:'center',
		justifyContent:'center',
		shadowOffset:{width:2,height:2},
		shadowColor:'black',
		shadowOpacity:0.5
		
		
	},
	textinput:{
		height:70,
		borderRadius:25,
		borderWidth:0.5,
		marginHorizontal:20,
		paddingLeft:10,
		marginVertical:5,
		borderColor:'rgba(0,0,0,0.2)',
		marginBottom:10
	},
	closeButton:{
		backgroundColor:'white',
		height:40,
		borderRadius:20,
		alignItems:'center',
		justifyContent:'center',
     	width:40,
		left:DeviceWidth/2 - 20,
		shadowOffset:{width:2,height:2},
		shadowColor:'black',
		shadowOpacity:0.5
				
	}
	
 });
