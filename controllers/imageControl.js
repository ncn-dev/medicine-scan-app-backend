const FormData = require("form-data");
const path = require("path");
const axios = require("axios");
const fs = require('fs');
const pool = require('../models/db')
exports.uploads = async(req, res) => {
    // console.log(req);
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
            "https://68vb76nr-8000.asse.devtunnels.ms/api/generate-category",
            formData
        )
        data = response.data
        const result = await pool.query(
            "INSERT INTO images(idcard, imagepath, medicinename, dose, form, warning, indication, usage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [ req.body.idcard, filename, data.drugname, data.dosage, data.form, data.warnings, data.indications, data.usage]
        )
        res.status(200).json(response.data);
        
    } catch (err) {
        console.error(err);
    }
}

