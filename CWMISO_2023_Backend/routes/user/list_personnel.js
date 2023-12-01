const express = require("express");
const router = express.Router();
const ListPersonnel_Controller = require("../../controller/user/list_personnel");
const path = "listpersonnel";

router.get(`/${path}/getid/:id`, ListPersonnel_Controller.GetWhere);

module.exports = router;
