import Joi from "joi"

export const LoginValidated = Joi.object({
    "login": Joi.string().required().messages({
        'string.empty': 'El usuario o correo es obligatorio',
        'any.required': 'El usuario o correo es obligatorio'
    }),
    "password": Joi.string().required().messages({
        'string.empty': 'La contraseña es obligatoria',
        'any.required': 'La contraseña es obligatoria'
    })
})