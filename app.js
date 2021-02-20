'use strict';
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sls = require("serverless-http");
const expressMultipartFileParser = require("express-multipart-file-parser");
const router = express.Router();
const AWS = require("aws-sdk");
const region = "ap-southeast-1"
AWS.config.update({ region: region });
const bucketName = "lambda-demo-medium";
const s3 = new AWS.S3();
const app = express();
const start = async () => {
  try {
    app.use(cors());
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    app.use(expressMultipartFileParser.fileParser({
      rawBodyOptions: {
        limit: '50mb',
      },
    }));
    router.post('/upload', async (req, res) => {
      try {
        const file = req.files[0]
        const ext = file.mimetype.split("/")[1];
        const timestamp = Date.now();
        const tempFileName = `${timestamp}.${ext}`;
        const params = {
          Bucket: bucketName,
          Key: tempFileName,
          ContentType: file.mimetype,
          Body: file.buffer
        };
        await s3.putObject(params).promise();
        const url = `https://${bucketName}.s3-${region}.amazonaws.com/${tempFileName}`;
        res.status(200).json({
          field: file.fieldname,
          originalName: file.originalname,
          mimeType: file.mimetype,
          timestamp,
          url,
        })
      } catch (err) {
        res.status(400).json({
          message: err.message,
        });
      }
    });
    router.get('/', async (req, res) => {
      res.status(200).json({ api: '1.0.0' })
    });
    app.use('/', router)
    app.listen(3000, function () {
      console.log("App is listening on port 3000!");
    });
  }
  catch (err) {
    console.log(err);
  }
};
start();
module.exports.server = sls(app);
