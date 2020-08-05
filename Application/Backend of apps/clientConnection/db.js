const mongoose = require('mongoose')
const mongourl ='mongourl'

mongoose.connect(mongourl,{
	useUnifiedTopology:true,
	useNewUrlParser:true
},(err)=>
{
	if(!err)
	{
		console.log('connected Succesfully')
	}else{
		console.log('Connection Error'+err)
	}		
}
);