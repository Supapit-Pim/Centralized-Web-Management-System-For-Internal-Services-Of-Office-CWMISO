const QueryFunction = require("../../service/query.function.admin");
const query = new QueryFunction();
const tableName = query.Table_Status_Company;
const Where_Delete = query.Where_Delete;
const Where_UnDelete = query.Where_UnDelete;

const joinTable = [tableName, "list_company", "company"];
const joinColumns = [`${tableName}.*`, `company.id AS company_id`];
const joinConditions = `${tableName}.list_company_id = list_company.id AND list_company.company_id = company.id`;

const StatusCompanyController = {
    async GetData(req, res) {
        const where = `WHERE ${tableName}.${Where_Delete}`;
        const response = await query.joinQuery("admin", "R", req, 1, tableName, joinTable, joinColumns, joinConditions, "JOIN", "", where);
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
        const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_Delete}`;
        const where = `WHERE id = ${id} AND ${Where_Delete}`;
        const response = await query.updateQuery("admin", "U", req, 1, tableName, data, where, joinTable, joinColumns, joinConditions, joinWhere);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async DeleteData(req, res) {
        const id = req.params.id;
        const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_Delete}`;
        const where = `WHERE id = ${id} AND ${Where_Delete}`;
        const response = await query.updateStatusDelete("admin", "D", req, 1, tableName, where, joinTable, joinColumns, joinConditions, joinWhere);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async UnDeleteData(req, res) {
        const id = req.params.id;
        const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_UnDelete}`;
        const where = `WHERE id = ${id} AND ${Where_UnDelete}`;
        const response = await query.updateStatusUnDelete("admin", "N", req, 1, tableName, where, joinTable, joinColumns, joinConditions, joinWhere);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async GetWhere(req, res) {
        const id = req.params.id;
        const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_Delete}`;
        const response = await query.joinQuery("admin", "G", req, 1, tableName, joinTable, joinColumns, joinConditions, "JOIN", "", joinWhere);
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
        const joinWhere = `WHERE ${tableName}.id = ${id} AND ${tableName}.${Where_UnDelete}`;
        const where = `WHERE id = ${id} AND ${Where_UnDelete}`;
        const response = await query.deleteQuery("admin", "B", req, 1, tableName, where, joinTable, joinColumns, joinConditions, joinWhere);
        console.log(response);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
    async GetDataDelete(req, res) {
        const where = `WHERE ${tableName}.${Where_UnDelete}`;
        const response = await query.joinQuery("admin", "R", req, 1, tableName, joinTable, joinColumns, joinConditions, "JOIN", "", where);
        typeof response !== "string"
            ? res.json({ status: 200, message: "success", data: response })
            : res.json({ status: 422, error: response });
    },
};
module.exports = StatusCompanyController;
