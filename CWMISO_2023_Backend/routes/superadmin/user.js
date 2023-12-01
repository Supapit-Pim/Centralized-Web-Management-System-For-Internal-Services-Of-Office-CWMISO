const express = require("express");
const router = express.Router();
const User_Controller = require("../../controller/superadmin/user");
const path = "user";

router.all(`/${path}`, User_Controller.GetData);
router.post(`/${path}/add`, User_Controller.AddData);
router.put(`/${path}/update/:id`, User_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, User_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, User_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, User_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, User_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, User_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, User_Controller.GetDataDelete);

module.exports = router;
