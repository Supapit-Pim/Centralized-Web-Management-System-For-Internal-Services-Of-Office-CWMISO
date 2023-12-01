const express = require("express");
const swaggerUi = require('swagger-ui-express');
const app = express();
const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./postman/api/result.yml');
const swaggerDocument = YAML.load('./postman/api/result-1.yml');
const cors = require("cors");
app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
    express.urlencoded({ extended: false }),
    express.json(),
    cors({
      origin: "*",
    }),
    require("./path/superadmin"), 
    require("./path/admin"),
    require("./path/user"),
    require("./path/login"),
    require("./path/token")
  )
  .listen("5000");

