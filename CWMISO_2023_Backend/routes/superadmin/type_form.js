const express = require("express");
const router = express.Router();
const TypeForm_Controller = require("../../controller/superadmin/type_form");
const path = "typeform";

router.all(`/${path}`, TypeForm_Controller.GetData);
router.post(`/${path}/add`, TypeForm_Controller.AddData);
router.put(`/${path}/update/:id`, TypeForm_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, TypeForm_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, TypeForm_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, TypeForm_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, TypeForm_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, TypeForm_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, TypeForm_Controller.GetDataDelete);

module.exports = router;
