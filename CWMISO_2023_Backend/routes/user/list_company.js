const express = require("express");
const router = express.Router();
const ListCompany_Controller = require("../../controller/user/list_company");
const path = "listcompany";

router.all(`/${path}`, ListCompany_Controller.GetData);
router.get(`/${path}/getid/:id`, ListCompany_Controller.GetWhere);

module.exports = router;
