const express = require("express");
const router = express.Router();
const CreateForm_Controller = require("../../controller/admin/create_form");
const path = "createform";

router.all(`/${path}`, CreateForm_Controller.GetData);
router.post(`/${path}/add`, CreateForm_Controller.AddData);
router.put(`/${path}/update/:id`, CreateForm_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, CreateForm_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, CreateForm_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, CreateForm_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, CreateForm_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, CreateForm_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, CreateForm_Controller.GetDataDelete);


module.exports = router;
