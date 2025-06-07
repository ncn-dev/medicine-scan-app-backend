const bcrypt = require('bcryptjs');
const pool = require("../models/db");

exports.login = async (req, res) => {
    const { idcard, password } = req.body;
    try{
        const result = await pool.query("SELECT * FROM users WHERE idcard = $1", [idcard]);
        if(result.rows.length === 0){
            return res.status(400).send("Username not found!")
        }else{
            const isMatch = await bcrypt.compare(password, result.rows[0].password);
            if(!isMatch){
                return res.status(400).send("Password Incorrect");
            }else{
                // return res.status(200).json({ idcard: result.rows[0].idcard });

                return res.status(200).json({ idcard: result.rows[0].idcard });
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
   
}

exports.register = async (req, res) => {
    const { idcard, password, fullname, dateofbirth} = req.body;
    try{
        const result = await pool.query("SELECT * FROM users WHERE idcard = $1", [idcard]);
        if(result.rows.length > 0){
            return res.status(400).send("Already have account with this idcard")
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query("INSERT INTO users(idcard, password, fullname, dateofbirth) VALUES($1, $2, $3, $4)", [idcard, hashedPassword, fullname, dateofbirth])
            return res.status(200).json({ idcard: idcard });
        }
    }catch(err){
        console.error(err);
        return res.status(500).send(err);
    }
    
}
