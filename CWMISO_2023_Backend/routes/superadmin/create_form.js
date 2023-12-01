const express = require("express");
const router = express.Router();
const CerateForm_Controller = require("../../controller/superadmin/create_form");
const path = "createform";

router.all(`/${path}`, CerateForm_Controller.GetData);
router.post(`/${path}/add`, CerateForm_Controller.AddData);
router.put(`/${path}/update/:id`, CerateForm_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, CerateForm_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, CerateForm_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, CerateForm_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, CerateForm_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, CerateForm_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, CerateForm_Controller.GetDataDelete);

module.exports = router;
