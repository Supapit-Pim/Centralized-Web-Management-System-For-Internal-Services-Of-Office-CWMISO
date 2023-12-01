const express = require("express");
const router = express.Router();
const ListPersonnel_Controller = require("../../controller/superadmin/list_personnel");
const path = "listpersonnel";

router.all(`/${path}`, ListPersonnel_Controller.GetData);
router.post(`/${path}/add`, ListPersonnel_Controller.AddData);
router.put(`/${path}/update/:id`, ListPersonnel_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, ListPersonnel_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, ListPersonnel_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, ListPersonnel_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, ListPersonnel_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, ListPersonnel_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, ListPersonnel_Controller.GetDataDelete);

module.exports = router;
