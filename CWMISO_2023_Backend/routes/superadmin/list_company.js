const express = require("express");
const router = express.Router();
const ListCompany_Controller = require("../../controller/superadmin/list_company");
const path = "listcompany";

router.all(`/${path}`, ListCompany_Controller.GetData);
router.post(`/${path}/add`, ListCompany_Controller.AddData);
router.put(`/${path}/update/:id`, ListCompany_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, ListCompany_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, ListCompany_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, ListCompany_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, ListCompany_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, ListCompany_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, ListCompany_Controller.GetDataDelete);

module.exports = router;
