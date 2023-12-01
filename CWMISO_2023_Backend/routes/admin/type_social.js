const express = require("express");
const router = express.Router();
const TypeSocial_Controller = require("../../controller/admin/type_social");
const path = "typesocial";

router.all(`/${path}`, TypeSocial_Controller.GetData);
router.get(`/${path}/getid/:id`, TypeSocial_Controller.GetWhere);

module.exports = router;
