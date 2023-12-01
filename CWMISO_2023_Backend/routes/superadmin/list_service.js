const express = require("express");
const router = express.Router();
const ListService_Controller = require("../../controller/superadmin/list_service");
const path = "listservice";

router.all(`/${path}`, ListService_Controller.GetData);
router.post(`/${path}/add`, ListService_Controller.AddData);
router.put(`/${path}/update/:id`, ListService_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, ListService_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, ListService_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, ListService_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, ListService_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, ListService_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, ListService_Controller.GetDataDelete);

module.exports = router;
