var express = require('express');
var router = express.Router();
const mysql = require('mysql')
const passport = require('passport')
const conn = mysql.createConnection({
  localhost: 'host',
  user: 'root',
  password: 'password',
  database: 'proyectodaw'
})
const { body, validationResult } = require('express-validator')
const encriptado = require('../helpers/passportBcrypt')
/* index */
router.get('/',async (req, res, next) => {
  await conn.query('SELECT * FROM usuarios u, opiniones o WHERE u.id=o.id_usuario', [req.user.id], (err, result) => {

    console.log(result)
    res.render('index', {
      data: result,
      
    })

  })
  
});

/* registro */
router.get('/registro', (req, res, next) => {
  res.render('registro', {
    errors: {}
  })
})
router.post('/registro', [
  body('usuario', 'Debes introducir un usuario')
    .notEmpty(),
  body('usuario', 'Debe contener entre 5 y 25 carácteres')
    .isLength({ min: 5 })
    .isLength({ max: 25 }),
  body('nombre', 'Debes introducir tu nombre')
    .notEmpty(),
  body('usuario', 'Debe contener entre 4 y 100 carácteres')
    .isLength({ min: 4 })
    .isLength({ max: 100 }),
  body('apellidos', 'Debes introducir tus apellidos')
    .notEmpty(),
  body('apellidos', 'Debe contener entre 4 y 150 carácteres')
    .isLength({ min: 4 })
    .isLength({ max: 150 }),
  body('email', 'Debes introducir un email')
    .notEmpty(),
  body('email', 'Debe ser un email válido')
    .isEmail(),
  body('pais', 'Debes seleccionar el nombre de tu país')
    .notEmpty(),
  body('ciudad', 'Debes seleccionar tu país')
    .notEmpty(),
  body('ciudad', 'Debe contener entre 3 y 60 carácteres')
    .isLength({ min: 3 })
    .isLength({ max: 150 }),
  body('password', 'Debes introducir una contraseña')
    .notEmpty(),
  body('password', 'Debe contener entre 8 y 25 carácteres')
    .isLength({ min: 4 })
    .isLength({ max: 25 }),
  body('rePassword', 'Debes repetir la contraseña')
    .notEmpty(),


], async (req, res, next) => {
  const errors = validationResult(req).array()
  if (req.body.password != req.body.rePassword) {
    errors.push({ msg: 'Las constraseñas deben coincidir' })
  }
  const usuarioRepetido = await conn.query('SELECT * FROM usuarios WHERE usuario=?', [req.body.usuario])
  if (usuarioRepetido.length > 0) {
    errors.push({ msg: 'Ese usuario ya está resgistrado, elige otro' })
  }
  const emailRepetido = await conn.query('SELECT * FROM usuarios WHERE email=?', [req.body.email])
  if (emailRepetido.length > 0) {
    errors.push({ msg: 'Ese email ya está registrado, elige otro' })
  }
  console.log('erorres' + errors)
  if (errors.length > 0) {
    res.render('registro', {
      errors: errors
    })
  } else {
    await passport.authenticate('registro', {
      successRedirect: '/',
      failureRedirect: '/registro'
    })(req, res, next)
  }

})
/* login */
router.get('/login', (req, res, next) => {
  res.render('login')
})
router.post('/login', async (req, res, next) => {
  await passport.authenticate('login', {
    successRedirect: '/perfil',
    failureRedirect: '/errorLogin'
  })(req, res, next)
})
router.get('/errorLogin', (req, res, next) => {
  res.render('error_registro_login/errorLogin')
})
/* perfil */

router.get('/perfil', async (req, res, next) => {
  console.log(req.user.id)
  await conn.query('SELECT * FROM usuarios u, opiniones o WHERE u.id=o.id_usuario AND u.id=?', [req.user.id], (err, result) => {

    console.log(result)
    res.render('perfil', {
      data: result,
      usuario: req.user.id
    })

  })
  router.post('/insertar', async (req, res, next) => {
    console.log(req.body)
    const user = req.body
    user.id_usuario = req.user.id
    await conn.query('INSERT INTO opiniones SET ?', [req.body], (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.redirect('/perfil')
      }
    })
  })
})

