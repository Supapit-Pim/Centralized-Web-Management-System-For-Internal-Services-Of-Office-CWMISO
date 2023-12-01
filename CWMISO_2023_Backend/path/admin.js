const express = require("express");
const router = express.Router();
const path = {RouteMain: "../routes/admin/"};

router.use(`/admin`, require(`${path.RouteMain}admin`));
router.use(`/admin`, require(`${path.RouteMain}user`));

router.use("/admin", require(`${path.RouteMain}company`));
router.use("/admin", require(`${path.RouteMain}type_company`));
router.use("/admin", require(`${path.RouteMain}type_all`));
router.use("/admin", require(`${path.RouteMain}type_social`));

router.use("/admin", require(`${path.RouteMain}list_company`));
router.use("/admin", require(`${path.RouteMain}list_personnel`));
router.use("/admin", require(`${path.RouteMain}list_service`));
router.use("/admin", require(`${path.RouteMain}list_upload`));

router.use("/admin", require(`${path.RouteMain}status_company`));
router.use("/admin", require(`${path.RouteMain}status_social`));
router.use("/admin", require(`${path.RouteMain}status_upload`));

router.use("/admin", require(`${path.RouteMain}create_form`));
router.use("/admin", require(`${path.RouteMain}data_form`));
router.use("/admin", require(`${path.RouteMain}data_personnel`));

module.exports = router;
 