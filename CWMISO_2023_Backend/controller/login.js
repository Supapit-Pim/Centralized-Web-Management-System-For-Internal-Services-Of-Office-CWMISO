const express = require("express");
const QueryFunction = require("../service/query.function.superadmin");
const query = new QueryFunction();

const LoginController = {
  async Login(req, res) {
    const data = req.body;
    const response = await query.CheckUser(data);
    if(typeof response != "string"){
      if (response.length != 0) {
        if (response[0].delete_status == 0 ) {
          const EnCodeJWT = await query.EnCodeJWT(response);
          res.json({roles:response[0].roles, companyid:response[0].company_id, listpersonnel:response[0].list_personnel_id, token: EnCodeJWT});
        } else {
          res.json({ status: 422, error: "This user deleted." });
        }
      } else {
        res.json({ status: 422, error: "Not to be user." });
      }
    } else {
      res.json({ status: 422, error: "Sorry not have data."});
    }
  },
};

module.exports = LoginController;

