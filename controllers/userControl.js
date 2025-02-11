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