const express = require("express")
const router = express.Router()
const { getmedbag } = require("../controllers/userControl")
router.get("/user/medbag/:idcard", getmedbag)

module.exports = router