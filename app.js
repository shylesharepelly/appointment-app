const express = require("express");
const app = express();
const { List } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());



const flash = require("connect-flash");
app.use(express.urlencoded({extended:false}));
app.set("view engine","ejs");
const path = require('path');
app.use(express.static(path.join(__dirname,"public")));
app.set("views", path.join(__dirname, "views"));



module.exports=app;