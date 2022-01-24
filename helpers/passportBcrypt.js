const passport=require('passport')
const Strategy= require('passport-local').Strategy

const mysql=require('mysql')
const {promisify}=require('util')
const bcrypt= require('bcryptjs')

const conn= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'proyectodaw'
})

conn.query=promisify(conn.query)
/* bcrypt */
/* encritado */
const encriptado={}

encriptado.encriptar=async(password)=>{
    const salt= await bcrypt.genSalt(10)
    const hash= await bcrypt.hash(password,salt)
    return hash
}
/* comparar constraseñas */

encriptado.comparar= async(password, passwordGuardada)=>{
    try{
        const resultComp = await bcrypt.compare(password,passwordGuardada)
        return resultComp
    }catch(e){
        console.log(e)
    }
}
/* registro */
passport.use('registro', new Strategy({
    /* usenameField es lo que que le paso al username en (req,username,password) */
    /* al usernameField el paso el name ="usuario" y este se lo pasa al(req,username...) */
    usernameField:'usuario',
    passwordField:'password',
    passReqToCallback:true
}, async (req,username,password,done)=>{
    console.log(req.body)
    const newUser={
        usuario:username,
        nombre:req.body.nombre,
        apellidos:req.body.apellidos,
        email:req.body.email,
        pais: req.body.pais,
        ciudad: req.body.ciudad,
        password:password
    }
    console.log(newUser)
    newUser.password=await encriptado.encriptar(password)
    const result= await conn.query('INSERT INTO usuarios SET ?', [newUser])
    newUser.id=result.insertId
    done(null,newUser)
}))
passport.use('login', new Strategy({
    usernameField:'usuario',
    passwordField:'password',
    passReqToCallback:true
},async(req,username,password,done)=>{
    const result = await conn.query('SELECT * FROM usuarios WHERE usuario=?',[username])
    if(result.length>0){
        const user= result[0]
        const resultComp= encriptado.comparar(password,user.password)
        if(resultComp){
            done(null,user)
        }else{
            done(null,false)
        }
    }else{
        done(null,false)
    }
}))
passport.serializeUser((user,done)=>{
    done(null,user.id)
})
passport.deserializeUser( async(id,done)=>{
    console.log(id)
    const result= await conn.query('SELECT * FROM usuarios WHERE id=?',[id])

    done(null,result[0])
})

module.exports=encriptado