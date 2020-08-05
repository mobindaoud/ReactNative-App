
 import React,{Component} from 'react';
 import {PermissionsAndroid,ActivityIndicator,Alert,StyleSheet,View,Text,Dimensions,Image,TouchableOpacity,Animated,TextInput,Linking,Platform,ScrollView,TouchableWithoutFeedback, Keyboard} from 'react-native';
 import {createStackNavigator} from 'react-navigation-stack';
 import {createAppContainer,NavigationActions,StackActions} from 'react-navigation';
 import PercentageCircle from 'react-native-percentage-circle';
 import {Table,Row,Col} from 'react-native-table-component';
 import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
 import AsyncStorage from '@react-native-community/async-storage';
 import PureChart from 'react-native-pure-chart';
 import {Button,Divider} from 'react-native-elements';
 import Netinfo from "@react-native-community/netinfo";
 import Icon from 'react-native-vector-icons/FontAwesome5';
 export default class MainScreen extends Component{
	constructor(){
		super();
		this.state = {
			buttonOpacity: new Animated.Value(1),
			UpdateOpacity: new Animated.Value(0),
			tableOpacity : new Animated.Value(0),
			counter:0,
			finalArray:[],
			email:'',
			password:'',
			address:'',
			name:'',
			CompanyNumber:'',
			cellphone:'',
			monthlypaid:0,
			urgentreq:0,
			binloading:true,
			labelforpercentage:[],
			valueforpercentage:[],
			combine:[],
			errorshow:'',
			tableCounter:0,
			switchanimation:1
			};
			this.RedirectToDialer = this.RedirectToDialer.bind(this);
			this.percentage1 = this.percentage1.bind(this);
			this.table = this.table.bind(this);
			this.update = this.update.bind(this);
			this.getdate = this.getdate.bind(this);
			this.UrgentRequest = this.UrgentRequest.bind(this);
			this.CompanySetting = this.CompanySetting.bind(this);
		}
	async table(){
		token = await AsyncStorage.getItem('email');		

		fetch("http://192.168.10.5:3000/table",
		{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     },
		     body:JSON.stringify({
				"email":token
			})
		 }).then(res => res.json()).then(users=>tabledata=users).then(()=> {
				console.log(tabledata.length)
				if(tabledata.length > 0)
				{
					for(let j =0;j<tabledata.length;j++)
					{
						tabledata[j] = [j,tabledata[j].date,this.state.monthlypaid,tabledata[j].paid,tabledata[j].remaining]
					}
					this.setState({finalArray:tabledata});

				}else{
					this.setState({finalArray:[]});

				}	
			}).catch((error)=>alert("Internet Not Connected",error.message));


	}
	
	async CompanySetting(){
		await fetch("http://192.168.10.5:3000/CompanySetting",
		{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     
		}
		}).then(res => res.json()).then(users=>{
			this.setState({monthlypaid:users.monthlypaid,urgentreq:users.urgentreq,CompanyNumber:users.CompanyNumber})
		 }
		 ).catch((error)=>alert("Internet Not Connected",error.message));


	}

	
	getdate(){
		var date = new Date().getDate(); //Current Date
		var month = new Date().getMonth()+1; //Current Month
		var year = new Date().getFullYear(); //Current Year
		var hours = new Date().getHours(); //Current Hours
		var min = new Date().getMinutes(); //Current Minutes
		var sec = new Date().getSeconds(); //Current Seconds
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours > 12 ? hours % 12:hours;
		hours  = hours == 0 ? 12 : hours;
		console.log("date",date.length)
		date = date.toString().length <= 1 ? '0'+date :date;
		month = month.toString().length <= 1? '0'+month :month;
		min = min.toString().length <= 1? '0'+min :min;
		sec = sec.toString().length <= 1 ? '0'+sec :sec;

		return {date:month + '/' + date + '/' + year ,time: hours + ':' + min + ':' + sec + ' ' +ampm,special:"UrgentReq"};
	}
		
	async UrgentRequest(){
		console.log(this.getdate())
		token = await AsyncStorage.getItem('email');	
		console.log("urgentRequestfunction",token);
		await fetch("http://192.168.10.5:3000/urgentRequest",
		{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     },
		     body:JSON.stringify({
				"email":token,
				"date":this.getdate()
				
			})
	}).then((err,res)=>
		{
			if(!(err))
			{
				console.log(res)
			}
			else
			{
				alert("Your Request have been send to company.");
				console.log(err);
			}
		})		

	}
	async percentage1(){
		token = await AsyncStorage.getItem('email');		
		await fetch("http://192.168.10.5:3000/bin",
		{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     },
		     body:JSON.stringify({
				"email":token
			})
		 }).then(res => res.json()).then(users=>{
			counter=users;
			 }).catch((error)=>{
				alert("Internet Not Connected",error.message)
				 this.setState({errorshow:error})
				 });
				 if(this.state.errorshow.length <= 0)
				 {
					if(counter.length > 0)
					{	
						var binId=[];
						var binStatus=[];
						var combine = [];
						if(counter.length > 1)
						{			
								this.setState({binloading:false})
								 
								counter.map((key,value)=>{
								binId.push(counter[value]["binId"]);
								binStatus.push(counter[value]["binStatus"]);
								combine.push({x:counter[value]["binId"],y:counter[value]["binStatus"]})
								}
								);
								if(JSON.stringify(binId) != JSON.stringify(this.state.labelforpercentage) || JSON.stringify(binStatus) != JSON.stringify(this.state.valueforpercentage))
								{
									this.setState({labelforpercentage:binId,valueforpercentage:binStatus,combine:combine,errorshow:''});
								}

						}else{
						if(counter[0]["binStatus"] != this.state.counter || counter[0]["binStatus"] == 0)
						{		
						
						this.setState({binloading:false})
							if(counter[0]["binStatus"] != this.state.counter)
							{
								this.setState({counter:counter[0]["binStatus"],checkedimage:true});
							}
						}
						}
					}	
				 }
			}
		
	async update(password,address,cellphone,name){
		if(!token)
			token = await AsyncStorage.getItem('email');					
		try
		{
			const response = await fetch("http://192.168.10.5:3000/updating",
			{
				 method:"POST",
				 headers: {
				'Content-Type': 'application/json'
				 },
				 body:JSON.stringify({
					"email":token,
					"password":password,
					"address":address,
					"cellphone":cellphone,
					"name":name
				})
			});
			alert("Update Succesfull");
		}catch(error){
			console.log(error)
			alert("Error updating",error.message);
		}	
	}
		RedirectToDialer(number){
		let phoneNumber = number;
		if(Platform.OS =='android')
		{
			phoneNumber = 'tel:'+number+'';
		console.log('android'+phoneNumber);
			}else{
			phoneNumber = 'telprompt:{'+number+'}';
				console.log('iphone'+phoneNumber);	
		}
		console.log(phoneNumber);
		Linking.openURL(phoneNumber);
		
	}
	componentDidMount(){
		timestop1 = setInterval(async()=>{
		netinfo = await Netinfo.fetch();

		console.log(netinfo)
			if(netinfo.isConnected && netinfo.isInternetReachable)
			{
			timeStop=setInterval(this.percentage1,3000);		
			this.table()
			this.CompanySetting()
			countnetinfo = 0
			clearInterval(timestop1)
			}else{
				if(countnetinfo == 0)
					alert("Internet Not Connected")
				countnetinfo++;
			}},3000
		);
	}
	render(){
		 return(
		
		<View style={{flex:1,backgroundColor:'transparent',marginTop:DeviceHeight/25,alignItems:'center'}}>	
			
			{/*Background Image*/}
			<Image source={require('./images/trash.png')} style ={{width:225,height:225}}/>
			
			{/* Separator*/}
			<View style={{ width:DeviceWidth/1.5, borderRadius: 1, borderWidth: 1, borderColor: 'red', borderStyle: 'dashed'}}/>
			
			{/* NavBar*/}			
			<View style={{flexDirection:'row',marginTop:10,zIndex:this.state.buttonOpacity<1?0:1}}>
				<TouchableOpacity onPress = {()=>{
							Keyboard.dismiss();

							Animated.parallel([
							Animated.timing(this.state.buttonOpacity,{
								toValue:1,
								duration:300
							}),
							Animated.timing(this.state.tableOpacity,{
								toValue:0,
								duration:300
							}),	
							Animated.timing(this.state.UpdateOpacity,{
								toValue:0,
								duration:300
						})]).start()
						this.setState({email:'',password:'',address:'',cellphone:'',name:''})
						
					}}>
							<View>
								<Image source={require('./images/homeEdit.png')}/>
								<Text style={{textAlign:'center',justifyContent:'center',color:'green',alignItems:'center',fontWeight:'bold',fontSize:15}}>	
									Home						
								</Text>
							</View>
					
				</TouchableOpacity>
				<TouchableOpacity onPress = {()=>{
							Keyboard.dismiss();

							Animated.parallel([
							Animated.timing(this.state.buttonOpacity,{
								toValue:0,
								duration:300
							}),
							Animated.timing(this.state.tableOpacity,{
								toValue:1,
								duration:300
							}),							
							Animated.timing(this.state.UpdateOpacity,{
								toValue:0,
								duration:300
							})]).start();					
							this.table();
						this.setState({email:'',password:'',address:'',cellphone:'',name:''})
							
					
				}}>
						<View>

							<Image source={require('./images/billingEdit.png')}/>

							<Text style={{textAlign:'center',justifyContent:'center',color:'green',alignItems:'center',fontWeight:'bold',fontSize:15}}>	
								Billing						
							</Text>
						</View>
				
				</TouchableOpacity>

				<TouchableOpacity onPress = {()=>{
							Keyboard.dismiss();

							Animated.parallel([
							Animated.timing(this.state.buttonOpacity,{
								toValue:0,
								duration:300
							}),
							Animated.timing(this.state.tableOpacity,{
								toValue:0,
								duration:300
							}),							
							Animated.timing(this.state.UpdateOpacity,{
								toValue:1,
								duration:300
							})]).start();					
							this.setState({email:'',password:'',address:'',cellphone:'',name:''})

							}
							
							}>
						<View>

							<Image source={require('./images/profileEdit.png')}/>

							<Text style={{textAlign:'center',justifyContent:'center',color:'green',alignItems:'center',fontWeight:'bold',fontSize:15}}>	
								Update						
							</Text>
						</View>
				
				</TouchableOpacity>
				<TouchableOpacity onPress = {()=>{
							Keyboard.dismiss();
						this.setState({email:'',password:'',address:'',cellphone:'',name:''})

				Alert.alert('Logging out','Do you want to Logout?',
					[{text:'No'},{text:'Yes',onPress:async()=>{
						await AsyncStorage.removeItem('email').then(()=>{
							this.props.navigation.navigate('App');
							breaker = 0;
							clearInterval(timeStop);
							}).catch((error)=>console.log(error))
						
					}}],
					{cancelable:false})}}>
						<View>

							<Image source={require('./images/logoutEdit.png')}/>

							<Text style={{textAlign:'center',justifyContent:'center',color:'green',alignItems:'center',fontWeight:'bold',fontSize:15}}>	
								Log Out						
							</Text>
						</View>
				
				</TouchableOpacity>
				
			</View>
			<View style={{width:DeviceWidth/1.5,borderRadius: 1, borderWidth: 1, borderColor: 'red', marginTop:10,borderStyle: 'dashed',marginBottom:10}}/>

			<View style={{position:'relative',height:DeviceHeight/2}}>
			{/* BinStatus and Urgent Call*/}
				{<Animated.View style={{justifyContent:'center',width:DeviceWidth/1.15,marginTop:20,alignItems:'center',opacity:this.state.buttonOpacity,zIndex:this.state.buttonOpacity}}>
			{/* Separator*/}

				<View style={{flexDirection:'row'}}>
				
					<Text style={{fontWeight:'bold',color:'#99322b', textDecorationLine: 'underline',fontSize:20,marginTop:30,fontStyle: 'italic'}}>
							Bin Status:												
					</Text>
					<View style={{paddingLeft:10,paddingRight:10}}>
					</View>
					<View style={{width:DeviceWidth/2.5}}>															
							{
									!(counter.length>1)?<PercentageCircle key= {this.state.counter} radius={75} percent={this.state.counter} color={"green"} innerColor={'transparent'} textStyle={{fontSize:30,color:'white'}} style={{marginLeft:20}}>
									</PercentageCircle>:<PureChart key={this.state.combine} data={[{data:this.state.combine,color:'green'}]} type='bar' />
								
							}								
					</View>
				</View>
				<View style={{marginTop:DeviceHeight/20}}>
				</View>
				<View style = {{flexDirection:'row',alignItems:'center',marginLeft:10}}>
						<Button
						  title="Customer Care"
						  containerStyle={{borderRadius:30}}
						  buttonStyle={{backgroundColor:'green',padding:25}}
						  onPress={()=>this.RedirectToDialer(this.state.CompanyNumber)}
						/>
						<View style={{paddingLeft:10,paddingRight:10}}>
						</View>
						<Button
						  title="Urgent Request"
						  containerStyle={{borderRadius:30}}
						  buttonStyle={{backgroundColor:'red',padding:25}}
							onPress={()=>{Alert.alert(
							  'Warning',
							  'You will be charged RS '+this.state.urgentreq+'. per bin',
							  [
								{
								  text: 'Cancel',
								  onPress: () => console.log('Cancel Pressed'),
								  style: 'cancel',
								},
								{text: 'OK', onPress: () => this.UrgentRequest()},
							  ],
							  {cancelable: false},
							);}}
						
						/>
				</View>
				</Animated.View>
				}
				{
					(this.state.binloading)&&<View style={styles.loading}> 
							<ActivityIndicator size="large" color="blue" />
							</View>
				}

			{/* Update profile*/}
				{<Animated.View style={{alignItems:'center',justifyContent:'center',width:DeviceWidth/1.15,position:'absolute',height:DeviceHeight/2,zIndex:this.state.UpdateOpacity,opacity:this.state.UpdateOpacity}}>
				<KeyboardAwareScrollView enableOnAndroid={true} enableAutomaticScroll={true}>		
						<View  style={{flex: 1}}>
						<TextInput onChangeText={(text)=>{
									if(text.match(/^[A-Za-z_ ]+$/) || text =='')
									{
										if(text == '')
										{
											this.setState({name:text})
										}
										let finalText = text
										let finaltrim = text.trim()
										if(!finaltrim.length == 0)
										{
											text = text.trimStart()
											this.setState({name:text})			
										}
										
									}							
								
							}} value={this.state.name} placeholder="Full Name" style={{...styles.textinput}} placeholderTextColor="black"/>
							<TextInput onChangeText={(text)=>this.setState({address:text})} value={this.state.address} placeholder="Address" style={styles.textinput} placeholderTextColor="black"/>
							<TextInput secureTextEntry={true} onChangeText={(text)=>this.setState({password:text})} value={this.state.password} placeholder="Password" style={styles.textinput} placeholderTextColor="black"/>
							<TextInput secureTextEntry={true} onChangeText={(text)=>this.setState({email:text})} value={this.state.email} placeholder="Confirm Password" style={styles.textinput} placeholderTextColor="black"/>
							<TextInput  onChangeText={(number)=>{this.setState({cellphone:number})}} keyboardType="numeric"	value={this.state.cellphone}
							placeholder="Cellphone" style={styles.textinput} placeholderTextColor="black"/>

						<View style={{alignItems:'center'}}>
						<Button
						  title="Update"
						  containerStyle={{borderRadius:30,width:DeviceWidth/1.3}}
						  buttonStyle={{backgroundColor:'green',padding:15}}
						  onPress={()=>{
							  	(this.state.password.length ==0 && this.state.address.length ==0 
					&& this.state.cellphone.length ==0 && this.state.name.length ==0)?alert("Fields are Empty"):(this.state.password == this.state.email)?
					this.update(this.state.password,this.state.address,this.state.cellphone,this.state.name):alert("password not matched")
					
							  
						  }}
						/>

						</View>
						</View>
		</KeyboardAwareScrollView>

				</Animated.View>
				}
			
			{/* BillingTable*/}
				{<Animated.View style={{justifyContent:'center',alignItems:'center',position:'absolute',opacity:this.state.tableOpacity,zIndex:this.state.tableOpacity}}>
			
			<View style={{width:DeviceWidth/1.15,height:DeviceHeight/2}}>
				<ScrollView>
				<Table borderStyle={{borderWidth:2,borderColor:'green'}}>
					
				<Row data = {
					[
						'#','Date','Monthly','Paid',"Remaining"
					]
				} textStyle={{textAlign:'center',color:'#99322b'}}>	
				</Row>
				{
					this.state.finalArray.map((values,key)=>(
					<Row key={key} data = {
						values
					} textStyle={{textAlign:'center',color:'#696969'}}>	
					</Row>
					)
					)
				}
				</Table>
				</ScrollView>
				</View>

				</Animated.View>	
				}							
			</View>	
	</View>
		
		 );
	}
 }

 let tabledata= [];
 let counter=[];
 let timeStop;
 let timestop1;
 let netinfo;
 let token;
 let breaker = 0;
 let countnetinfo = 0;
 let tableCounterSecond=0;
 let tableCounterFirst=0;
 const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;
let isReady= false;
 const styles = StyleSheet.create({
	button2:{
		backgroundColor:'lightgreen',
		height:70,
		marginHorizontal:20,
		marginVertical:5,
		borderRadius:35,
		shadowOffset:{width:2,height:2},
		shadowColor:'black',
		shadowOpacity:0.5
		
		
	},
	textinput:{
		height:55,
		borderRadius:25,
		borderWidth:0.5,
		marginHorizontal:20,
		paddingLeft:10,
		marginVertical:5,
		borderColor:'rgba(0,0,0,0.2)',
		marginBottom:10,
		width:DeviceWidth/1.3
		
	},	 
	loading:{
    flex:1,
    justifyContent:"center",
    alignItems:"center" ,
	...StyleSheet.absoluteFill,
	backgroundColor:'transparent'
    }
	 
 });