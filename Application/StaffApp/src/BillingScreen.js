import React,{Component} from 'react';
import MapView from 'react-native-maps';
import {ActivityIndicator,StyleSheet,View,Text,Button,Image,TouchableOpacity,Dimensions,Alert,Platform,TextInput,BackHandler} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder-reborn';
import Modal, { ModalFooter, ModalButton, ModalContent  } from 'react-native-modals';
import SearchableDropdown from 'react-native-searchable-dropdown';

export default class BillingScreen extends Component{	
	constructor(props)
	{
		super(props);
		this.state = {
				rotate:false,
				mapReady:false,
				latitude:0,
				longitude:0,
				mapRegion:{
					latitude:31.634664128,
					longitude:74.351998592, 
					longitudeDelta:1,
					latitudeDelta:1
				},
				binName:'',
				binArray:[],
				visible:false,
				username:'',
				billingname:'',
				bin:[],
				name:'',
				latlng:[],
				tooltip:false,
				leftover:0
				

		};
		this.getInitialUserposition = this.getInitialUserposition.bind(this);
		//this.getUserName = this.getUserName.bind(this);
		this.StoreData = this.StoreData.bind(this);
		this.getdate = this.getdate.bind(this);
		this.address = this.address.bind(this);
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		this.mapmarkercallout = this.mapmarkercallout.bind(this);
	}

 	componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

