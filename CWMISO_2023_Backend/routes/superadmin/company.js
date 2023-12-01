const express = require("express");
const router = express.Router();
const Company_Controller = require("../../controller/superadmin/company");
const path = "company";

router.all(`/${path}`, Company_Controller.GetData);
router.post(`/${path}/add`, Company_Controller.AddData);
router.put(`/${path}/update/:id`, Company_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, Company_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, Company_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, Company_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, Company_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`,Company_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, Company_Controller.GetDataDelete);

module.exports = router;
