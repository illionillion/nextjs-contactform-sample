// src/lib/connection.ts

import mysql from "mysql2/promise";

const mysql_connection = async () =>
  await mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "password",
    database: "contactform",
  });

export default mysql_connection;
