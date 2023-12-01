const QueryFunction = require("../../service/query.function.user");
const query = new QueryFunction();
const tableName = query.Table_List_Upload;
const Where_Delete = query.Where_Delete;
const Where_UnDelete = query.Where_UnDelete;

const joinTable = [tableName, "list_personnel", "company"];
const joinColumns = [`${tableName}.*`, `company.id AS company_id`];
const joinConditions = `${tableName}.list_personnel_id = list_personnel.id AND list_personnel.company_id = company.id`;

const ListUploadController = {
    async GetData(req, res) {
        const where = `WHERE ${tableName}.${Where_Delete}`;
        const response = await query.joinQuery("user", "R", req, 1, tableName, joinTable, joinColumns, joinConditions, "JOIN", "", where);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async AddData(req, res) {
        const data = req.body;
        const response = await query.insertQuery("user", "C", req, 1, tableName, data);
        typeof response !== "string"
            ? res.json({ status: 201, message: "success", data: response })
            : res.json(response);
    },
    async UpdateData(req, res) {
        const id = req.params.id;
        const data = req.body;
        const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_Delete}`;
        const where = `WHERE id = ${id} AND ${Where_Delete}`;
            const response = await query.updateQuery("user", "U", req, 1, tableName, data, where, joinTable, joinColumns, joinConditions, joinWhere);
            typeof response !== "string"
                ? res.json({ status: 200, message: "success", data: response })
                : res.json({ status: 422, error: response });
    },
    async DeleteData(req, res) {
        const id = req.params.id;
        const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_Delete}`;
        const where = `WHERE id = ${id} AND ${Where_Delete}`;
        const response = await query.updateStatusDelete("user", "D", req, 1, tableName, where, joinTable, joinColumns, joinConditions, joinWhere);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async UnDeleteData(req, res) {
        const id = req.params.id;
        const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_UnDelete}`;
        const where = `WHERE id = ${id} AND ${Where_UnDelete}`;
        const response = await query.updateStatusUnDelete("user", "N", req, 1, tableName, where, joinTable, joinColumns, joinConditions, joinWhere);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async GetWhere(req, res) {
        const id = req.params.id;
        const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_Delete}`;
        const response = await query.joinQuery("user", "G", req, 1, tableName, joinTable, joinColumns, joinConditions, "JOIN", "", joinWhere);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async GetLimit(req, res) {
        const limit = req.params.limit;
        const sqllimt = `LIMIT ${limit}`;
        const response = await query.getQuery("user", "L", req, 1, tableName, "*", "", "", "", sqllimt);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async DeleteDataBackUp(req, res) {
        const id = req.params.id;
        const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_UnDelete}`;
        const where = `WHERE id = ${id} AND ${Where_UnDelete}`;
        const response = await query.deleteQuery("user", "B", req, 1, tableName, where, joinTable, joinColumns, joinConditions, joinWhere);
        console.log(response);
        typeof response !== "string"
          ? res.json({ status: 200, message: "success", data: response })
          : res.json({ status: 422, error: response });
      },
    async GetDataDelete(req, res) {
        const where = `WHERE ${tableName}.${Where_UnDelete}`;
        const response = await query.joinQuery("user", "R", req, 1, tableName, joinTable, joinColumns, joinConditions, "JOIN", "", where);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
};
module.exports = ListUploadController;
