const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());
//app.use(bodyParser.json({ limit: '30mb', extended: true }));
//app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

//routes 

//post routes
app.post("/todos", async(req,res)=>{
    try {
        console.log(req.body);
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",[description]);
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//get routes 

//all todos
app.get("/todos", async(req,res)=>{
    try {
        //const { id } = req.params;
        const todo =  await pool.query("SELECT * FROM todo");
        res.json(todo.rows);

    } catch (err) {
        console.error(err.message);
    }
});

app.get("/todos/:id", async(req,res)=>{
    try {
        const { id } = req.params;
        const todo =  await pool.query("SELECT * FROM todo WHERE todo_id = $1",[id]);
        res.json(todo.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});

//put routes
app.put("/todos/:id", async(req,res)=>{
    try {
        const { id }= req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id= $2",[description,id]);
        res.json("Successfully updated");
        
    } catch (err) {
        console.error(err.message);
    }
});

//delete routes
app.delete("/todos/:id", async(req,res)=>{
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1",[id]);
        res.json("Deleted");
        
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(5000, ()=>{
    console.log("Server has started ");
});