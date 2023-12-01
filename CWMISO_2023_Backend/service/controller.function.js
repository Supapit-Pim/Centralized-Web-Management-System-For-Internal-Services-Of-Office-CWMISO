const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const db = require("./db.config");
const { type } = require("os");
const algorithm = "aes-256-ecb";
const secretKey = "@key@123";
class Controller extends db {
  async EnCodePassword(password) {
    const key = crypto.createHash("sha256").update(secretKey).digest();
    const cipher = crypto.createCipheriv(algorithm, key, null);
    const encryptedPassword = cipher.update(password, "utf8", "hex") + cipher.final("hex");
    return encryptedPassword;
  }
  async DeCodePasswordJWT(encryptedPassword) {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }
  async EnCodeJWT(data) {
    const DataUser = data[0];
    const EnCodePassword = CryptoJS.AES.encrypt(DataUser.password,secretKey).toString();
    DataUser.password = EnCodePassword;
    const payload = { DataUser };
    const options = { expiresIn: "6h" };
    const token = jwt.sign(payload, secretKey, options);
    return token;
  }
  async DeCodeJWT(data) {
    return jwt.verify(data, secretKey, (err, decoded) => {
      return err ? err.message : decoded;
    });
  }
  async CheckJWT_Superadmin(pathpermission, table, req, CRUD = "") {
    if (req.headers.token) {
      const token = req.headers.token;
      const DeCodeData = await this.DeCodeJWT(token);
      if (typeof DeCodeData !== "string") {
        const DataUser = DeCodeData.DataUser;
        const DataDeCode = await this.DeCodePasswordJWT(DataUser.password);
        const whereUser = `WHERE username='${DataUser.username}' AND password='${DataDeCode}'`;
        const datauser = { username: DataUser.username, password: DataDeCode }; // check user after req apl in sql 
        const responses = await this.CheckUser(datauser, 0);
        if (responses != null) {
          if (pathpermission === responses[0].roles) { // roles from GetData and roles from CheckUser            
            const CheckPermission = await this.CheckPermission(req, DataUser, table, CRUD);
            if (CheckPermission != false) {
              const response = await this.getQuery("", "", "", 0, table, "*");
              return response;
            } else {
              return "Not authorized";
            }
          } else {
            return "Not heve roles";
          }
        } else {
          return "Not heve user";
        }
      } else {
        return "JWT Error";
      }
    } else {
      return "Not have token";
    }
  }
  async CheckJWT_Admin(pathpermission, table, req, CRUD) {
    if (req.headers.token) {
      const token = req.headers.token;
      const DeCodeData = await this.DeCodeJWT(token);
      if (typeof DeCodeData !== "string") {
        const DataUser = DeCodeData.DataUser;
        const DataDeCode = await this.DeCodePasswordJWT(DataUser.password);
        const datauser = { username: DataUser.username, password: DataDeCode }; // check user after req apl in sql 
        const responses = await this.CheckUser(datauser, 0);
        if (responses != null && responses.length != 0) {
          if (pathpermission == responses[0].roles) { // roles from GetData and roles from CheckUser
            const CheckPermission = await this.CheckPermission(req, DataUser, table, CRUD);
            if (CheckPermission != false) {
              // const company_id = responses[0].company_id
              // const where = [`company_id = '${company_id}'`]
              return responses;
            } else {
              return "Not authorized";
            }
          } else {
            return "Not roles";
          }
        } else {
          return "Not heve user";
        }
      } else {
        return "JWT Error";
      }
    } else {
      return "Not token";
    }
  }
  async CheckUser(data, encode = 1) {
    let EnCodePassword = data.password
    if (encode == 1) {
      EnCodePassword = await this.EnCodePassword(data.password);
    }
    const tableConditions = [
      { table: 'superadmin', where: `WHERE username = '${data.username}' and password = '${EnCodePassword}'` },
      { table: 'admin', where: `WHERE username = '${data.username}' and password = '${EnCodePassword}' ` },
      { table: 'user', where: `WHERE username = '${data.username}' and password = '${EnCodePassword}' ` }];

    const columns = ['id', 'username', 'password', 'delete_status'];
    const NameAlias = ["roles", "company_id", "list_personnel_id"];
    const aliasNames = [["'superadmin'", "'admin'", "'user'"], ['0', 'company_id', 'company_id'], ['0', '0', 'list_personnel_id']];
    const response = await this.UnionQuery(tableConditions, columns, NameAlias, aliasNames);
    return response
  }
  async CheckPermission(req, DataUser, table, CRUD) {
    const roles_rep = DataUser.roles; //user 
    const table_rep = table; //user
    const crud_rep = CRUD; //R
    const Role_array = ["superadmin", "admin", "user"];
    const Table_array = this.Table_Array
    const position = Table_array.indexOf(table_rep);
    if (roles_rep === Role_array[2]) {
      const user_array = [
        /* 0  */  "",
        /* 1  */  "",
        /* 2  */  "UG",
        /* 3  */  "",
        /* 4  */  "G",
        /* 5  */  "",
        /* 6  */  "",
        /* 7  */  "G",
        /* 8  */  "RG",
        /* 9  */  "G",
        /* 10  */ "",
        /* 11  */ "CRUDGNLB",
        /* 12  */ "RG",
        /* 13  */ "",
        /* 14  */ "CRUDGNLB",
        /* 15  */ "",
        /* 16  */ "",
        /* 17  */ "CRUDGNLB",
      ];
      const action = user_array[position].match(crud_rep)
      return action != ""
        ? action
        : `CRUD ${roles_rep} not have ${crud_rep}`
    }
    else if (roles_rep === Role_array[1]) {
      // const position = Table_array.indexOf(table_rep);
      const user_array = [
      /* 0  */  "",
      /* 1  */  "UG",
      /* 2  */  "CRUDGNLB",
      /* 3  */  "",
      /* 4  */  "RG",
      /* 5  */  "",
      /* 6  */  "RG",
      /* 7  */  "UG",
      /* 8  */  "CRUDGNLB",
      /* 9  */  "CRUDGNLB",
      /* 10  */ "CRUDGNLB",
      /* 11  */ "CRUDGNLB",
      /* 12  */ "CRUDGNLB",
      /* 13  */ "CRUDGNLB",
      /* 14  */ "CRUDGNLB",
      /* 15  */ "CRUDGNLB",
      /* 16  */ "CRUDGNLB",
      /* 17  */ "CRUDGNLB",
      ];
      const action = user_array[position].match(crud_rep)
      return action != ""
        ? action
        : `CRUD ${roles_rep} not have ${crud_rep}`
    }
    else {
      // const position = Table_array.indexOf(table_rep);
      const user_array = [
        "CRUDGNLB", "CRUDGNLB", "CRUDGNLB", "CRUDGNLB", "CRUDGNLB", "CRUDGNLB",
        "CRUDGNLB", "CRUDGNLB", "CRUDGNLB", "CRUDGNLB", "CRUDGNLB", "CRUDGNLB",
        "CRUDGNLB", "CRUDGNLB", "CRUDGNLB", "CRUDGNLB", "CRUDGNLB", "CRUDGNLB",
      ];
      const action = user_array[position].match(crud_rep)
      return action != ""
        ? action
        : `CRUD ${roles_rep} not have ${crud_rep}`
    }
  }
  async CheckAdmin(DataAdmin, table, req) {
    const admin = DataAdmin[0]
    const Table = this.Table_Array.indexOf(table);
    const id = req.params.id;
    const data = req.body
    const dataArray = Object.keys(data).length; // Object to array 

    if (Table == 1) { // admin
      return admin.id == id
        ? dataArray != 0
          ? admin.company_id == data.company_id
            ? admin.id == id
            : `You not authorized change company id ${data.company_id}`
          : admin.id == id
        : `You not authorized CRUD table ${table} id ${id}`;
    }
    else if (Table == 2) { // user
      return dataArray != 0
        ? admin.company_id == data.company_id
          ? admin.company_id
          : `You not authorized change company id ${data.company_id}`
        : admin.company_id
    }
    else if (Table == 7) { // company
      return admin.company_id == id
        ? admin.company_id == id
        : `You not authorized change company id ${id}`
    }
    else if (Table == 8) { // list company
      return dataArray != 0
        ? admin.company_id == data.company_id
          ? admin.company_id
          : `You not authorized change company id ${data.company_id}`
        : admin.company_id
    }
    else if (Table == 9) { // list personnel
      return dataArray != 0
        ? admin.company_id == data.company_id
          ? admin.company_id
          : `You not authorized change company id ${data.company_id}`
        : admin.company_id
    }
    else if (Table == 10) { // list service
      return dataArray != 0
        ? admin.company_id == data.company_id
          ? admin.company_id
          : `You not authorized change company id ${data.company_id}`
        : admin.company_id
    } else {
      return admin.company_id
    }
  }
  async CheckToken(token) {
    const DeCodeData = await this.DeCodeJWT(token);
    return DeCodeData
  }
  async EnImage(response) {
    const namecolumns = response.every((item) => {
      if (item = 'photo') {
        return item = 'photo'
      } else if (item = 'icon') {
        return item = 'icon'
      } else if (item = 'logo') {
        return item = 'logo'
      }
    })
    response.map((data) => {
      return data.namecolumns !== null
        ? data.namecolumns = "data:image/png;base64," + Buffer.from(data.namecolumns).toString('base64')
        : '';
    });
  }
}
module.exports = Controller;
