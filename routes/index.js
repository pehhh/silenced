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
const {body,validationResult} = require('express-validator')

/* index */
router.get('/',(req, res, next)=> {
  res.render('index');
});

/* registro */
router.get('/registro',(req,res,next)=>{
  res.render('registro',{
    errors:{}
  })
})
router.post('/registro',[
  body('usuario','Debes introducir un usuario')
    .notEmpty(),
  body('usuario','Debe contener entre 5 y 25 carácteres')
    .isLength({min:5})
    .isLength({max:25}),
  body('nombre','Debes introducir tu nombre')
    .notEmpty(),
  body('usuario','Debe contener entre 4 y 100 carácteres')
    .isLength({min:4})
    .isLength({max:100}),
  body('apellidos','Debes introducir tus apellidos')
    .notEmpty(),
  body('apellidos','Debe contener entre 4 y 150 carácteres')
    .isLength({min:4})
    .isLength({max:150}),
  body('email','Debes introducir un email')
    .notEmpty(),
  body('email','Debe ser un email válido')
    .isEmail(),
  body('pais','Debes seleccionar el nombre de tu país')
    .notEmpty(),
  body('ciudad','Debes seleccionar tu país')
    .notEmpty(),
  body('ciudad','Debe contener entre 3 y 60 carácteres')
    .isLength({min:3})
    .isLength({max:150}),
  body('password','Debes introducir una contraseña')
    .notEmpty(),
  body('password','Debe contener entre 8 y 25 carácteres')
    .isLength({min:4})
    .isLength({max:25}),
  body('rePassword','Debes repetir la contraseña')
    .notEmpty(),
  
    
],async(req, res,next)=>{
  const errors= validationResult(req).array()
  if(req.body.password!=req.body.rePassword){
    errors.push({msg:'Las constraseñas deben coincidir'})
  }
  
  console.log('erorres'+errors)
  if(errors.length>0){
    res.render('registro',{
      errors: errors
    })
  }else{
    await passport.authenticate('registro',{
      successRedirect:'/',
      failureRedirect:'/registro'
    })(req,res,next)
  }
  
})
/* login */
router.get('/login',(req,res,next)=>{
  res.render('login')
})
router.post('/login',[

],async (req,res,next)=>{
  await passport.authenticate('login',{
    successRedirect:'/',
    failureRedirect:'/login'
  })(req,res,next)
})
module.exports = router;
