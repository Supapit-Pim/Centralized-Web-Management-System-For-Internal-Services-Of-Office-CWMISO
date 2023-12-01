const express = require("express");
const router = express.Router();
const Admin_Controller = require("../../controller/admin/admin");
const path = "admin";

router.put(`/${path}/update/:id`, Admin_Controller.UpdateData);
router.get(`/${path}/getid/:id`, Admin_Controller.GetWhere);

module.exports = router;
