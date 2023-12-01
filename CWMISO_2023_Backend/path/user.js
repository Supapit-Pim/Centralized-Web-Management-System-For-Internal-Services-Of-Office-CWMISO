const express = require("express");
const router = express.Router();
const path = {RouteMain: "../routes/user/"};

module.exports = router;

router.use(`/user`, require(`${path.RouteMain}user`));
router.use(`/user`, require(`${path.RouteMain}data_personnel`));
router.use(`/user`, require(`${path.RouteMain}list_upload`));
router.use("/user", require(`${path.RouteMain}status_upload`));
router.use("/user", require(`${path.RouteMain}company`));
router.use("/user", require(`${path.RouteMain}type_company`));
router.use("/user", require(`${path.RouteMain}type_all`));

router.use("/user", require(`${path.RouteMain}list_company`));
router.use("/user", require(`${path.RouteMain}list_personnel`));
router.use("/user", require(`${path.RouteMain}status_company`));

module.exports = router;