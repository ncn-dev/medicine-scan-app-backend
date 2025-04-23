const pool = require("../models/db")

exports.getmedbag = async (req, res) => {
    const { idcard } = req.params;
    const result = await pool.query("SELECT * FROM images WHERE idcard = $1",[idcard]);
   
    res.status(200).json(result.rows);
};

exports.deletemedbag = async (req,res) => {
    const { idcard } = req.params;
   
    console.log(idcard)
    try{
        const result = await pool.query("DELETE FROM images WHERE id = $1",[idcard]);
        
        if(result.rowCount == 0){
            return res.status(404).json({message:"Item not found"});
        }

        res.status(200).json({message: "Item deleted successfully"});

    }catch(error){
        console.error(error.message);
        res.status(500).json({message: "Server error"});
    }
}
exports.updatemedbag = async  (req,res) => {
    // UPDATE table_name
    // SET column1 = value1, column2 = value2, ...
    // WHERE condition;
    const { id, medicinename, dose, form, registrationnumber, mfg, exp, warning, indication, usage, effect } = req.body;
    console.log(id, medicinename, dose, form, registrationnumber, mfg, exp, warning, indication, usage, effect);
    try {
        const result = await pool.query("UPDATE images SET medicinename = $2, dose = $3, form = $4, registrationnumber = $5, mfg = $6, exp = $7, warning = $8, indication = $9, usage = $10, effect = $11  WHERE id = $1", [id, medicinename, dose, form, registrationnumber, mfg, exp, warning, indication, usage, effect]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Server error"});
    }
    res.status(200).json({message: "Item deleted successfully"});
}