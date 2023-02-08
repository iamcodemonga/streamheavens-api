const router = require("express").Router();

const multer = require('multer');
const path = require('path');


const filePath = path.join(__dirname, '../store');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, filePath)
    },
    filename: function (req, file, cb) {
      cb(null, req.body.name)
    }
  })
  
const upload = multer({ storage: storage });

router.post('/dp' , upload.single('dp'), (req, res) => {
    res.json({ status: 200, message: "image uploaded successfully"})
})

module.exports = router;