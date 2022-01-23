var express = require('express');
var router = express.Router();
const mysql=require('mysql')
const passport=require('passport')
const conn= mysql.createConnection({
  localhost:'host',
  user: 'root',
  password:'password',
  database:'proyectodaw'
})

/* index */
router.get('/',(req, res, next)=> {
  res.render('index');
});

/* registro */
router.get('/registro',(req,res,next)=>{
  res.render('registro')
})
router.post('/registro',async(req, res,next)=>{
  await passport.authenticate('registro',{
    successRedirect:'/',
    failureRedirect:'/registro'
  })(req,res,next)
})
/* login */
router.get('/login',(req,res,next)=>{
  res.render('login')
})
router.post('/login',async (req,res,next)=>{
  await passport.authenticate('login',{
    successRedirect:'/',
    failureRedirect:'/login'
  })(req,res,next)
})
module.exports = router;
