const express = require("express");
const router = express.Router();
const DataPersonnel_Controller = require("../../controller/user/data_personnel");
const path = "datapersonnel";

router.all(`/${path}`, DataPersonnel_Controller.GetData);
router.post(`/${path}/add`, DataPersonnel_Controller.AddData);
router.put(`/${path}/update/:id`, DataPersonnel_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, DataPersonnel_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, DataPersonnel_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, DataPersonnel_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, DataPersonnel_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, DataPersonnel_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, DataPersonnel_Controller.GetDataDelete);

module.exports = router;
