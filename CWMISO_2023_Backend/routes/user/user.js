const express = require("express");
const router = express.Router();
const User_Controller = require("../../controller/user/user");
const path = "user";

router.put(`/${path}/update/:id`, User_Controller.UpdateData);
router.get(`/${path}/getid/:id`, User_Controller.GetWhere);

module.exports = router;
