const express = require("express")
const router = express.Router()
const { getmedbag } = require("../controllers/userControl")
const {deletemedbag} = require("../controllers/userControl")

router.get("/user/medbag/:idcard", getmedbag)

router.post("/user/deletemedbag/:idcard", deletemedbag)

module.exports = router