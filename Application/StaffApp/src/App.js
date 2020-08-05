import React,{Component} from 'react';
import MapView from 'react-native-maps';
import {ActivityIndicator,StyleSheet,View,Text,Button,Image,TouchableOpacity,Dimensions,Alert,Platform,ScrollView,BackHandler} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import geolocation from 'react-native-geolocation-service';
import MapViewDirection from 'react-native-maps-directions';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modals';
import Geocoder from 'react-native-geocoder-reborn';

export default class App extends Component{	
	constructor(props)
	{
		super(props);
		this.state = {
				latlng:[],
				mapRegion:{
					latitude:31.634664128,
					longitude:74.351998592, 
					longitudeDelta:1,
					latitudeDelta:1
				},
				latitude:0,
				longitude:0,
				DriverLatitude:0,
				DriverLongitude:0,
				loader:false,
				rotate:false,
				rerouting:false,
				mapReady:false,
				autoRerouting:false,
				storageCheck:false,
				visibleModal:false,
				EndText:false,
				AddressInString:[],
				waypointOrder:[],
				waypointtmp:[],
				StringInEnglish:"",
		};
		this.getInitialUserposition = this.getInitialUserposition.bind(this);
		this.watchUserPosition = this.watchUserPosition.bind(this);
		this.address = this.address.bind(this);
		this.addressinterval = this.addressinterval.bind(this);
		this.autoUpdate = this.autoUpdate.bind(this);
		this.setStorage = this.setStorage.bind(this);
		this.addAddresstoDb = this.addAddresstoDb.bind(this);
		this.addressInString = this.addressInString.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		this.markerincrement = this.markerincrement.bind(this);
	}

   componentWillUnmount() {
       BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
   }

   handleBackButtonClick() {
      this.setState({visibleModal:false})
   }		
   markerincrement(uniquekey){
		if(markerposition == 0)
		{
			var val = this.state.waypointtmp.find((elem)=>{
				if(elem.res == uniquekey){
				return elem
			}})
			if(val == undefined)
			{
				
			}
			else
			{
				return val.ind + 1
			}
		console.log(markerposition)
		}
		markerposition++;
   }
   async addressInString(){
		if(this.state.latlng.length > 0)
		{
			this.state.latlng.map((items,key)=>{
			let pos ={
				lat:items.latitude,
				lng:items.longitude
			};
					
			Geocoder.geocodePosition(pos).then(res =>{
				var address = res[0].formattedAddress;
				addressString[key] = address;
			}).catch(error => console.log(error));
			});
			//console.log(addressString)
			await this.setState({AddressInString:addressString});
		}
	   
   }

