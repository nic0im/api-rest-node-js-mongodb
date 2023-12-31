const { request, response} = require("express");
const Usuario = require("../models/usuario")

const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req, res= response)  =>  {

    try {

        const {correo, password} = req.body; 
        
        //verificar correo
        const user = await Usuario.findOne({correo})
    
            if(!user){
                return res.json({
                    msg: "Correo no valido"
                })
            }
        

        
        //verificar estado
        if(!user.estado){
            return res.json({
                msg: "Usuario inactivo"
            })
        }


        //verificar contraseña 
        const validPassword = bcryptjs.compareSync(password, user.password)

        if(!validPassword){
            return res.json({
                msg: "Error en la contraseña"
            })
        }

    
        //generar jwt
        const token = await generarJWT(user.id);

        return res.json({
            user,
            token
        })

    } catch(err){
        return res.json({
            msg: "Hable con el administrador"
        })
    }
}

module.exports= {
    login
}