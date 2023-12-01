const express = require("express");
const router = express.Router();
const Company_Controller = require("../../controller/user/company");
const path = "company";

router.get(`/${path}/getid/:id`, Company_Controller.GetWhere);
module.exports = router;
