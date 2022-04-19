/* proteger rutas */
const log={}

log.logueado=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }else{
        return res.redirect('/login')
    }
}

log.noLogueado=(req,res,next)=>{
    if(!req.isAuthenticated()){
        return next()
    }else{
       return res.redirect('/perfil')
    }
}
module.exports= log