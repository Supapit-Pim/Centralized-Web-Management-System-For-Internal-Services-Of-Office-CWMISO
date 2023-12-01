const QueryFunction = require("../../service/query.function.admin");
const query = new QueryFunction();
const tableName = query.Table_List_Personnel;
const Where_Delete = query.Where_Delete;
const Where_UnDelete = query.Where_UnDelete;

const ListPersonnelController = {
    async GetData(req, res) {
        const where = `WHERE ${Where_Delete}`;
        const response = await query.getQuery("admin", "R", req, 1, tableName, "*", where);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async AddData(req, res) {
        const data = req.body;
        const response = await query.insertQuery("admin", "C", req, 1, tableName, data);
        typeof response !== "string"
            ? res.json({ status: 201, message: "success", data: response })
            : res.json(response);

    },
    async UpdateData(req, res) {
        const id = req.params.id;
        const data = req.body;
        const where = `WHERE id = ${id} AND ${Where_Delete}`;
        const response = await query.updateQuery("admin", "U", req, 1, tableName, data, where);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async DeleteData(req, res) {
        const id = req.params.id;
        const where = `WHERE id = ${id} AND ${Where_Delete}`;
        const response = await query.updateStatusDelete("admin", "D", req, 1, tableName, where);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async UnDeleteData(req, res) {
        const id = req.params.id;
        const where = `WHERE id = ${id} AND ${Where_UnDelete}`;
        const response = await query.updateStatusUnDelete("admin", "N", req, 1, tableName, where);
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
    async GetLimit(req, res) {
        const limit = req.params.limit;
        const sqllimt = `LIMIT ${limit}`;
        const response = await query.getQuery("admin", "L", req, 1, tableName, "*", "", "", "", sqllimt);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async DeleteDataBackUp(req, res) {
        const id = req.params.id;
        const where = `WHERE id = ${id} AND ${Where_UnDelete}`;
        const response = await query.deleteQuery("admin", "B", req, 1, tableName, where);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async GetDataDelete(req, res) {
        const where = `WHERE ${Where_UnDelete}`;
        const response = await query.getQuery("admin", "R", req, 1, tableName, "*", where);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
};
module.exports = ListPersonnelController;
