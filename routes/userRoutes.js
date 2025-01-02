var express=require('express');
const Router=express.Router();

//mysql connection
var exe=require('../connection');

Router.get('/',async(req,res)=>{
    var sql=`select* from admincard`;
    var data=await exe(sql);
    const obj={data:data};
    res.render('users/home.ejs',obj);
})



module.exports=Router;