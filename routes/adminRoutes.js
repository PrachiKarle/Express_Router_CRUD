var express=require('express');
const Router=express.Router();

// mysql connection
var exe=require('../connection');

//session
var session=require('express-session');
Router.use(
    session({
        resave:true,
        saveUninitialized:true,
        secret:"Prachi"
    })
)

//otp
sendOTP=require('../Email.js');


//login admin 
Router.get('/',(req,res)=>{
    res.render('admins/login.ejs');
})


// signup admin
Router.get('/sign',(req,res)=>{
    res.render('admins/sign.ejs');
})

//insert admin in database
Router.post('/addadmin',async(req,res)=>{

    const {admin_name,admin_email,admin_pass,admin_no}=req.body;

    //insert
    var sql=`insert into adminData(name,email,pass,contact_no) values('${admin_name}','${admin_email}','${admin_pass}','${admin_no}')`;
    await exe(sql);
    
    res.redirect('/admin');
})

//validate login credentials
Router.post('/loginadmin',async(req,res)=>{

     const {email,pass}=req.body;
     var sql=`select* from adminData where email='${email}' AND pass='${pass}'`;
     var data=await exe(sql);
     if(data.length>0)
     {
        //login id store in session
        req.session.login_id=data[0].id;

        //generate otp
        var otp=Math.trunc(Math.random()*10000);

        //otp store in session
        req.session.otp=otp;

        //send otp email
        sendOTP(email,data[0].name,otp);
        
        res.redirect('/admin/otp');
     }
     else{
        res.redirect('/admin');
     }
})

//accept otp
Router.get('/otp',(req,res)=>{

    if(req.session.login_id){
        res.render('admins/otp.ejs');
    }
    else{
        res.redirect('/admin');
    }
   
})

// verify otp
Router.post('/verifyotp',(req,res)=>{
   if(req.session.otp==req.body.otp){
      req.session.admin_id=req.session.login_id;
      res.redirect('/admin/dashboard');
   }
   else{
    res.redirect('/admin/otp');
   }
})

Router.get('/dashboard',(req,res)=>{
    if(req.session.admin_id){
        res.render('admins/dashboard.ejs');
    }
    else{
        res.redirect('/admin');
    }
})


//export routers
module.exports=Router;




// create table adminData(id int NOT NULL PRIMARY KEY AUTO_INCREMENT,name varchar(100),email varchar(100) UNIQUE, pass varchar(10), contact_no varchar(10));