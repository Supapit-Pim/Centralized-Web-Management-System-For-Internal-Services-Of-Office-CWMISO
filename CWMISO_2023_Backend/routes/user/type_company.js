const express = require("express");
const router = express.Router();
const TypeCompany_Controller = require("../../controller/user/type_company");
const path = "typecompany";

router.get(`/${path}/getid/:id`, TypeCompany_Controller.GetWhere);

module.exports = router;
