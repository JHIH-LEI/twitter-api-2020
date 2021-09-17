const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const userController = require('../controllers/userController')
const { authenticated, authenticatedUser } = require('../middlewares/auth')

router.post('/', userController.signUp)

router.use(authenticated, authenticatedUser)
router.get('/top', userController.getTopUser)
router.get('/current', userController.getCurrentUser)
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id/likes', userController.getUserLikedTweets)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id', userController.getUser)

module.exports = router