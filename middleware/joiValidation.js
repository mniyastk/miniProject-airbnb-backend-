const Joi = require('joi');

/// Registration JOI validation ///

const registerValidation = async(req,res,next)=>{
    const registerSchema = Joi.object({
        firstName :Joi.string().required(),
        lastName : Joi.string().required(),
        password : Joi.string().min(5).max(25),
        email    : Joi.string().email().lowercase().required(),
        phone    :Joi.string()
    })
    try {
        await registerSchema.validateAsync(req.body.data);
        next()
    } catch (error) {
        res.status(400).json({error:error.details[0].message})
    }
}

/// Login JOI validation ///


const loginValidation = async(req,res,next)=>{
    const loginSchema = Joi.object({
        email :Joi.string().email().lowercase().required(),
        password : Joi.string().required().min(5).max(25),
    })
    try {
        await loginSchema.validateAsync(req.body.data);
        next()
    } catch (error) {
        res.status(401).json({error:error.details[0].message})
    }
}

module.exports ={registerValidation,loginValidation}