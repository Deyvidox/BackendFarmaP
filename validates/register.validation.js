import Joi from "joi"

export const RegisterValidated = Joi.object({
    "usu_nombre": Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must have at least 2 characters',
            'string.max': 'Name cannot exceed 100 characters'
        }),
    
    "usu_correo": Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email address'
        }),
    
    "password": Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must have at least 6 characters',
            'string.max': 'Password cannot exceed 100 characters'
        }),
    
    "rol_id": Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Role ID is required',
            'string.uuid': 'Role ID must be a valid UUID'
        })
})