		this.getInitialUserposition();
		this.addressinterval();

	}
  componentWillUnmount() {
       BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
   }
  handleBackButtonClick() {
       this.setState({visible:false})
   }		

	
	addressinterval(){
		id = setInterval(this.address,3000);
	}
	
	mapmarkercallout(){
		 if(this.mapmarker != undefined)
		 {
			this.mapmarker.showCallout()
    	 }else
			{
				setTimeout(this.mapmarkercallout,0)
			}
	}
	StoreData(date,remaining,paid,email,binId){
		try
		{
			let ename = email
			console.log(remaining)
			if(paid.length  !=0 && ename != undefined)
			{	
			const response = fetch("http://192.168.10.5:3001/updating",
			{
				 method:"POST",
				 headers: {
				'Content-Type': 'application/json'
				 },
				 body:JSON.stringify({
					"email":ename,
					"date":date,
					"paid":paid,
					"remaining":remaining
				})
			});
			Alert.alert('store','done');
			}
			else
			{
			Alert.alert('error','missing something');
				
			}
		}catch(error){
			console.log(error);
			alert("Error updating",error.message);
		}		
	}
	address(){

		fetch("http://192.168.10.5:3001/billingAddress",
		{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     }
		}).then(res => res.json()).then(users=>tabledata=users).then(()=> {
				console.log(tabledata)
				this.setState({latlng:tabledata,loader:false,tooltip:true});
			if(this.state.latlng.length > 0)
				{
					console.log(id,"clearing interval")
					clearInterval(id);			
				}else{
					console.log(id,"not interval")
					
				}
				
				
			}).catch((error)=>console.log(error));
	}
	/*
	getUserName(){
		fetch("https://driverserver.now.sh/allUserdata",
		{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     }
		 }).then(res => res.json()).then(users=>username=users).then(()=> {
			let tmp = [];
			let bindetail = [];
			username.map((value,key)=>{
				tmp.push({name:"Name= "+value.Name+"\nEmail= "+value.Email})
			})
			this.setState({username:tmp});
			}).catch((error)=>alert("Getting All Username",error.message));
	}
	*/
	getInitialUserposition()
	{
			geolocation.getCurrentPosition(
			(position) => {
				const latitude= position.coords.latitude;
				const longitude=position.coords.longitude; 
	
				this.setState(
				{
					latitude:latitude,
					longitude:longitude
				}
				);
			if(this.state.mapReady)
			{
				this.region = {
				latitude:this.state.latitude,
				longitude:this.state.longitude,
				latitudeDelta:0.005,
				longitudeDelta:0.005
					
			}
			this.map.animateToRegion(this.region,1000);
			}			
				},
				error => Geolocation.getCurrentPosition(
			(position) => {
				const latitude= position.coords.latitude;
				const longitude=position.coords.longitude; 
	
				this.setState(
				{
					latitude:latitude,
					longitude:longitude
				}
				);
			if(this.state.mapReady)
			{
				this.region = {
				latitude:this.state.latitude,
				longitude:this.state.longitude,
				latitudeDelta:0.005,
				longitudeDelta:0.005
					
			}
			this.map.animateToRegion(this.region,1000);
			}
				},error =>
				{
					console.log(error);
					this.getInitialUserposition();
				}
				),
				{
					enableHighAccuracy:true,
					timeout:2000,
					maximumAge:3600000
					
				}
				,
				{
					enableHighAccuracy:true,
					timeout:2000,
					maximumAge:3600000
					
				}
			);
		
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

		return {date:month + '/' + date + '/' + year ,time: hours + ':' + min + ':' + sec + ' ' +ampm};
	}
	
	render(){
		return(
			<>
					<View style= {{height:DeviceHeight - 100}}>
						<MapView showsUserLocation ={true}
						 ref = {ref => this.map = ref}
						 zoomEnabled ={true}
						 zoomControlEnabled={true}
						 followsUserLocation={true}
						 moveOnMarkerPress={true}
						 showsBuildings = {true}
						 rotateEnabled={true}
						 onMapReady = {()=> {
							 this.setState({rotate:true,mapReady:true})
							}							 
						}
						
						stopPropagation={false}
						 showsTraffic = {true}
						 initialRegion = {{latitude:this.state.mapRegion.latitude,longitude:this.state.mapRegion.longitude,
						 latitudeDelta:1,longitudeDelta:1}}
						 style={this.state.rotate?{...styles.map,bottom:0.2,top:0.2,left:0.2,right:0.2}:styles.map}						 
						 >					
					{
						(this.state.latlng.length > 0) && this.state.latlng.map((mark,uniquekey)=>(
							<MapView.Marker key={uniquekey}
							coordinate = {{latitude:mark.BinAddress.latitude ? mark.BinAddress.latitude :0,longitude:mark.BinAddress.longitude ? mark.BinAddress.longitude : 0}}
							ref={ref => { this.mapmarker = ref; }}
							>
								<Image source = {require('./images/Greenbin.png')} style={{width:25,height:25}}/> 
								<MapView.Callout style={{width:150}} onPress={()=>{
									console.log(mark)
									this.setState({visible:true,leftover:mark.remaining,username:mark.Email,billingname:mark.Name});}}>
									<Text>
										Email:{mark.Email}{"\n"}Name:{mark.Name}{"\n"}Remaining:{mark.remaining}
									</Text>
									<Button title="Collect"/>
									
								</MapView.Callout>
							</MapView.Marker>
							)
							
						)
						
					}

						 </MapView>
						 <View style={{flexDirection:'row'}}>
						 <Text style={{fontSize:25,color:'grey'}}>
						 press a bin
						 </Text>
						 <Text style={{marginLeft: 'auto',color:'black',fontSize:25}}>
							بن کو دبائیں  
						 </Text>
						 </View>
		
			  <Modal
				visible={this.state.visible}
				footer={
				  <ModalFooter>
					<ModalButton
					  text="CANCEL"
					  onPress={() => {this.setState({ visible: false });}}
					/>
					<ModalButton
					  text="OK"
					  onPress={() => {
							this.StoreData(this.getdate().date,this.state.leftover,this.state.paid,this.state.username);
						  }}
					/>
				  </ModalFooter>
				}				
								
			  >
				<ModalContent>
				{
					<>

					<View style = {{flexDirection:'row',marginBottom:10}}>
						<View><Text>Username:</Text></View>							
						<View><Text style={{marginLeft:17}}>{this.state.username}</Text></View>
					</View>
					<View style = {{flexDirection:'row',marginBottom:10}}>
						<View><Text>Name:</Text></View>							
						<View><Text style={{marginLeft:50}}>{this.state.billingname}</Text></View>
					</View>

					<View style = {{flexDirection:'row',marginBottom:10}}>
						<View><Text>Remaining:</Text></View>
						<View><Text style={{marginLeft:17 ,color:'red'}}>{this.state.leftover}</Text></View>
					</View>

					<View style = {{flexDirection:'row',marginBottom:10}}>
						<View style = {{marginTop:15}}><Text>Pay:</Text></View>
						<View>
							<TextInput onChangeText={(text)=>this.setState({paid:text})} value={this.state.paid} 
								keyboardType="numeric" style={{marginLeft:60,borderStyle: 'dotted',borderRadius:55,borderColor:'black',borderWidth:1,width:200}}
								placeholderTextColor="black" >
							</TextInput>
						</View>
					</View>
					
					<View style = {{flexDirection:'row',marginBottom:10}}>
						<Text> 
							Date:{"\n"}Time:
						</Text>
						<Text style = {{marginLeft:15}}>
						{
							this.getdate().date+"\n"+this.getdate().time
						}
						</Text>
					</View>
					</>
				}
				</ModalContent>
			  </Modal>								
			</View>
						
		</>
		);

	}	
} 
const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;

//let username = [];
let name = '';

let tabledata=[];
let coordinatess=[];

let countervalue = 0;
let id=0;

let prevlat=0;
let prevlong=0;



 const styles = StyleSheet.create({
	 map:{
		 width:Dimensions.get('window').width,
		 height:Dimensions.get('window').height/1.05
		 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',

  },contentText:{
	  fontSize:20,
	  fontWeight:'bold'
	  
	  
  },
  billing:{
		backgroundColor:'lightblue',
		height:70,
		marginHorizontal:20,
		marginVertical:5,
		borderRadius:35,
		alignItems:'center',
		justifyContent:'center',
		shadowOffset:{width:2,height:2},
		shadowColor:'black',
		shadowOpacity:0.5,
		
	}
		 
 });
 
 
 

