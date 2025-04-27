const FormData = require("form-data");
const path = require("path");
const axios = require("axios");
const fs = require('fs');
const pool = require('../models/db')
exports.uploads = async(req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: "No file uploaded" });
    }
    const formData = new FormData();
    const filename = req.file.filename;
    const imagePath = path.join('uploads', filename);
    console.log("Generated local file path:", imagePath);
    formData.append("image", fs.createReadStream(imagePath), {
        filename: filename,
        contentType: req.file.mimetype
    });
    try{
        const response = await axios.post(
            "https://b4b2-2403-6200-8917-48ed-2d08-a1a8-1c52-8fb.ngrok-free.app/api/generate-category",
            formData
        )
        data = response.data
        const result = await pool.query(
            "INSERT INTO images(idcard, imagepath, medicinename, dose, form, warning, indication, usage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [ "admin", filename, data.drugname, data.dosage, data.form, data.warnings, data.indications, data.usage]
        )
        res.status(200).json(response.data);
        
    } catch (err) {
        console.error(err);
    }
}

