const QueryFunction = require("../../service/query.function.user");
const query = new QueryFunction();
const tableName = query.Table_List_Personnel;
const Where_Delete = query.Where_Delete;
const Where_UnDelete = query.Where_UnDelete;

const ListPersonnelController = {
  async GetWhere(req, res) {
    const id = req.params.id;
    const where = `WHERE id = ${id} AND ${Where_Delete}`;
    const response = await query.getQuery("user", "G", req, 1, tableName, "*", where);
    typeof response !== "string"
      ? res.json({ status: 200, message: "success", data: response })
      : res.json({ status: 422, error: response });
  },
};
module.exports = ListPersonnelController;
