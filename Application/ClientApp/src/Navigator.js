
import React,{Component} from 'react';
    
import App from './App.js';
import MainScreen from './MainScreen.js'
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
 
 
 export default class Navigator extends Component{

	render(){
		 return(
				<AppContainer></AppContainer>
		 );
		 
	 }
	 
 } 
 const AppSwitch = createSwitchNavigator(
 {
	 MainScreen:
	 {
		 screen:MainScreen,
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


	 }
 },
 {
	 
	initialRouteName: 'App',		 
 }
);
const AppContainer = createAppContainer(AppSwitch);
