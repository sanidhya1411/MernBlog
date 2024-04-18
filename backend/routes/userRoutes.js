const { Router } = require('express')

const { registerUser, loginUser, getUser, editUser, getAuthors, changeAvatar,ResetPassword,ForgotPassword,verifyMail,verifiedMail} = require('../controllers/userControllers')
const authMiddleware = require('../middleware/authMiddleware')

const router = Router()


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.get('/', getAuthors)
router.post('/change-avatar',authMiddleware,changeAvatar)
router.patch('/edit-user', authMiddleware, editUser)
router.post('/forgotPassword',ForgotPassword)
router.patch('/resetPassword/:token', ResetPassword)
router.post('/verify', verifyMail)
router.patch('/verified/:token',verifiedMail)

module.exports = router
