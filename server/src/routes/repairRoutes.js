const express = require("express");
const { getRepairHistory } = require("../controllers/repairRoutes");
const router = express.Router();

router.get("/", getRepairHistory);

module.exports = router;
