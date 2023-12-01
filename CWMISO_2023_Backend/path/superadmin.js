const express = require("express");
const router = express.Router();
const path = {RouteMain: "../routes/superadmin/"};

router.use("/superadmin", require(`${path.RouteMain}superadmin`));
router.use("/superadmin", require(`${path.RouteMain}admin`));
router.use("/superadmin", require(`${path.RouteMain}user`));

router.use("/superadmin", require(`${path.RouteMain}type_all`));
router.use("/superadmin", require(`${path.RouteMain}type_company`));
router.use("/superadmin", require(`${path.RouteMain}type_form`));
router.use("/superadmin", require(`${path.RouteMain}type_social`));

router.use("/superadmin", require(`${path.RouteMain}company`));

router.use("/superadmin", require(`${path.RouteMain}list_company`));
router.use("/superadmin", require(`${path.RouteMain}list_personnel`));
router.use("/superadmin", require(`${path.RouteMain}list_service`));
router.use("/superadmin", require(`${path.RouteMain}list_upload`));

router.use("/superadmin", require(`${path.RouteMain}status_company`));
router.use("/superadmin", require(`${path.RouteMain}status_social`));
router.use("/superadmin", require(`${path.RouteMain}status_upload`));

router.use("/superadmin", require(`${path.RouteMain}create_form`));
router.use("/superadmin", require(`${path.RouteMain}data_form`));
router.use("/superadmin", require(`${path.RouteMain}data_personnel`));

module.exports = router;
 