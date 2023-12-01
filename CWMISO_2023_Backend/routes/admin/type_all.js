const express = require("express");
const router = express.Router();
const TypeAll_Controller = require("../../controller/admin/type_all");
const path = "typeall";

router.all(`/${path}`, TypeAll_Controller.GetData);
router.get(`/${path}/getid/:id`, TypeAll_Controller.GetWhere);

module.exports = router;
