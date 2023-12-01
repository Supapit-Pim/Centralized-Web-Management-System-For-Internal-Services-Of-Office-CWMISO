const express = require("express");
const router = express.Router();
const TypeCompany_Controller = require("../../controller/superadmin/type_company");
const path = "typecompany";

router.all(`/${path}`, TypeCompany_Controller.GetData);
router.post(`/${path}/add`, TypeCompany_Controller.AddData);
router.put(`/${path}/update/:id`, TypeCompany_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, TypeCompany_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, TypeCompany_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, TypeCompany_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, TypeCompany_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, TypeCompany_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, TypeCompany_Controller.GetDataDelete);

module.exports = router;
