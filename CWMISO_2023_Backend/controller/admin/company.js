const QueryFunction = require("../../service/query.function.admin");
const query = new QueryFunction();
const tableName = query.Table_Company;
const Where_Delete = query.Where_Delete;

const CompanyController = {
  async UpdateData(req, res) {
    const id = req.params.id;
    const data = req.body;
    const where = `WHERE id = ${id} AND ${Where_Delete}`;
    const response = await query.updateQuery("admin", "U", req, 1, tableName, data, where);
    typeof response !== "string"
      ? res.json({ status: 200, message: "success", data: response })
      : res.json({ status: 422, error: response });
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

module.exports = CompanyController;
