const {Router} = require('express')
const Referencia = require('../../../../../../database/schemas/Referencia')
const Usuario = require('../../../../../../database/schemas/Usuario')
const auth = require('../../../middleware/authorizationPaciente')

const authorize = require('../../../middleware/role')
const Role = require('../../../../../helpers/role')
//obtener referencias del paciente por id
module.exports = Router().get('/rest/v1/paciente/:id/:referencia', [auth, authorize([Role.Admin])] , async (req, res) => {
    const usuario = await Usuario.findById(req.params.id) 
    if(!usuario){
        return res.status(404).send('El paciente con ese ID no se encuentra en la Base de Datos')
    }
    //contiene variable referencia por id
    const referencia = await Referencia.findById(req.params.referencia)
    if(!referencia){
        return res.status(404).send('La referencia que solicita no se encuentra en la Base de Datos')
    }
    res.send(`Referencias del paciente ${req.params.id}, ${referencia}`)
})