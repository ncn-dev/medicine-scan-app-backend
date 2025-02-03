const pool = require("../models/db")
exports.getmedbag = async (req, res) => {
    const { idcard } = req.params;
    const result = await pool.query("SELECT * FROM images WHERE idcard = $1",[idcard]);
   
    res.status(200).json(result.rows);
}