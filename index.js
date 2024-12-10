const fastify = require('fastify')({
  logger: true
})
const fastifyCors = require('@fastify/cors');
const connection = require('./db');
fastify.register(fastifyCors, {
    origin: '*', 
  }); 
  

 

fastify.post('/api/products', (request, reply) => {
    const { name, quantity, price } = request.body;

    if (!name || price === undefined) {
      return reply.status(400).send({ message: "Name and price are required" });
    }

 const insertQuery = `INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)`;
  connection.query(insertQuery, [name, quantity || 0, price], (err, result) => {
    if (err) {
      console.error("Error inserting product:", err.message);
      return reply.status(500).send({ message: "Failed to add product" });
    }
    reply.status(201).send({ message: "Product added successfully", productId: result.insertId });
  });
});

fastify.get('/api/products', (request, reply) => {
    const selectQuery = `SELECT * FROM products`;
    connection.query(selectQuery, (err, result) =>{
      if (err) {
        console.error("Error fetching product:", err.message);
        return reply.status(500).send({ message: "Failed to retrieve product" });
      }
      reply.status(201).send({ message: "Product retrieved successfully", product: result });
    })
  })

  fastify.get('/api/products/:id', (request, reply) => {
    const {id} = request.params;
    const selectQuery = `SELECT * FROM products WHERE id = ?`;
    connection.query(selectQuery, [id] ,(err, result) =>{
      if (err) {
        console.error("Error fetching product:", err.message);
        return reply.status(500).send({ message: "Failed to retrieve product" });
      }
      if(result.length === 0){
        return reply.status(404).send({message : "Product not found"});
      }
      reply.status(201).send({ message: "Product retrieved successfully", product: result });
    })
  })

  fastify.put('/api/products/:id', (request, reply) => {
    const {id} = request.params;
    const {name, quantity, price} = request.body;
    if (!name && quantity === undefined && price === undefined) {
      return reply.status(400).send({ message: "At least one field (name, quantity, or price) is required for update" });
    }
  
    const fields = [];
    const values = [];
    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (quantity !== undefined) {
      fields.push("quantity = ?");
      values.push(quantity);
    }
    if (price !== undefined) {
      fields.push("price = ?");
      values.push(price);
    }
    values.push(id);

    const updateQuery = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;

    connection.query(updateQuery, values ,(err, result) =>{
      if (err) {
        console.error("Error updating product:", err.message);
        return reply.status(500).send({ message: "Failed to update product" });
      }
      if(result.affectedRows === 0){
        return reply.status(404).send({message : "Product not found"});
      }
      reply.status(201).send({ message: "Product updated successfully", product: result });
    })
  })

  fastify.delete('/api/products/:id', (request, reply) => {
    const {id} = request.params;
    const deleteQuery = `DELETE FROM products WHERE id = ?`;
    connection.query(deleteQuery, [id] ,(err, result) =>{
      if (err) {
        console.error("Error deleting product:", err.message);
        return reply.status(500).send({ message: "Failed to delete product" });
      }
      if(result.length === 0){
        return reply.status(404).send({message : "Product not found"});
      }
      reply.status(201).send({ message: "Product deleted successfully", product: result });
    })
  })

  
fastify.listen({ port: 3000 }, (err) => {
    if (err) {throw err}
    else{
      console.log("server running at localhost:3000")
    }
  })
