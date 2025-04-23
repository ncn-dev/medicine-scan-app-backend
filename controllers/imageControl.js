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
            "http://192.168.10.118:8080/api/generate-category",
            formData
        )
        data = response.data
        const result = await pool.query(
            "INSERT INTO images(idcard, imagepath, patientname, patientid, medicinename, dose, form, registrationnumber, mfg, exp, warning, indication, usage, effect) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
            [ "admin", filename, data.PatientName, data.PatientID, data.MedicineName, data.Dosage, data.Form, data.MedicineRegNo, data.MFG, data.EXP, data.Warning, data.Indication, data.Usage, data.Effect]
        )
        res.status(200).json(response.data);
        
    } catch (err) {
        console.error(err);
    }
}

