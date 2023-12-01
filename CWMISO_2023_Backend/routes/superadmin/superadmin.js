const express = require("express");
const router = express.Router();
const SuperAdmin_Controller = require("../../controller/superadmin/superadmin");
const path = "superadmin";

router.all(`/${path}`, SuperAdmin_Controller.GetData);
router.post(`/${path}/add`, SuperAdmin_Controller.AddData);
router.put(`/${path}/update/:id`, SuperAdmin_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, SuperAdmin_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, SuperAdmin_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, SuperAdmin_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, SuperAdmin_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, SuperAdmin_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, SuperAdmin_Controller.GetDataDelete);

module.exports = router;
