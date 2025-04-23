const express = require("express")
const router = express.Router()

const { chatbot } = require("../controllers/chatControl")
router.post('/chatbot', chatbot)


module.exports = router