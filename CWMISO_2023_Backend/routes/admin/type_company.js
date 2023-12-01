const express = require("express");
const router = express.Router();
const TypeCompany_Controller = require("../../controller/admin/type_company");
const path = "typecompany";

router.all(`/${path}`, TypeCompany_Controller.GetData);
router.get(`/${path}/getid/:id`, TypeCompany_Controller.GetWhere);

module.exports = router;
