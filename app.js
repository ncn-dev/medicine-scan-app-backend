const express = require("express");
const app = express();
const multer = require('multer');
const path = require('path')
const vision = require("@google-cloud/vision");
const port = 3000;

const client = new vision.ImageAnnotatorClient({
  keyFilename: "subtle-bus-443807-m7-320c0a0fc587.json",
});

const storsge = multer.diskStorage({
  destination:(req,file,cb) => {
    cb(null,'uploads/');
  },
  filename:(req,file,cb) =>{
    cb(null,Date.now()+path.extname(file.originalname));
  }
});

const upload = multer({storage:storsge});


async function detectLabels(imagePath) {
  try {
    const [result] = await client.textDetection(imagePath); // ใส่ path ไฟล์รูปภาพที่ต้องการวิเคราะห์
    const labels = result.textAnnotations;

    console.log("Labels detected:");
    console.log(labels[0].description);
    return labels[0].description;
  } catch (error) {
    console.error("Error detecting labels:", error);
  }
}

app.use(express.json());

app.post('/api/upload',upload.single('image'),async(req,res) => {
  console.log(req.file);
  if(!req.file){
    return res.status(400).send({message:'No file uploaded'});
  }
  const filename = req.file.filename;
  const  textOcr = await detectLabels(`uploads/${filename}`);
  res.json({message:`${textOcr}`});
})

app.get("/", (req, res) => {
  res.json({ name: "Natchanan Lordee" });
});

app.get("/api/ocr", async(req, res) => {
  drug_name = await detectLabels('sample_medicine_label_02.jpg');
  res.json({ drug_name:`${drug_name}`})

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
