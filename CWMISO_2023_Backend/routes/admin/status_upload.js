const express = require("express");
const router = express.Router();
const StatusUpload_Controller = require("../../controller/admin/status_upload");
const path = "statusupload";

router.all(`/${path}`, StatusUpload_Controller.GetData);
router.post(`/${path}/add`, StatusUpload_Controller.AddData);
router.put(`/${path}/update/:id`, StatusUpload_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, StatusUpload_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, StatusUpload_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, StatusUpload_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, StatusUpload_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, StatusUpload_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, StatusUpload_Controller.GetDataDelete);


module.exports = router;
