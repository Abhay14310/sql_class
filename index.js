require("dotenv").config();
const { faker } = require("@faker-js/faker");
const mysql  = require("mysql2");
const express = require("express");
const path = require("path");
const app = express();
const methodoverride = require("method-override");

app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));



const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "delta_app",
    port: Number(process.env.DB_PORT || 3306)
}); 
// let q = "SHOW TABLES";
// // we can use vaiable  that is we can create a variable and store the query in it and then pass it to the query method

let getRandomUser = () => {
  return [
    faker.datatype.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    // avatar: faker.image.avatar(),
    faker.internet.password(),
    // birthdate: faker.date.birthdate(),
    // registeredAt: faker.date.past(),
]  }
;
  // insertint new data
  // let q = "INSERT INTO user (id, username, email, password_hash) VALUES ?";
  // let data = [];
  // for (let i = 1; i <= 100; i++) {
  //   // getRandomUser();
  //   data.push(getRandomUser());
  // }

//   try {
//     connection.query(q, [data], (err, res) => {
//       if (err) throw err;
//       console.log(res);
// connection.end();

//     });
//   } catch (err) {
//     console.log(err);
//   }
  app.get("/", (req, res) => {
    // res.send("welcome to home page !!");
    let q = `SELECT count(*) FROM user`;
    try{
        connection.query(q, (err, result) => {
            if(err) throw err;
            let count = result[0]['count(*)'];
            // res.send(`Total number of users: ${result[0]['count(*)']}`);
            res.render("home.ejs",{count});
        });
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
  });

  //show user route

  app.get("/user", (req,res)=>{
    // res.send("success")
    let q  = `SELECT * FROM user`
    
      try {
        connection.query(q, (err, users) => {
          if (err) throw err;
          // console.log(result);
          // res.send(result);
          res.render("showusers.ejs", { users });
        });
      } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
    });
    app.get("/user/:id/edit",(req,res)=>{
      let {id} = req.params;
      let q = ` SELECT * FROM user WHERE id = '${id}'`;

      try{
        connection.query(q,(err,result)=>{
          if(err) throw err;
          console.log(id);
          console.log(result[0]);
          let user = result[0];
      res.render("edit.ejs",{user})

        });
      }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
      
    });

    app.patch("/user/:id",(req,res)=>{
      // res.send("updated");
      let {id} = req.params;
      let {password:formpass,username :newUsername}=req.body;
      let q =`SELECT * FROM user WHERE id = '${id}'`;
      try{
        connection.query(q,(err,result)=>{
          if(err) throw err;
          let user = result[0];
          if(formpass!==user.password_hash){
            res.send("Incorrect password. Update failed.");
          }else{
            let updateQuery = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
            connection.query(updateQuery, (err, updateResult) => {
              if (err) throw err;
              // res.send("Password is correct. Update successful.");
              res.redirect("/user"); 
            });
          }
          // res.send("Password is correct. Update successful.");
        });
      }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
      };
    });
    app.get("/user/:id/delete",(req,res)=>{
      // res.send("delete user");
      let {id} = req.params;
      // let q = `DELETE FROM user WHERE id = '${id}'`;
      // try{
      //   connection.query(q,(err,result)=>{
      //     if(err) throw err;
      //     res.redirect("/user");
      //   });
      // }catch(err){
      //   console.log(err);
      //   res.status(500).send("Internal Server Error");
      // }
      let q = ` SELECT * FROM user WHERE id = '${id}'`;

      try {
        connection.query(q, (err, result) => {
          if (err) throw err;
          console.log(id);
          console.log(result[0]);
          let user = result[0];
          res.render("delete.ejs", { user });
        });
      } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/user/new",(req, res)=>{
      res.render("newuser.ejs");
    });

    app.post("/user/new",(req,res)=>{
      let {username,email,password} = req.body;
      let id = faker.datatype.uuid();
      let q = `INSERT INTO user (id, email, username, password_hash) VALUES ('${id}', '${email}', '${username}', '${password}')`;
      try{
        connection.query(q,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        });
      }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
    });

    app.delete("/user/:id", (req, res) => {
      // res.send("updated");
      let { id } = req.params;
      let { password: formpass, email: realEmail } = req.body;
      let q = `SELECT * FROM user WHERE id = '${id}'`;
      try {
        connection.query(q, (err, result) => {
          if (err) throw err;
          let user = result[0];
          if (formpass == user.password_hash && realEmail == user.email) {
            let updateQuery = `DELETE FROM user WHERE id = '${id}'`;

            connection.query(updateQuery, (err, updateResult) => {
              if (err) throw err;
              // res.send("Password is correct. Update successful.");
              res.redirect("/user");
            });
          } else {
            res.send("Incorrect password or email. Update failed.");
          }
          // res.send("Password is correct. Update successful.");
        });
      } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
    });

  const port = Number(process.env.PORT || 8080);
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


