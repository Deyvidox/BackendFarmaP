import Joi from "joi"

export const LoginValidated = Joi.object({
    "email": Joi.string().email().required(),
    "password": Joi.string().required()
})