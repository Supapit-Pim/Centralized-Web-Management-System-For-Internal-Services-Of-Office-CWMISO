const QueryFunction = require("../../service/query.function.user");
const query = new QueryFunction();
const tableName = query.Table_Status_Company;
const Where_Delete = query.Where_Delete;
const Where_UnDelete = query.Where_UnDelete;

const joinTable = [tableName, "list_company", "company"];
const joinColumns = [`${tableName}.*`, `list_company.id AS list_company_id`, `company.id AS company_id`];
const joinConditions = `${tableName}.list_company_id = list_company.id AND list_company.company_id = company.id`;
// const joinConditions = `${tableName}.list_company_id = list_company.id AND list_company.company_id = company.id AND list_upload.list_personnel_id = list_personnel.id AND list_personnel.company_id = company.id`;

const StatusCompanyController = {
  async GetData(req, res) {
    const where = `WHERE ${tableName}.${Where_Delete}`;
    const response = await query.joinQuery("user", "R", req, 1, tableName, joinTable, joinColumns, joinConditions, "JOIN", "", where);
    typeof response !== "string"
      ? res.json({ status: 200, message: "success", data: response })
      : res.json({ status: 422, error: response });
  },
  async GetWhere(req, res) {
    const id = req.params.id;
    // const where = `WHERE id = ${id} AND ${Where_Delete}`;
    // const response = await query.getQuery("user", "G", req, 1, tableName, "*", where);
    const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_Delete}`;
    const response = await query.joinQuery("user", "G", req, 1, tableName, joinTable, joinColumns, joinConditions, "JOIN", "", joinWhere);
    typeof response !== "string"
      ? res.json({ status: 200, message: "success", data: response })
      : res.json({ status: 422, error: response });
  },
};
module.exports = StatusCompanyController;
