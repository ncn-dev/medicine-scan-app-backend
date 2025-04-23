const express = require("express")
const cors = require("cors");
const port = 3000;
const { readdirSync } = require("fs");
const bodyParse = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParse.json())



readdirSync('./routes')
    .map((r) => app.use('/api', require('./routes/' + r))
)
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
  