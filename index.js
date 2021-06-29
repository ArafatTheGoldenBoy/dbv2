const express = require("express");
const app = express();
const port = 7000;
const router = require("./Router/Router");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/home',(req,res)=>res.json('Home'))
app.use('', router);
app.listen(port,console.log('Server starting at: ',port));