router.get('/editar/:id_opinion', async (req, res, next) => {
  console.log(req.params)
  await conn.query('SELECT * FROM opiniones WHERE id_opinion=? ', req.params.id_opinion, (err, result) => {
    console.log(result)
    res.render('editar', {
      data: result[0]
    })
  })
})
router.post('/editar/:id_opinion', async (req, res, next) => {
  /* const opinion=req.body
  opinion.id_usuario=req.user.id */
  console.log(req.body)
  const opinion = {
    //id_opinion: req.body.id_opinion,
    titulo: req.body.titulo,
    opinion: req.body.opinion,
    plataforma: req.body.plataforma,
    id_usuario: req.user.id
  }
  await conn.query('UPDATE opiniones SET ? WHERE id_opinion=?', [opinion, req.params.id_opinion], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/perfil')
    }

  })
})
router.get('/borrar/:id_opinion', (req, res, next) => {
  conn.query('DELETE FROM opiniones WHERE id_opinion=?', [req.params.id_opinion], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/perfil')
    }
  })
})
router.get('/editarPerfil/:id', async (req, res, next) => {
  console.log(req.params)
  await conn.query('SELECT * FROM usuarios WHERE id=?', [req.params.id], (err, result) => {
    console.log(result)
    res.render('editarPerfil', {
      data: result[0],
      errors: {}
    })
  })
})
router.post('/editarPerfil/:id', [
  body('usuario', 'Debes introducir un usuario')
    .notEmpty(),
  body('usuario', 'Debe contener entre 5 y 25 carácteres')
    .isLength({ min: 5 })
    .isLength({ max: 25 }),
  body('nombre', 'Debes introducir tu nombre')
    .notEmpty(),
  body('usuario', 'Debe contener entre 4 y 100 carácteres')
    .isLength({ min: 4 })
    .isLength({ max: 100 }),
  body('apellidos', 'Debes introducir tus apellidos')
    .notEmpty(),
  body('apellidos', 'Debe contener entre 4 y 150 carácteres')
    .isLength({ min: 4 })
    .isLength({ max: 150 }),
  body('email', 'Debes introducir un email')
    .notEmpty(),
  body('email', 'Debe ser un email válido')
    .isEmail(),
  body('pais', 'Debes seleccionar el nombre de tu país')
    .notEmpty(),
  body('ciudad', 'Debes seleccionar tu país')
    .notEmpty(),
  body('ciudad', 'Debe contener entre 3 y 60 carácteres')
    .isLength({ min: 3 })
    .isLength({ max: 150 }),
], async (req, res, next) => {
  const errors = validationResult(req).array()

  const usuarioRepetido = await conn.query('SELECT * FROM usuarios WHERE usuario=?', [req.body.usuario])
  if (usuarioRepetido.length > 0) {
    errors.push({ msg: 'Ese usuario ya está resgistrado, elige otro' })
  }
  const emailRepetido = await conn.query('SELECT * FROM usuarios WHERE email=?', [req.body.email])
  if (emailRepetido.length > 0) {
    errors.push({ msg: 'Ese email ya está registrado, elige otro' })
  }
  console.log('erorres' + errors)
  if (errors.length > 0) {
    await conn.query('SELECT * FROM usuarios WHERE id=?', [req.params.id], (err, result) => {
      console.log(result)
      res.render('editarPerfil', {
        data: result[0],
        errors: errors
      })
    })
  } else {
    console.log(req.params.id)
    console.log(req.params.body)
    await conn.query('UPDATE usuarios SET ? WHERE id=?', [req.body, req.params.id], (err, result) => {
      res.redirect('/perfil')
    })
  }
})
router.get('/editarPassword/:id', async (req, res, next) => {
  console.log(req.params)
  await conn.query('SELECT * FROM usuarios WHERE id=?', [req.params.id], (err, result) => {
    console.log(result)
    res.render('editarPassword', {
      data: result[0],
      errors: {}
    })
  })
})
router.post('/editarPassword/:id', [
  body('password', 'Debes introducir tu contraseña actual')
    .notEmpty(),
  body('nuevoPassword', 'Debes introducir una nueva contraseña')
    .notEmpty(),
  body('nuevoPassword', 'Debe contener entre 8 y 25 carácteres')
    .isLength({ min: 4 })
    .isLength({ max: 25 }),
  body('repeticionNuevoPassword', 'Debes repetir la contraseña')
    .notEmpty(),
], async (req, res, next) => {
  const errors = validationResult(req).array()
  const usuario = await conn.query('SELECT * FROM usuarios WHERE id=?', [req.body.id])
  const contraseña = await encriptado.comparar(req.body.password, usuario.password)

  if (!contraseña) {
    errors.push({ msg: 'La constraseña actual no es correcta' })

  } else if (req.body.nuevoPassword != req.body.repeticionNuevoPassword) {
    errors.push({ msg: 'Las contraseñas no coinciden' })
  }
  if (errors.length > 0) {
    res.render('editarPassword', {
      errors: errors,
      data: usuario
    })
  } else {

    const nuevoPassword = await encriptado.encriptar(req.body.nuevoPassword)
    usuario.password=nuevoPassword
    conn.query('UPDATE usuarios SET ? WHERE id=?', [usuario, req.params.id], (err, result) => {
      res.redirect('/perfil')
    })
  }
}
)






module.exports = router;
