const express = require("express");
const router = express.Router();
const StatusSocial_Controller = require("../../controller/admin/status_social");
const path = "statussocial";

router.all(`/${path}`, StatusSocial_Controller.GetData);
router.post(`/${path}/add`, StatusSocial_Controller.AddData);
router.put(`/${path}/update/:id`, StatusSocial_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, StatusSocial_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, StatusSocial_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, StatusSocial_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, StatusSocial_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, StatusSocial_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, StatusSocial_Controller.GetDataDelete);


module.exports = router;
