const controller = require("./controller.function");
class Query extends controller {
    rawQuery(sql, values = null) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, [values], (error, results) => {
                error
                    ? reject(error.message)
                    : resolve(results);
            });
        });
    }
    async getQuery(pathpermission, CRUD, req, jwt, table, type_query = "*", where = "",
        group_by = "", order_by = "", limit = "") {
        const sql = `SELECT ${type_query} FROM ${table} ${group_by} ${where} ${order_by} ${limit}`;
        if (jwt == 1) {
            const checkJWT = await this.CheckJWT_Admin(pathpermission, table, req, CRUD);
            console.log("checkJWT", checkJWT)
            if (typeof checkJWT !== "string") {
                const CheckAdmin = await this.CheckAdmin(checkJWT, table, req);
                if (typeof CheckAdmin != "string") {
                    const user = checkJWT[0]
                    const where_company = `AND company_id = ${user.company_id} AND list_personnel_id = ${user.list_personnel_id}`
                    const where_company_2 = `AND company_id = ${user.company_id}`
                    
                    let sqlNew = ''
                    if (table != "company" && table != "list_upload" && table != "type_company" && table != "type_all" && table != "list_personnel" && table != "list_company" && table != "status_company") {
                        sqlNew = `SELECT ${type_query} FROM ${table} ${group_by} ${where} ${where_company} ${order_by} ${limit}`
                    } else if ( table == "list_personnel" || table == "list_company" || table == "status_company") {
                        sqlNew = `SELECT ${type_query} FROM ${table} ${group_by} ${where} ${where_company_2} ${order_by} ${limit}`
                    } else {
                        sqlNew = sql
                    }
                    
                    const SQL = await this.rawQuery(sqlNew)
                    return SQL != ""
                        ? SQL
                        : "Not have query data";
                } else {
                    return CheckAdmin
                }
            } else {
                return checkJWT
            }
        }
        else {
            const SQL = await this.rawQuery(sql);
            return SQL != ""
                ? SQL
                : "Not have query data";
        }
    }
    async insertQuery(pathpermission, CRUD, req, jwt, table, data) {
        const sql = `INSERT INTO ${table} SET ? , delete_status = 0`;
        if (jwt == 1) {
            const checkJWT = await this.CheckJWT_Admin(pathpermission, table, req, CRUD);
            if (typeof checkJWT !== "string") {
                const CheckAdmin = await this.CheckAdmin(checkJWT, table, req);
                if (typeof CheckAdmin != "string") {
                    const SQL = await this.rawQuery(sql, data)
                    return SQL != ""
                        ? SQL
                        : "Not have query data";
                } else {
                    return CheckAdmin
                }
            } else {
                return checkJWT
            }
        } else {
            const SQL = await this.rawQuery(sql, data);
            return SQL != ""
                ? SQL
                : "Not have query data";
        }
    }
    async updateQuery(pathpermission, CRUD, req, jwt, table, data, where, joinTable = "", joinColumns = "", joinConditions = "", joinWhere = "") {
        const sql = `UPDATE ${table} SET ? ${where}`;
        if (jwt == 1) {
            const checkJWT = await this.CheckJWT_Admin(pathpermission, table, req, CRUD);
            if (typeof checkJWT !== "string") {
                const CheckAdmin = await this.CheckAdmin(checkJWT, table, req);
                if (typeof CheckAdmin != "string") {
                    const admin = checkJWT[0]

                    if (table != "list_upload" && table != "data_form" && table != "data_personnel" && table != "status_upload") {
                        const where_company = `AND company_id = ${admin.company_id} AND list_personnel_id = ${admin.list_personnel_id}`
                        const sqlNew = (table != "company")
                            ? `UPDATE ${table} SET ? ${where} ${where_company}`
                            : sql;

                        const SQL = await this.rawQuery(sqlNew, data)
                        return SQL != ""
                            ? SQL.affectedRows != 0
                                ? SQL
                                : `SQL Rows matched = ${SQL.affectedRows}`
                            : "Not have query data";
                    } else {
                        const where_company = `${joinWhere} AND company_id = ${admin.company_id} AND list_personnel_id = ${admin.list_personnel_id}`
                        const join = await this.joinQuery("", "", "", 0, table, joinTable, joinColumns, joinConditions, "JOIN", "", where_company);
                        if (typeof join !== "string") {
                            const SQL = await this.rawQuery(sql, data)
                            return SQL != ""
                                ? SQL.affectedRows != 0
                                    ? SQL
                                    : `SQL Rows matched = ${SQL.affectedRows}`
                                : "Not have query data"
                        } else {
                            return join
                        }
                    }
                } else {
                    return CheckAdmin
                }
            } else {
                return checkJWT
            }
        } else {
            const SQL = await this.rawQuery(sql);
            return SQL != ""
                ? SQL
                : "Not have query data";
        }
    }
    async updateStatusDelete(pathpermission, CRUD, req, jwt, table, where, joinTable = "", joinColumns = "", joinConditions = "", joinWhere = "") {
        const sql = `UPDATE ${table} SET delete_status = 1 ${where}`;
        if (jwt == 1) {
            const checkJWT = await this.CheckJWT_Admin(pathpermission, table, req, CRUD);
            if (typeof checkJWT !== "string") {
                const admin = checkJWT[0]

                if (table != "list_upload" && table != "data_form" && table != "data_personnel" && table != "status_upload") {
                    const where_company = `AND company_id = ${admin.company_id} AND list_personnel_id = ${admin.list_personnel_id}`
                    const sqlNew = `UPDATE ${table} SET delete_status = 1 ${where} ${where_company}`;

                    const SQL = await this.rawQuery(sqlNew)
                    return SQL != ""
                        ? SQL.affectedRows != 0
                            ? SQL
                            : `SQL Rows matched = ${SQL.affectedRows}`
                        : "Not have query data"
                } else {
                    const where_company = `${joinWhere} AND company_id = ${admin.company_id} AND list_personnel_id = ${admin.list_personnel_id}`
                    const join = await this.joinQuery("", "", "", 0, table, joinTable, joinColumns, joinConditions, "JOIN", "", where_company);
                    if (typeof join !== "string") {
                        const SQL = await this.rawQuery(sql)
                        return SQL != ""
                            ? SQL.affectedRows != 0
                                ? SQL
                                : `SQL Rows matched = ${SQL.affectedRows}`
                            : "Not have query data"
                    } else {
                        return join
                    }
                }
            } else {
                return checkJWT
            }
        } else {
            const SQL = await this.rawQuery(sql);
            return SQL != ""
                ? SQL
                : "Not have query data";
        }
    }
    async updateStatusUnDelete(pathpermission, CRUD, req, jwt, table, where, joinTable = "", joinColumns = "", joinConditions = "", joinWhere = "") {
        const sql = `UPDATE ${table} SET delete_status = 0 ${where}`;
        if (jwt == 1) {
            const checkJWT = await this.CheckJWT_Admin(pathpermission, table, req, CRUD);
            if (typeof checkJWT !== "string") {
                const admin = checkJWT[0]
                if (table != "list_upload" && table != "data_form" && table != "data_personnel" && table != "status_upload") {
                    const where_company = `AND company_id = ${admin.company_id} AND list_personnel_id = ${admin.list_personnel_id}`
                    const sqlNew = `UPDATE ${table} SET delete_status = 0 ${where} ${where_company}`;

                    const SQL = await this.rawQuery(sqlNew)
                    return SQL != ""
                        ? SQL.affectedRows != 0
                            ? SQL
                            : `SQL Rows matched = ${SQL.affectedRows}`
                        : "Not have query data"
                } else {
                    const where_company = `${joinWhere} AND company_id = ${admin.company_id} AND list_personnel_id = ${admin.list_personnel_id}`
                    const join = await this.joinQuery("", "", "", 0, table, joinTable, joinColumns, joinConditions, "JOIN", "", where_company);
                    if (typeof join !== "string") {
                        const SQL = await this.rawQuery(sql)
                        return SQL != ""
                            ? SQL.affectedRows != 0
                                ? SQL
                                : `SQL Rows matched = ${SQL.affectedRows}`
                            : "Not have query data"
                    } else {
                        return join
                    }
                }
            } else {
                return checkJWT
            }
        } else {
            const SQL = await this.rawQuery(sql);
            return SQL != ""
                ? SQL
                : "Not have query data";
        }
    }
    async deleteQuery(pathpermission, CRUD, req, jwt, table, where, joinTable = "", joinColumns = "", joinConditions = "", joinWhere = "") {
        const sql = `DELETE FROM ${table} ${where}`;
        if (jwt == 1) {
            const checkJWT = await this.CheckJWT_Admin(pathpermission, table, req, CRUD);
            if (typeof checkJWT !== "string") {

                const admin = checkJWT[0]

                if (table != "list_upload" && table != "data_form" && table != "data_personnel" && table != "status_upload") {
                    const where_company = `AND company_id = ${admin.company_id} AND list_personnel_id = ${admin.list_personnel_id}`
                    const sqlNew = `DELETE FROM ${table} ${where} ${where_company}`;

                    const SQL = await this.rawQuery(sqlNew)
                    return SQL != ""
                        ? SQL.affectedRows != 0
                            ? SQL
                            : `SQL Rows matched = ${SQL.affectedRows}`
                        : "Not have query data"
                } else {
                    const where_company = `${joinWhere} AND company_id = ${admin.company_id} AND list_personnel_id = ${admin.list_personnel_id}`
                    const join = await this.joinQuery("", "", "", 0, table, joinTable, joinColumns, joinConditions, "JOIN", "", where_company);
                    if (typeof join !== "string") {
                        const SQL = await this.rawQuery(sql)
                        return SQL != ""
                            ? SQL.affectedRows != 0
                                ? SQL
                                : `SQL Rows matched = ${SQL.affectedRows}`
                            : "Not have query data"
                    } else {
                        return join
                    }
                }

            } else {
                return checkJWT
            }
        } else {
            const SQL = await this.rawQuery(sql);
            return SQL != ""
                ? SQL
                : "Not have query data";
        }
    }
    async joinQuery(pathpermission, CRUD = "", req, jwt, table, tables, columns, join_conditions, type_join, group_by = "", where = "", having = "", order_by = "") {
        const selectColumns = columns.join(" , ");
        const joinTables = tables.join(` ${type_join} `);
        const joinSql = `SELECT ${selectColumns} FROM ${joinTables} ON ${join_conditions} ${group_by} ${where} ${having} ${order_by};`;
        if (jwt == 1) {
            const checkJWT = await this.CheckJWT_Admin(pathpermission, table, req, CRUD);
            if (typeof checkJWT !== "string") {
                const user = checkJWT[0]
                const where_company = `AND company_id = ${user.company_id} AND list_personnel_id = ${user.list_personnel_id}`
                const where_company_2 = `AND company_id = ${user.company_id} `
                const joinSqlNew = table == 'status_company'
                ? `SELECT ${selectColumns} FROM ${joinTables} ON ${join_conditions} ${group_by} ${where} ${where_company_2} ${having} ${order_by};`
                : `SELECT ${selectColumns} FROM ${joinTables} ON ${join_conditions} ${group_by} ${where} ${where_company} ${having} ${order_by};`;
                 
                const SQL = await this.rawQuery(joinSqlNew)
                return SQL != ""
                    ? SQL.affectedRows != 0
                        ? SQL
                        : `SQL Rows matched = ${SQL.affectedRows}`
                    : "Not have query join data";
            } else {
                return checkJWT
            }
        } else {
            const SQL = await this.rawQuery(joinSql);
            return SQL != ""
                ? SQL
                : "Not have query join data";
        }
    }
    async UnionQuery(tableConditions, columns, NameAlias, aliasNames) {
        const unionQueries = tableConditions.map((condition, index) => {
            const { table, where } = condition;
            var alias = ""
            var tset = ""
            NameAlias.forEach(function (element, index2) {
                if (index2 === 1) {
                    tset = " , "
                }
                alias += `${tset} ${aliasNames[index2][index]} AS ${NameAlias[index2]}`
            });
            return `SELECT ${columns.join(', ')},${alias} FROM ${table} ${where}`;
        });
        const queryString = unionQueries.join(' UNION ');
        const queryRoles = await this.rawQuery(queryString);
        return queryRoles;
    }
}
module.exports = Query;
