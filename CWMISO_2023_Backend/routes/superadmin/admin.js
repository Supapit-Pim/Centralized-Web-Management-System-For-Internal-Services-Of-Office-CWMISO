const express = require("express");
const router = express.Router();
const Admin_Controller = require("../../controller/superadmin/admin");
const path = "admin";

router.all(`/${path}`, Admin_Controller.GetData);
router.post(`/${path}/add`, Admin_Controller.AddData);
router.put(`/${path}/update/:id`, Admin_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, Admin_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, Admin_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, Admin_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, Admin_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, Admin_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, Admin_Controller.GetDataDelete);

module.exports = router;
