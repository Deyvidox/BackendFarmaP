import Joi from "joi"

export const LoginValidated = Joi.object({
    "login": Joi.string().required(),
    "password": Joi.string().required()
})