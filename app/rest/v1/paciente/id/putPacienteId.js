const {Router} = require('express')
const Paciente = require('../../../../../database/schemas/Usuario')
const {check, validationResult} = require('express-validator')
const authPaciente = require('../../middleware/authorizationPaciente')
const authorize = require('../../middleware/role')
const Role = require('../../../../helpers/role')
const bcrypt = require('bcrypt')


module.exports = Router().put('/rest/v1/paciente/:id', [
    //chekea validacion
    check('nombre').isLength({min: 3}),
    check('apellido').isLength({min: 3}),
    check('email').isEmail(),
    check('password').isStrongPassword()
], [authPaciente, authorize([Role.User, Role.Admin])],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()})
        }

        //encryptado de contraseña
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        //actualizacion del paciente
        const paciente = await Paciente.findByIdAndUpdate(req.params.id, {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            celular: req.body.celular,
            email: req.body.email,
            password: hashPassword
        },
        {
            new: true
        }) 
        if(!paciente){
           return res.status(404).send('El paciente con ese ID no se encuentra en la Base de Datos')
        }
        
        res.status(200).send(paciente)
    })