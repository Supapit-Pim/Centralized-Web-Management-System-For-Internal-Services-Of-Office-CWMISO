const QueryFunction = require("../../service/query.function.admin");
const query = new QueryFunction();
const tableName = query.Table_Admin;
const Where_Delete = query.Where_Delete;

const AdminController = {
  async UpdateData(req, res) {
    const id = req.params.id;
    const data = req.body;
    const where = `WHERE id = ${id} AND ${Where_Delete}`;
    const response = await query.CheckUser(data);
    if (response.length != 0 && (req.params.id != response[0].id)) { // Check id user sql and user req
      res.json({ status: 422, error: "username already in use" })
    } else {
      const password = await query.EnCodePassword(req.body.password);
      data.password = password;
      const response = await query.updateQuery("admin", "U", req, 1, tableName, data, where);

      typeof response !== "string"
        ? res.json({ status: 200, message: "success", data: response })
        : res.json({ status: 422, error: response });
    }
  },
  async GetWhere(req, res) {
    const id = req.params.id;
    const where = `WHERE id = ${id} AND ${Where_Delete}`;
    const response = await query.getQuery("admin", "G", req, 1, tableName, "*", where);

    typeof response !== "string"
        ? res.json({ status: 200, message: "success", data: response })
      : res.json({ status: 422, error: response });
  },
};

module.exports = AdminController;
