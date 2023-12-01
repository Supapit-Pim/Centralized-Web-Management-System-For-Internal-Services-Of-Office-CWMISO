const QueryFunction = require("../../service/query.function.superadmin");
const query = new QueryFunction();
const tableName = query.Table_User;
const Where_Delete = query.Where_Delete;
const Where_UnDelete = query.Where_UnDelete;

const UesrController = {
    async GetData(req, res) {
        const where = `WHERE ${Where_Delete}`;
        const response = await query.getQuery("superadmin", "R", req, 1, tableName,"*", where);
        // if (typeof response !== "string") {
        //   await query.EnImage(response)
        //   res.json({ status: 200, message: "success", data: response })
        // } else {
        //   res.json({ status: 422, error: response });
        // }
        typeof response !== "string"
        ? res.json({ status: 200, message: "success", data: response })
        : res.json({ status: 422, error: response });
      },
      async AddData(req, res) {
        const data = req.body;
        const response = await query.CheckUser(data);
            if (response.length != 0) {
              res.json({ status: 422, error: "username already in use" })
            } else {
              const password = await query.EnCodePassword(req.body.password);
              data.password = password;
              const response = await query.insertQuery("superadmin", "C", req, 1, tableName, data);
              typeof response !== "string"
                ? res.json({ status: 201, message: "success", data: response })
                : res.json(response);
            }
      },
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
                const response = await query.updateQuery("superadmin", "U", req, 1, tableName, data, where);
                typeof response !== "string"
                  ? res.json({ status: 200, message: "success", data: response })
                  : res.json({ status: 422, error: response });
              }
      },
      async DeleteData(req, res) {
        const id = req.params.id;
        const where = `WHERE id = ${id} AND ${Where_Delete}`;
          const response = await query.updateStatusDelete("superadmin", "D", req, 1, tableName, where);
          typeof response !== "string"
          ? res.json({ status: 200, message: "success", data: response })
          : res.json({ status: 422, error: response });
      },
      async UnDeleteData(req, res) {
        const id = req.params.id;
        const where = `WHERE id = ${id} AND ${Where_UnDelete}`;
          const response = await query.updateStatusUnDelete("superadmin", "N", req, 1, tableName, where);
          typeof response !== "string"
          ? res.json({ status: 200, message: "success", data: response })
          : res.json({ status: 422, error: response });
      },
      async GetWhere(req, res) {
        const id = req.params.id;
        const where = `WHERE id = ${id} AND ${Where_Delete}`;
          const response = await query.getQuery("superadmin", "G", req, 1, tableName, "*", where);
          typeof response !== "string"
          ? res.json({ status: 200, message: "success", data: response })
          : res.json({ status: 422, error: response });
      },
      async GetLimit(req, res) {
          const limit = req.params.limit;
          const sqllimt = `LIMIT ${limit}`;
          const response = await query.getQuery("superadmin", "L", req, 1, tableName, "*", "", "", "", sqllimt);
          typeof response !== "string"
          ? res.json({ status: 200, message: "success", data: response })
          : res.json({ status: 422, error: response });
      },
      async DeleteDataBackUp(req, res) {
        const id = req.params.id;
        const where = `WHERE id = ${id} AND ${Where_UnDelete}`;
        const response = await query.deleteQuery("superadmin", "B", req, 1, tableName, where);
        typeof response !== "string"
          ? res.json({ status: 200, message: "success", data: response })
          : res.json({ status: 422, error: response });
      },
      async GetDataDelete(req, res) {
        const where = `WHERE ${Where_UnDelete}`;
        const response = await query.getQuery("superadmin", "R", req, 1, tableName, "*", where);
        typeof response !== "string"
          ? res.json({ status: 200, message: "success", data: response })
          : res.json({ status: 422, error: response });
      },
};

module.exports = UesrController;
