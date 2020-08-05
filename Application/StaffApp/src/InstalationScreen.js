import React,{Component} from 'react';
import MapView from 'react-native-maps';
import {ActivityIndicator,StyleSheet,View,Text,Button,Image,TouchableOpacity,Dimensions,Alert,Platform,BackHandler} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder-reborn';
import Modal, { ModalFooter, ModalButton, ModalContent  } from 'react-native-modals';
import SearchableDropdown from 'react-native-searchable-dropdown';

export default class InstalationScreen extends Component{	
	constructor(props)
	{
		super(props);
		this.state = {
				loader:true,
				rotate:false,
				rerouting:false,
				mapReady:false,
				latitude:0,
				longitude:0,
				mapRegion:{
					latitude:31.634664128,
					longitude:74.351998592, 
					longitudeDelta:1,
					latitudeDelta:1
				},
				addressInstring:'',
				binName:'',
				binArray:[],
				visible:false,
				username:[],
				bin:[],
				name:''				

		};
		this.getInitialUserposition = this.getInitialUserposition.bind(this);
		this.getUserName = this.getUserName.bind(this);
		this.setBinAddress = this.setBinAddress.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}

		componentDidMount(){
			BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	
			this.getInitialUserposition();
	
			}
   componentWillUnmount() {
       BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
   }

   handleBackButtonClick() {
       this.setState({visible:false})
   }		
			
	getAddressInString(){
			let pos ={
					lat:this.state.latitude,
					lng:this.state.longitude
				};
				
				Geocoder.geocodePosition(pos).then(res =>{
				    var address = res[0].formattedAddress;
					this.setState({addressInstring:address});
				}).catch(error => console.log(error));
				console.log(this.state.addressInstring);				
			
		
	}
	getUserName(){
		try{
		fetch("http://192.168.10.5:3001/allUserdata",
		{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     }
		 }).then(res => res.json()).then(users=>username=users).then(()=> {
			let tmp = [];
			let bindetail = [];
			username.map((value,key)=>{
				tmp.push({name:"Name= "+value.Name+"\n"+"Email ="+value.Email,Email:value.Email})
				console.log(key,value.binDetail)
				bindetail.push(value.binDetail)
			})
			this.setState({username:tmp,bin:bindetail});
			}).catch((error)=>alert("Getting UserName",error.message));
		}catch{(error)=>alert("Getting UserName",error.message)};
	}

	setBinAddress(email,addressInlatlong){
	let ename = email
	console.log(ename)
	try{
	fetch("http://192.168.10.5:3001/setBinAddress",
		{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     },
			 body:JSON.stringify({
					"address":addressInlatlong,
					"email":ename
				})

		}).catch((error)=>alert("Setting bin Address",error.message));
		Alert.alert('InstalationScreen','Address of bin is stored against related user');					
		}catch{(error)=>alert("Getting UserName",error.message)};

	}
	
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
				this.getAddressInString();
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
				this.getAddressInString();
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
	render(){
		return(
			<>
					<View style= {{}}>
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
							 						 
						 showsTraffic = {true}
						 onRegionChangeComplete = {this.Regionchange}
						 initialRegion = {{latitude:this.state.mapRegion.latitude,longitude:this.state.mapRegion.longitude,
						 latitudeDelta:1,longitudeDelta:1}}
						 style={this.state.rotate?{...styles.map,bottom:0.2,top:0.2,left:0.2,right:0.2}:styles.map}						 
						 >					
						 {
							 (this.state.latitude > 0 && this.state.longitude > 0) && <MapView.Marker 
							 coordinate = {{latitude:this.state.latitude,longitude:this.state.longitude}}
							 draggable
							 onDragEnd={async(e) => {
								 console.log(e.nativeEvent.coordinate.latitude,e.nativeEvent.coordinate.longitude)
								 await this.setState({latitude:e.nativeEvent.coordinate.latitude,longitude:e.nativeEvent.coordinate.longitude});
								 this.getAddressInString();
							 }}
								>
									<Image source = {require('./images/Greenbin.png')} style={{width:25,height:25}}/>								
								</MapView.Marker>
						 }
						</MapView>	
					</View>	
						<View>
							<Text style={{fontSize:20,color:'grey'}}>Long Press on Marker to change location</Text>
							<Text style={{fontSize:25,fontWeight:'bold',textDecorationLine: 'underline'}}>Location:</Text>	
								{
									(this.state.addressInstring.length >0) && <Text style={{fontSize:20,fontStyle:"italic"}}>{this.state.addressInstring}</Text>
								}
								<View style= {{marginLeft:DeviceWidth/16,width:350}}>
								<Button title="Set Bin" onPress = {async()=>{
									await this.getUserName();
									this.setState({visible:true});
									}
								}/></View>
								
			  <Modal
				visible={this.state.visible}
				footer={
				  <ModalFooter>
					<ModalButton
					  text="CANCEL"
					  onPress={() => {this.setState({ visible: false,name:'' });}}
					/>
					<ModalButton
					  text="OK"
					  onPress={() => {
							  if(this.state.name.length > 0)
							  {
								  this.setBinAddress(this.state.name,{latitude:this.state.latitude,longitude:this.state.longitude});
								  this.setState({name:''})
							  }else{
								  alert("username not selected")
								  console.log("onPress=",typeof(this.state.name))
							  }
						  }
						}
					/>
				  </ModalFooter>
				}				
								
			  >
				<ModalContent>
				{
					<>

					<View style = {{flexDirection:'row',marginBottom:10}}>
						<View><Text>Username:</Text></View>
						<View style={{marginTop:-15,marginLeft:20,justifyContent:'center',width:200}} >
						  <SearchableDropdown
							onItemSelect={async(item) => {
								if(item != undefined)
									await this.setState({name:item.Email});
							}}
							containerStyle={{ padding: 5 }}
							itemStyle={{							  
								padding: 10,
								borderWidth:1,
							}}
							itemTextStyle={{ color: 'black' }}
							itemsContainerStyle={this.state.username.length>2?{maxHeight:160,marginLeft:15,position:'relative',marginTop:0,width:180,backgroundColor:'white',zIndex:3}:{marginLeft:15,position:'relative',marginTop:0,width:180,backgroundColor:'white',zIndex:3}}
							items={this.state.username}
							textInputProps={
							  {
								placeholder: "Please Select User",
								style: {
	
									borderColor: 'black',
									borderRadius: 55,
									borderStyle: 'dotted',
									borderWidth:1,
								},
								
							  }
							}
						/>
						</View>
					</View>
					{
						(this.state.addressInstring.length > 0)&&<View style = {{flexDirection:'row',marginBottom:10}}>
						<View><Text>Address:</Text></View>
						<View style={{marginTop:-5,marginLeft:60,justifyContent:'center',width:200}} >
							<Text>{
								this.state.addressInstring
							}</Text>
						</View>
					</View>
					}
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
let addressString = '';

let username = [];

 const styles = StyleSheet.create({
	 map:{
		 width:Dimensions.get('window').width,
		 height:Dimensions.get('window').height/1.3
		 }	
 });