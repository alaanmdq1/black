const {Router} = require('express')
const Paciente = require('../../../../database/schemas/Paciente')
const Administrador = require('../../../../database/schemas/Administrador')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')


module.exports = Router().post('/rest/v1/login',[
    //chekea validacion
    check('email').isEmail(),
    check('password').isStrongPassword()],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()})
        }
        //chekea si el email es correcto
        let usuario = await Paciente.findOne({email: req.body.email})
        if(!usuario) return res.status(400).send('E-mail o contraseña invalido')
        let administrador = await Administrador.findOne({email: req.body.email})
        if(!administrador) return res.status(400).send('E-mail o contraseña invalido')

        //chekea si la contraseña es correcta
        const validPasswordUsuario = await bcrypt.compare(req.body.password, usuario.password)
        if(!validPasswordUsuario) return res.status(400).send('E-mail o contraseña invalido')
        const validPasswordAdmin = await bcrypt.compare(req.body.password, administrador.password)
        if(!validPasswordAdmin) return res.status(400).send('E-mail o contraseña invalido')

        //json web token auth usuario y administrador
        const jwtUsuario = usuario.generateJWT()
        const jwtAdmin = administrador.generateJWT()
        
        if(jwtUsuario) return res.header('Authorization', jwtUsuario).send({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        })
        if(jwtAdmin) return res.header('Authorization', jwtAdmin).send({
            _id: administrador._id,
            nombre: administrador.nombre,
            email: administrador.email
        })
        
    })