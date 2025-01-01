var express=require('express');
const Router=express.Router();

//mysql connection
var exe=require('../connection');

Router.get('/',(req,res)=>{
    res.render('users/home.ejs');
})

module.exports=Router;