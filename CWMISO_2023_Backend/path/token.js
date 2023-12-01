const express = require("express");
const router = express.Router();
const Token_Controller = require("../controller/token");
const path = "token";

router.get(`/${path}`, Token_Controller.Token);
// router.get(`/${path}/superadmin/getid/:id`, Token_Controller.TokenSuperadmin);
router.get(`/${path}/admin/getid/:id`, Token_Controller.TokenAdmin);
router.get(`/${path}/user/getid/:id`, Token_Controller.TokenUser);

module.exports = router;
