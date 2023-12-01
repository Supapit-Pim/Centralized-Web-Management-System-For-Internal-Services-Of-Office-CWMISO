const mysql = require("mysql2");

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      // // DB in localhost
      host: "localhost",
      user: "root",
      password: "621998024",
      database: "CWMISO2023",
      port: "3306"
    });
    this.Table_SuperAdmin = "superadmin";
    this.Table_Admin = "admin";
    this.Table_User = "user";

    this.Table_Type_All = "type_all";
    this.Table_Type_Company = "type_company";
    this.Table_Type_Form = "type_form";
    this.Table_Type_Social = "type_social";

    this.Table_Company = "company";

    this.Table_List_Company = "list_company";
    this.Table_List_Personnel = "list_personnel";
    this.Table_List_Service = "list_service";
    this.Table_List_Upload = "list_upload";

    this.Table_Status_Company = "status_company";
    this.Table_Status_Social = "status_social";
    this.Table_Status_Upload = "status_upload";

    this.Table_Create_Form = "create_form";
    this.Table_Data_Form = "data_form";
    this.Table_Data_Personnel = "data_personnel";

    this.Table_Array = [
      /* 0  */  "superadmin",
      /* 1  */  "admin",
      /* 2  */  "user",
      /* 3  */  "type_all",
      /* 4  */  "type_company",
      /* 5  */  "type_form",
      /* 6  */  "type_social",
      /* 7  */  "company",
      /* 8  */  "list_company",
      /* 9  */  "list_personnel",
      /* 10 */  "list_service",
      /* 11 */  "list_upload",
      /* 12 */  "status_company",
      /* 13 */  "status_social",
      /* 14 */  "status_upload",
      /* 15 */  "create_form",
      /* 16 */  "data_form",
      /* 17 */  "data_personnel",
    ];

    this.Where_Delete = "delete_status != 1";
    this.Where_UnDelete = "delete_status = 1";
  }
}

module.exports = Database;
