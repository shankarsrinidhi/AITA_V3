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

//post new objective
app.post("/:project_id/objectives", async(req,res)=>{
    try {
        console.log(req.body);
        const { project_id } = req.params;
        const { title, description } = req.body;
        const newObjective = await pool.query("INSERT INTO objective (objective_title, description, project_id) VALUES($1,$2,$3) RETURNING *",[title,description,project_id]);
        res.json(newObjective.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});



//Get routes 
app.get("/teamName", async(req,res)=>{
    try {
        //const { id } = req.params;
        const teamName =  await pool.query("SELECT team_name FROM Team WHERE team_id = 1");
        res.json(teamName.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});
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

app.get("/:project_id/objectives", async(req,res)=>{
    try {
        const { project_id } = req.params;
        
        const todo =  await pool.query("SELECT * FROM objective WHERE project_id = $1",[project_id]);
        res.json(todo.rows);
        //console.log(todo.rows);

    } catch (err) {
        console.error(err.message);
    }
});

app.get("/:project_id/objectives/check", async(req,res)=>{
    try {
        const { project_id } = req.params;
        
        const todo =  await pool.query("SELECT jsonb_build_object( 'objective_id', o.objective_id, 'objective_title', o.objective_title, 'description', o.description, 'keyresults', jsonb_agg(jsonb_build_object('kr_id', k.kr_id,'key_result', k.key_result))) AS objective FROM objective o LEFT JOIN keyresult k ON o.objective_id = k.objective_id WHERE o.project_id = $1 GROUP BY o.objective_id ORDER BY o.objective_id",[project_id]);
        res.json(todo.rows);
        //console.log(todo.rows);

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

app.get("/:project_id/isMOKRSubmitted", async(req,res)=>{
    try {
        
        const { id } = req.params;
        const mokrSubmitted =  await pool.query("SELECT mokrsubmitted FROM project WHERE project_id = $1",[id]);
        res.json(mokrSubmitted.rows[0]);
        //console.log(res.json(mokrSubmitted.rows[0]));

    } catch (err) {
        console.error(err.message);
    }
});

app.get("/:project_id/mission", async(req,res)=>{
    try {
        console.log("calling mission on load");
        const { project_id } = req.params;
        const mission =  await pool.query("SELECT mission FROM project WHERE project_id = $1",[project_id]);
        res.json(mission.rows[0]);
        console.log(mission.rows[0]);

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

app.put("/:project_id/mission", async(req,res)=>{
    try {
        console.log(req.body);
        const { project_id } = req.params;
        const { mission } = req.body;
        const addMission = await pool.query("UPDATE project SET  mission = ($1) WHERE project_id = ($2)",[mission,project_id]);
        res.json(addMission.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//update objective row on click of the edit pencil icon
///1/objectives/${objective.objective_id}

app.put("/:project_id/objectives/:objective_id", async(req,res)=>{
    try {
        console.log(req.body);
        const { project_id } = req.params;
        const { objective_id } = req.params;
        const { title, description } = req.body;
        const editObjective = await pool.query("UPDATE objective SET objective_title = ($1), description = ($2) WHERE objective_id = ($3) AND project_id = ($4)",[title,description,objective_id,project_id]);
        res.json(editObjective.rows[0]);
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