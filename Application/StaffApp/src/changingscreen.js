import React,{Component} from 'react';
  
import Splash from './Splash.js';
import App from './App.js';
import SelectionScreen from './SelectionScreen.js';
import InstalationScreen from './InstalationScreen.js';
import BillingScreen from './BillingScreen.js';
 
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
 
 
 export default class changingscreen extends Component{

	render(){
		 return(
				<AppContainer></AppContainer>
		 );
		 
	 }
	 
 } 
 const AppStack = createStackNavigator(
 {
	SelectionScreen:
	 {
		 screen:SelectionScreen,
		 navigationOptions:
		 {
			 headerShown:false
		 }
	 },
	 App:{
		 screen:App,
		 navigationOptions:
		 {
			 headerShown:false
		 }
	 },
	 InstalationScreen:
	 {
		 screen:InstalationScreen,
		 navigationOptions:
		 {
			 headerShown:false
		 }
	 },
	 BillingScreen:
	 {
		 screen:BillingScreen,
		 navigationOptions:
		 {
			 headerShown:false
		 }
	 }
	 
 }
 );
 const AppSwitch = createSwitchNavigator(
 {
	Splash:
	 {
		 screen:Splash,
		 navigationOptions:
		 {
			 headerShown:false
		 }
	 },
	 AppStack:{
		 screen:AppStack
	 }
 },
 {
	 
	initialRouteName: 'Splash',		 
 }
);
const AppContainer = createAppContainer(AppSwitch);
