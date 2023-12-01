const express = require("express");
const router = express.Router();
const Company_Controller = require("../../controller/admin/company");
const path = "company";

router.put(`/${path}/update/:id`, Company_Controller.UpdateData);
router.get(`/${path}/getid/:id`, Company_Controller.GetWhere);

module.exports = router;
