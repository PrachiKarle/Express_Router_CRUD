var express = require("express");
const Router = express.Router();

// mysql connection
var exe = require("../connection");

//session
var session = require("express-session");
Router.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "Prachi",
  })
);


//otp
sendOTP = require("../Email.js");

//login admin
Router.get("/", (req, res) => {
  res.render("admins/login.ejs");
});


// signup admin
Router.get("/sign", (req, res) => {
  res.render("admins/sign.ejs");
});



//insert admin in database
Router.post("/addadmin", async (req, res) => {
  const { admin_name, admin_email, admin_pass, admin_no } = req.body;

  //insert
  var sql = `insert into adminData(name,email,pass,contact_no) values('${admin_name}','${admin_email}','${admin_pass}','${admin_no}')`;
  await exe(sql);

  res.redirect("/admin");
});



//validate login credentials
Router.post("/loginadmin", async (req, res) => {
  const { email, pass } = req.body;
  var sql = `select* from adminData where email='${email}' AND pass='${pass}'`;
  var data = await exe(sql);
  if (data.length > 0) {
    //login id store in session
    req.session.login_id = data[0].id;

    //generate otp
    var otp = Math.trunc(Math.random() * 10000);

    //otp store in session
    req.session.otp = otp;

    //send otp email
    sendOTP(email, otp, data[0].name);

    res.redirect("/admin/otp");
  } else {
    res.redirect("/admin");
  }
});



//accept otp
Router.get("/otp", (req, res) => {
  if (req.session.login_id) {
    res.render("admins/otp.ejs");
  } else {
    res.redirect("/admin");
  }
});



// verify otp
Router.post("/verifyotp", (req, res) => {
  if (req.session.otp == req.body.otp) {
    req.session.admin_id = req.session.login_id;
    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/admin/otp");
  }
});



//admin Dashboard
Router.get("/dashboard", async (req, res) => {
  //read
  if (req.session.admin_id) {
    var sql = `select* from admincard`;
    var data1 = await exe(sql);
    const obj = { data: data1 };
    res.render("admins/dashboard.ejs", obj);
  } else {
    res.redirect("/admin");
  }
});



Router.get("/add_data", (req, res) => {
  if (req.session.admin_id) {
    res.render("admins/adddata.ejs");
  } else {
    res.redirect("/admin");
  }
});



//insert card data
Router.post("/savecard", async (req, res) => {
  //file handling
  if (req.session.admin_id) {
    var file = req.files.card_img;
    var filename = new Date().getTime() + "_" + file.name;
    file.mv("public/uploads/" + filename);

    //insert
    const { card_title, card_caption } = req.body;
    var sql = `insert into admincard(card_title,card_caption,card_img) values('${card_title}','${card_caption}','${filename}')`;
    await exe(sql);

    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/admin");
  }
});



//edit card
Router.get("/edit_card/:id", async (req, res) => {
  if (req.session.admin_id) {
    var id = req.params.id;
    var sql = `select* from admincard where card_id='${id}'`;
    var data = await exe(sql);
    const obj = { data: data[0] };
    res.render("admins/editcard.ejs", obj);
  } else {
    res.redirect("/admin");
  }
});



Router.post("/updatecard", async (req, res) => {
  if (req.session.admin_id) {
    const { card_id, card_title, card_caption } = req.body;
    if (req.files) {
      var file = req.files.card_img;
      var filename = new Date().getTime() + "_" + file.name;
      file.mv("public/uploads/" + filename);
      var sql = `update admincard set card_img='${filename}' where card_id='${card_id}'`;
      await exe(sql);
    }

    var sql = `update admincard set card_title='${card_title}', card_caption='${card_caption}' where card_id='${card_id}'`;
    await exe(sql);

    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/admin");
  }
});





//delete card
Router.get("/delete_card/:id", async (req, res) => {
  if (req.session.admin_id) {
    var sql = `delete from admincard where card_id='${req.params.id}'`;
    await exe(sql);
    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/admin");
  }
});

//export routers
module.exports = Router;
