// นำเข้าไลบรารี Google Vision
const vision = require('@google-cloud/vision');

// สร้าง client สำหรับ Vision API โดยใช้ Service Account Key
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'subtle-bus-443807-m7-320c0a0fc587.json', // เปลี่ยนเป็น path ไฟล์ Service Account Key ของคุณ
});

// ฟังก์ชันเรียกใช้ Vision API
async function detectLabels() {
  try {
    const [result] = await client.textDetection('sample_medicine_label_02.jpg'); // ใส่ path ไฟล์รูปภาพที่ต้องการวิเคราะห์
    const labels = result.textAnnotations;

    console.log('Labels detected:');
    labels.forEach(label => console.log(label.description));
  } catch (error) {
    console.error('Error detecting labels:', error);
  }
}

detectLabels();
