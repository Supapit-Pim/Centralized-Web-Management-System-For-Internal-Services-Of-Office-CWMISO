const QueryFunction = require("../service/query.function.superadmin");
const query = new QueryFunction();
const express = require("express");
const Where_Delete = query.Where_Delete;

const TokenController = {
  async Token(req, res) {
    const token = req.headers.token;
    const response = await query.CheckToken(token);
    typeof response == 'object'
      ? res.json({ status: 200, message: "success", data: true })
      : res.json({ status: 422, error: "invalid token", data: false });
  },
  async TokenAdmin(req, res) {
    const id = req.params.id;
    const token = req.headers.token;
    const DeCodeData = await query.CheckToken(token);
    if(DeCodeData.DataUser.roles == 'superadmin'){
      const where = `WHERE id = ${id} AND ${Where_Delete}`;
      const columns = `id, name, username, password, company_id, superadmin_id, create_time, update_time, delete_status`
      const response = await query.getQuery('', "G", req, '', "admin", columns, where);
      try {
        if (typeof response == 'object') {
          response[0].roles = "admin";
          response[0].list_personnel_id = 0;
          const EnCodeJWT = await query.EnCodeJWT(response)
          typeof EnCodeJWT == 'string'
            ? res.json({ status: 200, message: "success", data: EnCodeJWT })
            : res.json({ status: 422, error: EnCodeJWT });
        } else {
          res.json({ status: 422, error: response });
        }
      } catch (error) {
        res.json({ status: 404, error: "data not found" });
      }
    } else {
      res.json({ status: 404, message: "no roles", error: DeCodeData.DataUser.roles });
    }
  },
  async TokenUser(req, res) {
    const id = req.params.id;
    const token = req.headers.token;
    const DeCodeData = await query.CheckToken(token);
    if(DeCodeData.DataUser.roles == 'superadmin' || DeCodeData.DataUser.roles == 'admin'){
      const where = `WHERE id = ${id} AND ${Where_Delete}`;
      const columns = `id, name, username, password, company_id, list_personnel_id, superadmin_id, admin_id, create_time, update_time, delete_status`
      const response = await query.getQuery('', "G", req, '', "user", columns, where);
      try {
        if (typeof response == 'object') {
          response[0].roles = "user";
          const EnCodeJWT = await query.EnCodeJWT(response)
          typeof EnCodeJWT == 'string'
            ? res.json({ status: 200, message: "success", data: EnCodeJWT })
            : res.json({ status: 422, error: EnCodeJWT });
        } else {
          res.json({ status: 422, error: response });
        }
      } catch (error) {
        res.json({ status: 404, error: "data not found" });
      }
    } else {
      res.json({ status: 404, message: "no roles", error: DeCodeData.DataUser.roles });
    }
  },
};

module.exports = TokenController;