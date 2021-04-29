const mongoose = require('mongoose')
const dotEnv = require('dotenv')
const referencia = ('./Referencia')
const jwt = require('jsonwebtoken')
dotEnv.config()

const {SECRET_KEY_PACIENTE } = process.env

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    apellido: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    celular: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        maxLength: 20,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: String,
    date: { type: Date, default: Date.now },
    referencia:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'referencia'
    }]
    
}, {
    timestamps: true
})
//genera el jwt
usuarioSchema.methods.generateJWT = function(){
    return jwt.sign({
        _id: this._id,
        nombre: this.nombre, 
        role: this.role
    } , SECRET_KEY_PACIENTE)
}

module.exports = mongoose.model('usuario', usuarioSchema)
