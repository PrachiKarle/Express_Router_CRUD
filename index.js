var express= require('express');
const app=express();

//req.body data handle
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//file upload
var upload=require('express-fileupload');
app.use(upload());

//static file serve
app.use(express.static('public/'));

//import users routers
var userRoute=require('./routes/userRoutes.js');
app.use('/',userRoute);

//import admin routers
var adminRoute=require('./routes/adminRoutes.js');
app.use('/admin',adminRoute);


//server start
const PORT=3000 || process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running!`);
})