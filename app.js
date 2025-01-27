const express = require("express")
const app = express();
const multer = require("multer");
const path = require("path");
const port = 3000;
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");
const fs = require('fs');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "app",
    password: "admin",
    port: 5432,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

async function hashPassword(password) {
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return hashPassword;
}

app.use(express.json());
const formUpload = multer();


app.post("/api/login", formUpload.none(), async (req, res) => {
    const { idcard, password } = req.body;
    //console.log(password);
    try {
        const result = await pool.query(
          "SELECT * FROM users WHERE idcard = $1",
          [idcard]
        );
        console.log(result.rows[0]);
        const userinfo = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, userinfo.password);
        if (isPasswordValid) {
          res.json({ status: true, sessionid: userinfo.sessionid });
        } else {
          res.json({ status: false });
        }
    } catch (err) {
        console.log(err);
        res.json({ status: false });
    }
});

app.post("/api/getuser", formUpload.none(), async (req, res) => {
    const { sessionid } = req.body;
    try {
        const result = await pool.query(
            "SELECT fullname FROM users WHERE sessionid = $1",
            [sessionid]
        );
        res.json(result.rows[0])
    } catch (err) {
        console.error(err);
    }
});

app.post("/api/register", formUpload.none(), async (req, res) => {
    const { idcard, password, fullname, dateofbirth } = req.body;
    try { 
        const hashedPassword = await hashPassword(password);
        //console.log(hashedPassword)
        const sessionid = uuidv4();
        //console.log(sessionid);
        const result = await pool.query(
            "INSERT INTO users(idcard, password, fullname, dateofbirth, sessionid) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [idcard, hashedPassword, fullname, dateofbirth, sessionid]
        );
        //console.log(result);
        res.json({ status: true, sessionid });
    } catch (err) {
        console.error("Error:", err);
        res.json({ status: false });
    }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post("/api/uploadimage", upload.single("image"), async (req, res) => {
  if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
  }
  const formData = new FormData();
  const filename = req.file.filename;
  const imagePath = path.join(__dirname, 'uploads', filename);
  console.log("Generated local file path:", imagePath);
  formData.append("image", fs.createReadStream(imagePath), {
    filename: filename,
    contentType: req.file.mimetype
  });
  try{
    const response = await axios.post(
      "http://192.168.10.182:8080/api/generate-category",
      formData
    )
    res.status(200).json(response.data);
    console.log(response.data)
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
  