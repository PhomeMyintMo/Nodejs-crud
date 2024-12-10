var mysql      = require('mysql2');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'phome123',
    database : 'test_db',
    port : 3306
  });

  connection.connect((err) => {
    if (err) {
      throw err;
    }
    else{
        console.log("connected");
    }
  }) 

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      quantity INT DEFAULT 0,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0
  );
`;

connection.query(createTableQuery, (err, result) => {
    if(err){
        throw err
    }else{
        console.log("table created!")
    }
  })

  module.exports = connection;