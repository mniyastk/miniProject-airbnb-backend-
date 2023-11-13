const router = require('express').Router()
const { userRegistration, userLogin, fetchData } = require('../controller/userController')
router.post('/user/register',userRegistration)
router.post('/api/user/login',userLogin)
router.get('/api/users/fetch',fetchData)
module.exports =router