const express = require("express");
const router = express.Router();
const StatusCompany_Controller = require("../../controller/user/status_company");
const path = "statuscompany";

router.all(`/${path}`, StatusCompany_Controller.GetData);
router.get(`/${path}/getid/:id`, StatusCompany_Controller.GetWhere);

module.exports = router;
