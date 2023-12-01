const express = require("express");
const router = express.Router();
const DataForm_Controller = require("../../controller/superadmin/data_form");
const path = "dataform";

router.all(`/${path}`, DataForm_Controller.GetData);
router.post(`/${path}/add`, DataForm_Controller.AddData);
router.put(`/${path}/update/:id`, DataForm_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, DataForm_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, DataForm_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, DataForm_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, DataForm_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, DataForm_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, DataForm_Controller.GetDataDelete);

module.exports = router;
