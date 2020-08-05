require('./db')  

const express = require('express')
const app = express();
const port = process.env.PORT || 3000
const bodyparser = require('body-parser') 
const router = express.Router();
const mongoose = require('mongoose')

const Bin = mongoose.model("Bin",new mongoose.Schema({binDetail:[{type:Object}],billing:[{type:Object}],BinAddress:{type:Object},CustomerEmail:{type:String}
	,CustomerName:{
		type:String
	},password:{
		type:String,
		required:true		
	},
	address:{
		type:String
	},
	cellphone:{
		type:String,
		required:true
	}}),"Bin");
const Driver = mongoose.model("Routes",new mongoose.Schema({coordinates:[{type:Object}]}),"Routes");
const CompanySetting = mongoose.model("CompanySetting",new mongoose.Schema({MonthlyPaid:{type:Number},UrgentReq:{type:Number},CompanyNumber:{type:String}}),"CompanySetting");

const accountSid = "sid",
        authToken = "token",
        fromNumber = 'numb',
		serviceId= 'serId';

const client = require('twilio')(accountSid, authToken)

app.use(bodyparser.json())

app.use(router.post('/ForgetPassword',async (req,res)=>{
    try{
	const {email} = req.body;
    const user = await Bin.findOne({"CustomerEmail":email})
	console.log(user.cellphone)
	if(!user){
		console.log(user)
        return res.status(422).send({error :"Error bin address cant be recieved"})
    }else{
		console.log(user.cellphone)
	if (user.cellphone) {

        client.verify.services(serviceId).verifications.create({
            to: user.cellphone,
            channel:'sms' 
        }).then(data => {
			res.json({
				status:200,
				cellphone:user.cellphone,
			})
        }).catch((error)=>res.json(error.message)) 
     } else {
        res.status(400).send({
            message: "Wrong phone number please contact Company",
            phonenumber: user.cellphone,
            data
        })

     }
	}
	}catch(error){console.log("urgent:",error)}
}))
app.use(router.post('/VerifyCode',async (req,res)=>{
    try{
	const {code,cellphone} = req.body
		if ((code).toString().length == 6) {
		console.log(code,cellphone)

        client.verify.services(serviceId).verificationChecks.create({
                to: cellphone,
                code: code
            }).then(data => {
                console.log(data)
				if (data.status === "approved") {
					res.json(data.status)
                }
            }).catch((error)=>console.log("inner Issue",error))
    } else {
        res.status(400).send({
            message: "Wrong code :(",
            phonenumber:cellphone
        })
    }
	}catch(error){console.log("VerifyCode:",error)}
}))

app.use(router.post('/urgentRequest',async (req,res)=>{
    try{
	const {email,date} = req.body
	var monthbilling=0
    const user = await Bin.findOne({"CustomerEmail":email})
	
	if(!user){
        return res.status(422).send({error :"Error bin address cant be recieved"})
    }else{
		
		Driver.updateOne({coordinates:{"$ne": user.BinAddress}},{$push:{coordinates:{"$each":[user.BinAddress],"$position":0}}},function(err,result){
			if(!err)
			{
				CompanySetting.find({},function(err,resulting){
						if(!err)
						{
							monthbilling=resulting[0].UrgentReq

							var date1 = date.date+" "+date.special
							console.log(user.binDetail.length)
							var remaining = user.binDetail.length * monthbilling;
							console.log(user.binDetail.length+"  "+monthbilling+" "+user.binDetail.length*monthbilling)
							Bin.updateOne({"CustomerEmail": email,"billing.date":{"$ne":date1}}, 
							  { "$addToSet": { "billing": {"date":date1,"paid":0,"remaining":remaining }} },
								  function(err, result) {
									if(err)
									{
										console.log(err);
							//			res.json(err);
									}
									else
									{	
										console.log(result)
										res.json(result);
									}
								});

						}else
							console.log("error")
					})				
			}
		})
		
		
	}
	}catch(error){console.log("urgentRequest:",error)}
}))

app.use(router.post('/CompanySetting',async (req,res)=>{
    try{
		CompanySetting.find({},function(err,resulting){
		if(!err)
		{
			res.json({urgentreq:resulting[0].UrgentReq,monthlypaid:resulting[0].MonthlyPaid,CompanyNumber:resulting[0].CompanyNumber})
		}else
			console.log("error")	
	})
	}catch(error){console.log("CompanySetting:",error)}
}))


app.use(
router.post('/signin',async (req,res)=>{
    try{
		console.log(req.body)
	const {email,password} = req.body
    if(!email || !password){
        return res.status(422).send({error :"must provide email or password"})
    }
    const user = await Bin.findOne({"CustomerEmail":email})
    if(!user){
		console.log("noo user found")
        return res.status(422).send({error :"must provide email"})
    }else{
		if(user.password == password)
		{

	res.json("Password matched")
		
		}else{
			
		console.log("noo password found",user.address,password)

		return res.status(422).send({error :"must provide password"})
		}
	}
	}catch(error){console.log("signin",error)}
}))
app.use(
router.post('/updating',async (req,res)=>{
    let {email} = req.body
    const user = await Bin.findOne({"CustomerEmail":email});
    if(!user){

	return res.status(422).send({error :"Email not stored"})
    }else{
	console.log("user exist")

		try{
		let {password,address,cellphone,name} = req.body;
		if(!password && !address && !cellphone && !name)
			return res.status(422).send({error :"must fill form"})
		else{	
			if(!password)
				password = user.password
			if(!address)
				address = user.address
			if(!cellphone)
				cellphone = user.cellphone
			if(!name)
				name = user.CustomerName
			console.log(password)
			email  = user.CustomerEmail
			Bin.updateOne({"CustomerEmail":email},{password,address,cellphone,"CustomerName":name},
			function(err,result){
			if(!err)
				console.log(result)
			console.log(result)
			res.json(result)
			});
			}
		}catch(error){
			console.log(error)
			res.status(422).send(error.message)
		}
	}
}))
app.use(
router.post('/bin',async (req,res)=>{
    try{
	const {email} = req.body
    const user = await Bin.findOne({CustomerEmail:email});
    if(!user){
        return res.status(422).send({error :"Email not stored"})
    }else{
		var array=[];
		user.binDetail.map((value,key)=>array.push({binStatus:value.binStatus,binId:value.binId}))
		res.json(array) 
}}catch(error){console.log("bin",error)}
}))
app.use(
router.post('/table',async (req,res)=>{
    try{
	const {email} = req.body;
    const binuser = await Bin.findOne({CustomerEmail:email});
	if(!binuser){
        return res.status(422).send({error :"Email not stored"})
    }else{
		var array=[];
		//binuser.billing.map((value,i)=>array.push({date:value.date,paid:value.paid,remaining:value.remaining}))
		console.log(binuser.billing)
		res.json(binuser.billing) 
	}}catch(error){console.log("table",error)}
}))

app.listen(port,() =>{
			console.log('Connection on Port '+port)	
})