	addAddresstoDb(latlng){
	fetch("http://192.168.10.5:3001/addAddressToBin",
		{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     },
		     body:JSON.stringify({
				"address":latlng
			})
	}).then((err,res)=>
	{
		if(err.status == 200)
			alert("Address store back to company")
		else
			alert("error try again later")
	}
	)		
	
	}
	
	addressinterval(){
			id = setInterval(this.address,3000);
	}
	autoUpdate(){
		if(!(coordinatess === undefined) && coordinatess.length > 0)
		{
		//	console.log(coordinatess)
				coordinatess.find((element)=>{ 

				var R = 6378137; // Earth’s mean radius in meter
				var dLat = (JSON.stringify(element.latitude) - JSON.stringify(this.state.DriverLatitude)) * Math.PI / 180;
				var dLong = (JSON.stringify(this.state.DriverLongitude) - JSON.stringify(element.longitude)) * Math.PI / 180;
				var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos((JSON.stringify(this.state.DriverLatitude))*Math.PI / 180) * Math.cos(JSON.stringify(element.latitude)*Math.PI / 180) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				var d = R * c;
				if(d < 26)
				{
					if(JSON.stringify(element.latitude) != prevlat && JSON.stringify(element.longitude) != prevlong)
					{				
						//	console.log("d",d);
							for(var latlngcounter = 0 ; latlngcounter < this.state.latlng.length ; latlngcounter++)
							{
								if((JSON.stringify(this.state.latlng[latlngcounter].latitude) == JSON.stringify(element.latitude) && JSON.stringify(this.state.latlng[latlngcounter].longitude) == JSON.stringify(element.longitude)))
								{
									var tmp = this.state.latlng[latlngcounter]
									tmp.remove = false;
									this.state.latlng[latlngcounter] = tmp
								}							
							}
							this.setState({autoRerouting:true,latitude:this.state.DriverLatitude,longitude:this.state.DriverLongitude})
							this.addressInString()
							prevlat = JSON.stringify(element.latitude);
							prevlong = JSON.stringify(element.longitude);
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
					}
					else
					{
						//console.log("d",d,JSON.stringify(element.latitude),this.state.DriverLatitude);
					}
				}else{
							//console.log("value greater then 26",d);
					
					}
				
			});
		}
		else{
				console.log("autoupdate not working",coordinatess);
			}
	}
	setStorage(latlng)
	{
		AsyncStorage.getItem("address").then(JSON.parse).then(data => {
				if(data != null)
				{		
					if(data.length != latlng.length)
					{
					//	console.log(data.length,latlng.length,"inside");
						AsyncStorage.setItem("address",JSON.stringify(latlng))
					}	
					else
					{					
						//console.log(data.length,latlng.length,"outside");
					}
				}			
			}
		);		
	}
	
	 Regionchange=(region)=>{
		this.setState({mapRegion:region})
	}
	watchUserPosition()
	{
			geolocation.watchPosition(
			(position) => {
				const latitude= position.coords.latitude;
				const longitude=position.coords.longitude; 
	
				this.setState(
				{
					DriverLatitude:latitude,
					DriverLongitude:longitude
				}
				);
				this.autoUpdate();
				},
				error => Geolocation.watchPosition(
			(position) => {
				const latitude= position.coords.latitude;
				const longitude=position.coords.longitude; 
	
				this.setState(
				{
					DriverLatitude:latitude,
					DriverLongitude:longitude
				}
				);
				this.autoUpdate();
				},error =>{
				console.log(error);
				this.watchUserPosition();
				}
				),
				{
					enableHighAccuracy:true,
					timeout:2000,
					maximumAge:3600000,
					distanceFilter:10
				}
				,
				{
					enableHighAccuracy:true,
					timeout:2000,
					maximumAge:3600000,
					distanceFilter:10
				}
			);
		
	}	
	address(){

		fetch("http://192.168.10.5:3001/address",
		{
			 method:"POST",
		     headers: {
			'Content-Type': 'application/json'
		     }
		}).then(res => res.json()).then(users=>tabledata=users).then(async()=> {
			coordinatess=tabledata[0]["coordinates"];
			
			coordinatess  = coordinatess.map((value,key)=>{return {latitude:value.latitude,longitude:value.longitude,remove:true}})

			if(coordinatess.length > 0)
			{	
				await this.setState({latlng:coordinatess,loader:false});
				this.addressInString();
				this.watchUserPosition();

				if(this.state.latlng.length >0)
					{
						clearInterval(id);
					}
				 await AsyncStorage.setItem('address',JSON.stringify(this.state.latlng))
			}else{
		//		console.log(coordinatess,"in address")
				this.setState({loader:false,EndText:false});
				clearInterval(id);
				alert("No Address are available");


			}
			}).catch((error)=>{
				console.log(error)
				alert("Address",error.message)});
	}
	
	componentDidMount(){
     BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  
	this.getInitialUserposition();		
			AsyncStorage.getItem("address").then(JSON.parse).then(async(data) => {
				if(data != null)
				{	
					if(data.length != this.state.latlng.length){
					//	console.log(data.length,this.state.latlng.length,"inside");
						await this.setState({latlng:data,storageCheck:true,EndText:true})
						coordinatess = this.state.latlng;
						this.addressInString();
						this.watchUserPosition();				
					}
					else{
						
					//	console.log(data.length,this.state.latlng.length,"outside");
					}
				}
			}
			);		

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
	render(){
		return(
			<>
						
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
						
						(this.state.waypointtmp.length > 0) && this.state.latlng.map((mark,uniquekey)=>(
							<MapView.Marker key={uniquekey} coordinate = {{latitude:mark.latitude?mark.latitude:0,longitude:mark.longitude?mark.longitude:0}}
							ref={ref => {this.markers = ref;}}
							
							>
							
							<Text style={{marginLeft:10,color:"red"}}>{this.markerincrement(uniquekey)}</Text>								
					
							<Image source = {require('./images/Redbin.png')} style={{width:25,height:25}}/>								
							
							<MapView.Callout style={{width:250}} onPress={async()=>{
									if(mark.remove == false)
									{
										var latlng = this.state.latlng.filter((v)=>(v.latitude != mark.latitude && v.longitude != mark.longitude))							
										await this.setState({latlng:latlng})
										this.setStorage(this.state.latlng);
									}
									}}>
									<View>
									<Text style={{color:'green',marginLeft:60}}>
										Address:
									</Text>
									<Text>
									{this.state.AddressInString[uniquekey]}
									</Text>
									<Button title="Remove" disabled={mark.remove}/>
									</View>
									
								</MapView.Callout>
						
						</MapView.Marker>
							)
						)
					}
					{
							this.state.loader?console.log("loader"):(this.state.latlng.length > 0 || this.state.storageCheck == true)&&<MapViewDirection 
							origin={(this.state.rerouting || this.state.autoRerouting)?{latitude:this.state.latitude?this.state.latitude:this.state.mapRegion.latitude,longitude:this.state.longitude?this.state.longitude:this.state.mapRegion.longitude}:(this.state.latitude && this.state.longitude)?{latitude:this.state.latitude,longitude:this.state.longitude}:this.state.latlng[0]}
					destination={this.state.latlng[this.state.latlng.length - 1]}
					waypoints={this.state.latlng}
					apikey={'google map api key'}
					strokeWidth={3}
					strokeColor="blue"
					navigationMode="DRIVING"					
					precision="high"
					optimizeWaypoints={true}
					onReady={async(result)=>{
						if(result.coordinates != undefined){
							console.log(result.waypointOrder)
			//				this.map.fitToCoordinates(result.coordinates, {
			//				edgePadding: {
			//				right: (DeviceWidth / 20),
			//				bottom: (DeviceHeight / 20),
			//				left: (DeviceWidth / 20),
			//				top: (DeviceHeight / 20),
			//			},
				
				//		});
						waypointtmp=[]
						var arr = result.waypointOrder[0]
						for(var way=0 ; way < arr.length ; way++)
						{						
							waypointtmp.push({res:arr[way],ind:way})
						}
						if(waypointtmp.length > 0)
						{
							markerposition=0
							await this.setState({waypointtmp:waypointtmp})
							
						}
				
					}else
						{
							//console.log(result,'outr')
						}
					}}
					onStart={(params) => {
								  console.log(params,`Started routing between "${params.origin}" and "${params.destination}"${(params.waypoints.length ? " using waypoints: " + params.waypoints.join(', ') : "")}`);
								}}
					
					
				/>
			
					}
				</MapView>	
			
			{
				this.state.loader&&<View style={styles.loading}> 
						<ActivityIndicator size="large" color="blue" />
					</View>								
			}			
			{
			this.state.rotate?
				<>
				<TouchableOpacity onPress = {()=>{
					if(this.state.latlng.length > 0)
					{
						this.setState({visibleModal:true})
					}else{
					Alert.alert('Address','No Address available.')					
					}
					}
				} style = {{marginTop:42,position:'absolute',marginLeft:15}}>
					<Image source = {require('./images/menu.png')} style = {{opacity:1,width:36,height:36}}/>			
				</TouchableOpacity>
			
				<TouchableOpacity onPress = {()=>{
					this.getInitialUserposition();
					this.watchUserPosition();
					this.setState({rerouting:true});
					}
				}		
					style = {{position:'absolute',marginTop:DeviceHeight/1.19,
					marginLeft:(DeviceWidth-50)}}>
					<Image source = {require('./images/get.png')} style = {{opacity:1,width:38,height:35}}/>
				
				</TouchableOpacity>
				</>:console.log("rotate not true")
			}
			<View style={{flexDirection:'row',bottom:0,marginTop:DeviceHeight/1.15,marginLeft:DeviceWidth/4}}>
			
			{
				(this.state.EndText != true)&&<TouchableOpacity onPress={()=>{
						prevlat = 0; 
						prevlong = 0;
						if(this.state.latlng.length == 0)
						{
							this.setState({loader:true,EndText:true});
							this.addressinterval();
						}
						
				
				}}>
				<View style={{backgroundColor:'white',
						borderRadius:20,
						alignItems:'center',
						justifyContent:'center',
						shadowOffset:{width:2,height:2},
						shadowColor:'black',
						marginBottom:10,
						marginLeft:15,
						shadowOpacity:0.5,shadowRadius:16
							}}>
					<Text style={{padding:10,fontSize:20,fontWeight:'bold',fontStyle:'italic'}}>
						Pick and Start
					</Text>
				</View>
			</TouchableOpacity>
			}{
			(this.state.EndText == true)&&<TouchableOpacity onPress={async()=>{await AsyncStorage.removeItem('address')
			if(this.state.latlng.length != 0)
			{this.addAddresstoDb(this.state.latlng);}
			coordinatess = [];
			tabledata = [] ;
			prevlat =0;
			prevlong=0;
			await this.setState({latlng:[],EndText:false});
			}}>
				<View style={{backgroundColor:'white',
						borderRadius:20,
						alignItems:'center',
						justifyContent:'center',
						shadowOffset:{width:2,height:2},
						shadowColor:'black',
						marginBottom:10,
						marginLeft:DeviceWidth/6,
						shadowOpacity:0.5,shadowRadius:16
							}}>
					<Text style={{padding:10,fontSize:20,fontWeight:'bold',fontStyle:'italic'}}>
						End
					</Text>
				</View>
			</TouchableOpacity>
			
			
			}
			</View>
					<Modal
					  visible={this.state.visibleModal}
					  propagateSwipe={true}
					  style={styles.bottomModal}>
					  
					  <View style={{height:DeviceHeight/2,width:DeviceWidth}}>
							
							<View style={{flexDirection:'row',backgroundColor:'white'}}>
								<View style={{flexDirection:'row'}}>
									<Image source = {require('./images/address.png')} style = {{width:25,height:25,backgroundColor:'grey'}}/>			

									<Text style={{marginTop:2}}>
										Address Menu
									</Text>
								</View>
								<TouchableOpacity onPress ={()=>{this.setState({visibleModal:false})}} style={{backgroundColor:'grey',marginLeft:DeviceWidth/1.65}}>
									<Image source = {require('./images/cross.png')} style = {{width:25,height:25,backgroundColor:'grey'}}/>			
								</TouchableOpacity>
							</View>
							<View style={{borderBottomWidth:2,borderColor:'grey'}}/>
							<View>
								<Text style={{fontSize:20,marginBottom:10,fontWeight:'bold',color:'green',marginLeft:DeviceWidth/2.5,fontStyle:'italic',textDecorationLine: 'underline'}}>Address:</Text>
							</View>
							
							<View style={this.state.latlng.length > 5 ? {flexDirection:'row',borderWidth:2,height:DeviceHeight/3,borderColor:'black',marginLeft:25,width:DeviceWidth-50}:
							{flexDirection:'row',marginLeft:25,width:DeviceWidth-50}
							}>
							 
	 						<ScrollView>
							 {
								 this.state.AddressInString.map((item, key)=>(
									<View style={{flexDirection:'row'}} key={key}>
										<Text key={key+1} style={{color:'grey',fontSize:15,fontWeight:'bold'}}> { (key+1)+":"} </Text>
										<Text key={key} style={{fontSize:15,fontWeight:'bold',marginBottom:5,color:'red'}}> { item+"." } </Text>
									</View>
									)
									)
							 }					
							</ScrollView>
							</View>
				
			
					  </View>

					</Modal>		
			
		</>
		);

	}	
} 
let tabledata=[];
let coordinatess=[];
let addressString = [];
let waypointtmp = [];

let countervalue = 0;
let id=0;

let check = {};
let prevlat=0;
let prevlong=0;



let markerposition = 0 ;

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;

 const styles = StyleSheet.create({
	 map:{
		 flex:1,
		 position:'absolute',
		 width:Dimensions.get('window').width,
		 height:Dimensions.get('window').height
		 },
		loading:{
		flex:1,
		justifyContent:"center",
		alignItems:"center" ,
		...StyleSheet.absoluteFill,
		backgroundColor:'transparent'
		},
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
	

  },
});