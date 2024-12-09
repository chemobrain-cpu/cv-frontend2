const express = require("express")
const { allCvs,login,signup,updateAccount,createCv, updateCv, deleteCv, validateToken,cv,initiatePlan, verifyPayment} = require("../controller/user")
const router = express.Router()
//auth route

router.post("/validate-token",validateToken )
router.post("/login",login)
router.post('/signup', signup)
router.post('/updateaccount/:id', updateAccount)

//fetch all cvs
router.get('/cvs/:id', allCvs)
router.get('/cv/:id', cv)
router.post('/makecv/:id', createCv)
router.post('/updatecv/:id', updateCv)
router.delete('/deletecv/:id', deleteCv)

// Endpoint to verify payment
router.post('/initiateplan',initiatePlan);
router.get('/verify-payment/:reference',verifyPayment);





exports.router = router