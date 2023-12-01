const express = require("express");
const router = express.Router();
const StatusCompany_Controller = require("../../controller/superadmin/status_company");
const path = "statuscompany";

router.all(`/${path}`, StatusCompany_Controller.GetData);
router.post(`/${path}/add`, StatusCompany_Controller.AddData);
router.put(`/${path}/update/:id`, StatusCompany_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, StatusCompany_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, StatusCompany_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, StatusCompany_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, StatusCompany_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, StatusCompany_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, StatusCompany_Controller.GetDataDelete);

module.exports = router;
