const mongoose = require('mongoose')
const mongourl ='mongourl'
const express = require('express')
const app = express();
const port = process.env.PORT || 3001
const bodyparser = require('body-parser') 
const router = express.Router();

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
const Data = mongoose.model("Routes",new mongoose.Schema({coordinates:[{type:Object}]}),"Routes");
const Bin = mongoose.model("Bin",new mongoose.Schema({binDetail:[{type:Object}],CustomerEmail:{type:String},CustomerName:{type:String},BinAddress:{type:Object},billing:[{remaining:{type:Number},date:{type:Object},paid:{type:Number},_id:false}]}),"Bin");
const CompanySetting = mongoose.model("CompanySetting",new mongoose.Schema({MonthlyPaid:{type:String},SpecialRouteTime:[{type:String}]}),"CompanySetting");
const DriverDetial = mongoose.model("DriverDetail",new mongoose.Schema({
	cellphone:{
		type:String,
		required:true,
		unique:true
	},
	DriverName:{
		type:String,
		required:true

	},
	Cnic:{
		type:String,
		required:true,
		unique:true

	}
	}),"DriverDetail");


let nameArray=[]; 
let nameArray1=[];
app.use(bodyparser.json())

app.use(
router.post('/signin',async (req,res)=>{
    try{
	const {email,password} = req.body
	console.log(email,password)

    if(!email || !password){
	return res.json({id:0})
    }
    const user = await DriverDetial.findOne({"cellphone":email})
    if(!user){
		return res.json({id:1})
    }else{
		if(user.Cnic == password)
		{
			res.json({id:3})
		}else{
			return res.json({id:2})
		}
	}
	}catch(error){console.log("signin",error)}
}))

app.use(
router.post('/address',async (req,res)=>{
		
		Data.find({},{coordinates:{$slice:10}},function(err,result){
		console.log("result",result)

		let findedAddress  = result[0].coordinates			
		console.log("findedAddress",findedAddress)

		Data.update({ },
		{ $pull: { coordinates: { $in:findedAddress }} },
		{ multi: true } ,function(err,res){
			if(err)
				console.log(err)
			console.log(res)
		})
		
		res.json(result);							
		})
}))

app.use(
router.post('/billingAddress',async (req,res)=>{

		Bin.find({},function(err,result){
			if(!err)
			{
			var resultingvalue=[];
			var monthlybilling=0;

			CompanySetting.find({},function(err,resulting){
					if(!err)
					{

						monthlybilling=resulting[0].MonthlyPaid
						var count = 0 ;
						for(var i = 0 ; i < result.length ; i++)
						{
							var monthpaid = monthlybilling * result[i].binDetail.length;
							let billingResult = result[i].billing
							
							if(result[i].billing.length > 0)
							{
			
								if(billingResult[billingResult.length-1].remaining != 0 && billingResult[billingResult.length-1].remaining != undefined)
								{
						
									monthpaid = monthpaid + billingResult[billingResult.length-1].remaining
									resultingvalue.push({remaining:monthpaid,BinAddress:result[i].BinAddress,Email:result[i].CustomerEmail,Name:result[i].CustomerName});
								}else
								{
									if(billingResult[billingResult.length-1].remaining == 0 && billingResult[billingResult.length-1].remaining != undefined)
									{
										resultingvalue.push({remaining:monthpaid,BinAddress:result[i].BinAddress,Email:result[i].CustomerEmail,Name:result[i].CustomerName});
									}	
								}			
																
							}else{
								resultingvalue.push({remaining:monthpaid,BinAddress:result[i].BinAddress,Email:result[i].CustomerEmail,Name:result[i].CustomerName});	
							}
						} 
						//console.log(resultingvalue)
						res.json(resultingvalue);						
					}
					else
						console.log("error")
			})								
			}
			})
}))


app.use(
router.post('/allUserdata',async (req,res)=>{
    try{
		Bin.find({},function(err,result){
		if(err) throw err;
			for (var i = 0; i < result.length; i++) {
			   nameArray[i] = {Email:result[i].CustomerEmail ,Name:result[i].CustomerName,binDetail:result[i].binDetail.map((value,key)=>{return value.binId;})}
			}
			res.json(nameArray)
		}
		)
	}
	catch(error){console.log("signin",error)}
	}))

app.use(router.post('/addAddressToBin',async (req,res)=>{
    try{
	const {address} = req.body
	console.log(address);
	Data.update({},{"$addToSet":{"coordinates":{"$each":address}}},{multi:true},function(err,result){
			if(!err)
			{
				res.json(result)
			}
			else
			{
				res.json(err)
			}
		})
	
	}catch(error){console.log("addAddressToBin:",error)}
}))

app.use(
router.post('/updating',async (req,res)=>{
    let {email,date,paid,remaining} = req.body;
	console.log(email);
	const user = await Bin.findOne({"CustomerEmail":email});
    if(!user){
        console.log("error,nouserfound")
		return res.status(422).send({error :"Email not stored"})
    }else{
		try{
		if(remaining < 0)
			paid = 0 - paid;

		remaining= remaining - paid;
		Bin.updateOne({"CustomerEmail": email,"billing.date":{"$ne":date}}, 
	      { "$addToSet": { "billing": {"date":date,"paid":paid,"remaining":remaining }} },
              function(err, result) {
				if(err)
				{
					console.log(err);
					res.json(err);
				}
				else
				{	
					if(result.n != 0 && result.nModified != 0)
						res.json("Done");
					else
						res.json("Billing is already added on this date.if you want to change it then please Contact company for updation.");
				}
			});
		}catch(error){
			console.log(error.message)
			res.status(422).send(error.message)
		}
		
	}
}))

app.use(
router.post('/setBinAddress',async (req,res)=>{
    let {address,email} = req.body;
	console.log(email);
	const user = await Bin.findOne({"CustomerEmail":email});
    if(!user){
        console.log("error,nouserfound")
		return res.status(422).send({error :"Email not stored"})
    }else{
		try{
		
		Bin.updateOne({"CustomerEmail": email},{"BinAddress":address},
              function(err, result) {
				if(err)
					res.json("Error");
				else
					res.json("Done");
			 });
		}catch(error){
			console.log(error.message)
			res.status(422).send(error.message)
		}
	}
}))

app.listen(port,() =>{
	console.log('Connection on Port '+port)	
})
