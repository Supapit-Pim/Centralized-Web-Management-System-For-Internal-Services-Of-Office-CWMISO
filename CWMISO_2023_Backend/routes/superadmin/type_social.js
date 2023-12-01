const express = require("express");
const router = express.Router();
const TypeSocial_Controller = require("../../controller/superadmin/type_social");
const path = "typesocial";

router.all(`/${path}`, TypeSocial_Controller.GetData);
router.post(`/${path}/add`, TypeSocial_Controller.AddData);
router.put(`/${path}/update/:id`, TypeSocial_Controller.UpdateData);
router.delete(`/${path}/delete/:id`, TypeSocial_Controller.DeleteData);
router.put(`/${path}/undelete/:id`, TypeSocial_Controller.UnDeleteData);
router.get(`/${path}/getid/:id`, TypeSocial_Controller.GetWhere);
router.get(`/${path}/limitdata/:limit`, TypeSocial_Controller.GetLimit);
router.delete(`/${path}/deletebackup/:id`, TypeSocial_Controller.DeleteDataBackUp);
router.get(`/${path}/getdelete`, TypeSocial_Controller.GetDataDelete);

module.exports = router;
