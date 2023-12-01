const express = require("express");
const router = express.Router();
const ListUpload_Controller = require("../../controller/user/list_upload");
const path = "listupload";

router.all(`/${path}`, ListUpload_Controller.GetData);
router.post(`/${path}/add`, ListUpload_Controller.AddData);
router.put(`/${path}/update/:id`, ListUpload_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, ListUpload_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, ListUpload_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, ListUpload_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, ListUpload_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, ListUpload_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, ListUpload_Controller.GetDataDelete);


module.exports = router;
