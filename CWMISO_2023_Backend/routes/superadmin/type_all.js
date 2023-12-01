const express = require("express");
const router = express.Router();
const TypeAll_Controller = require("../../controller/superadmin/type_all");
const path = "typeall";

router.all(`/${path}`, TypeAll_Controller.GetData);
router.post(`/${path}/add`, TypeAll_Controller.AddData);
router.put(`/${path}/update/:id`, TypeAll_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, TypeAll_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, TypeAll_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, TypeAll_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, TypeAll_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, TypeAll_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, TypeAll_Controller.GetDataDelete);

module.exports = router;
