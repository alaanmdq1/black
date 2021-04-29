const {Router} = require('express')
const Usuario = require('../../../../database/schemas/Usuario')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')



//creando usuarios
module.exports = Router().post('/rest/v1/paciente',[
    //chekea validacion
    check('nombre').isLength({min: 3}),
    check('apellido').isLength({min: 3}),
    check('celular').isLength({min: 3}),
    check('email').isEmail(),
    check('password').isStrongPassword()], 
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()})
        }
        //chekea si el email ya existe
        let usuario = await Usuario.findOne({email: req.body.email})
        if(usuario) return res.status(400).send('Ese usuario ya existe')
        //const db = req.db

        //encryptado de contraseña
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        //creando paciente tomando sus datos
        usuario = new Usuario ({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            celular: req.body.celular,
            email: req.body.email,
            password: hashPassword
        })
    
        //guarda el paciente 
        
        const result = await usuario.save()
        const jwtUsuario = usuario.generateJWT()
        res.status(201).header('Authorization', jwtUsuario).send(`paciente ${usuario.nombre} registrado` )
        

        
})