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
       // console.log(req.body);
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
        //console.log(req.body);
        const { project_id } = req.params;
        const { title, description } = req.body;
        const newObjective = await pool.query("INSERT INTO objective (objective_title, description, project_id) VALUES($1,$2,$3) RETURNING *",[title,description,project_id]);
        res.json(newObjective.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//post new Key result
app.post("/objectives/:objective_id/kr", async(req,res)=>{
    try {
       // console.log(req.body);
        //const { project_id } = req.params;
        const { objective_id } = req.params;
        const { description } = req.body;
        const newKR = await pool.query("INSERT INTO keyresult(key_result, objective_id) VALUES($1,$2) RETURNING *",[description,objective_id]);
        res.json(newKR.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//Post new progress row
//INSERT INTO public.progress( progress_title, description,  report_id) VALUES ('title', 'description', (SELECT report_id FROM weeklyreport WHERE week_start_date = '2022-01-30' AND week_end_date = '2022-02-05' AND project_id = 1));
app.post("/:project_id/report/:start_date/:end_date/progress", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { start_date , end_date } = req.params;
        const { title, description, selectedStudentOptions, selectedObjectives } = req.body;
        const timestamp = new Date();
        const newProg = await pool.query("INSERT INTO progress(progress_title, description, student, related_objectives, completed_on, report_id) VALUES($1,$2,$3,$4,$5,(SELECT report_id FROM weeklyreport WHERE week_start_date = $6 AND week_end_date = $7 AND project_id = $8)) RETURNING *",[title, description, selectedStudentOptions, selectedObjectives, timestamp, start_date, end_date, project_id]);
        res.json(newProg.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//Post new plan
app.post("/:project_id/report/:start_date/:end_date/plan", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { start_date , end_date } = req.params;
        const { title, description, selectedStudentOptions, selectedObjectives } = req.body;
        const timestamp = new Date();
        const newPlan = await pool.query("INSERT INTO plan(plan_title, description, student, related_objectives, report_id) VALUES($1,$2,$3,$4,(SELECT report_id FROM weeklyreport WHERE week_start_date = $5 AND week_end_date = $6 AND project_id = $7)) RETURNING *",[title, description, selectedStudentOptions, selectedObjectives, start_date, end_date, project_id]);
        res.json(newPlan.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//post new problem
app.post("/:project_id/report/:start_date/:end_date/problem", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { start_date , end_date } = req.params;
        const { title, description, mitigation, plan_id } = req.body;
       // const timestamp = new Date();
        const newProblem = await pool.query("INSERT INTO problem(problem_title, description, mitigation, plan_id, report_id) VALUES($1,$2,$3,$4,(SELECT report_id FROM weeklyreport WHERE week_start_date = $5 AND week_end_date = $6 AND project_id = $7)) RETURNING *",[title, description, mitigation, plan_id, start_date, end_date, project_id]);
        res.json(newProblem.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//post start weekly report
app.post("/:project_id/startreport/:start_date/:end_date", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { start_date , end_date } = req.params;
        //const { title, description, mitigation, plan_id } = req.body;
       // const timestamp = new Date();
        const startReport = await pool.query("INSERT INTO weeklyreport(week_start_date, week_end_date, project_id, started) VALUES($1,$2,$3,true) RETURNING *",[start_date , end_date, project_id]);
        res.json(startReport.rows[0]);
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


//home page display past weekly reports cards
//SELECT jsonb_build_object( 'report_id', r.report_id, 'week_start_date', r.week_start_date, 'week_end_date', r.week_end_date, 'submitted_on', r.submitted_on, 'project_id', r.project_id, 'started', r.started, 'progress', jsonb_agg(jsonb_build_object('progress_id', p.progress_id, 'progress_title', p.progress_title))) AS report FROM weeklyreport r LEFT JOIN progress p ON r.report_id = p.report_id WHERE r.project_id = $1 AND r.week_start_date < $2 AND r.submitted_on IS NOT NULL GROUP BY r.report_id ORDER BY r.week_start_date
app.get("/:project_id/pastweeklyreports/check", async(req,res)=>{
    try {
        const { project_id } = req.params;
        
        const todo =  await pool.query("SELECT jsonb_build_object( 'report_id', r.report_id, 'week_start_date', r.week_start_date, 'week_end_date', r.week_end_date, 'submitted_on', r.submitted_on, 'project_id', r.project_id, 'started', r.started, 'progress', jsonb_agg(jsonb_build_object('progress_id', p.progress_id, 'progress_title', p.progress_title))) AS report FROM weeklyreport r LEFT JOIN progress p ON r.report_id = p.report_id WHERE r.project_id = $1 AND r.submitted_on IS NOT NULL GROUP BY r.report_id ORDER BY r.week_start_date DESC",[project_id]);
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
        //console.log("calling mission on load");
        const { project_id } = req.params;
        const mission =  await pool.query("SELECT mission FROM project WHERE project_id = $1",[project_id]);
        res.json(mission.rows[0]);
        //console.log(mission.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});



app.get("/:project_id/report/:report_id/progress", async(req,res)=>{
    try {
       // console.log("calling progress on load");
        const { project_id } = req.params;
        const { report_id } = req.params;
        
        const prog =  await pool.query("SELECT p.progress_id, p.progress_title, p.description, p.student, p.report_id, p.related_objectives, w.week_start_date, w.week_end_date FROM progress p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.report_id = $1",[report_id]);
        res.json(prog.rows);
       // console.log(prog.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});


app.get("/:project_id/report/:start_date/:end_date/progress", async(req,res)=>{
    try {
       // console.log("calling progress on load");
        const { project_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params;
       
        const prog =  await pool.query("SELECT p.progress_id, p.progress_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, w.report_id, w.week_start_date, w.week_end_date FROM progress p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2",[start_date,end_date]);
        res.json(prog.rows);
        //console.log(prog.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});

app.get("/:project_id/report/:start_date/:end_date/completedplans", async(req,res)=>{
    try {
       // console.log("calling completed plans on load");
        const { project_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params; 
       
        const prog =  await pool.query("SELECT p.plan_id, p.plan_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, w.report_id, w.week_start_date, w.week_end_date FROM plan p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND p.marked_complete = true ",[start_date,end_date]);
        res.json(prog.rows);
       // console.log(prog.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});


app.get("/:project_id/report/:start_date/:end_date/uncompletedplans", async(req,res)=>{
    try {
       // console.log("calling uncompleted plans on load");
        const { project_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params; 
       
        const prog =  await pool.query("SELECT p.plan_id, p.plan_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, w.report_id, w.week_start_date, w.week_end_date FROM plan p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND p.marked_complete = false AND w.project_id = $3",[start_date,end_date,project_id]);
        res.json(prog.rows);
       // console.log(prog.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});

//to get list of all planned tasks to be displayed on the home screen
app.get("/:project_id/home/:start_date/:end_date/plannedtasks", async(req,res)=>{
    try {
       // console.log("calling uncompleted plans on load");
        const { project_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params; 
       
        const prog =  await pool.query("SELECT p.plan_id, p.plan_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, p.marked_complete, w.report_id, w.week_start_date, w.week_end_date FROM plan p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND w.project_id = $3",[start_date,end_date,project_id]);
        res.json(prog.rows);
       // console.log(prog.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});


//To display additional completed tasks in weekly report page
//1/report/${week_start}/${week_end}/additionalprogress
app.get("/:project_id/report/:start_date/:end_date/additionalprogress", async(req,res)=>{
    try {
        
        const { project_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params; 
       
        const prog =  await pool.query("SELECT p.progress_id, p.progress_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, p.plan_id, w.report_id, w.week_start_date, w.week_end_date FROM progress p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND p.plan_id IS null",[start_date,end_date]);
        res.json(prog.rows);
       // console.log(prog.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});

app.get("/:project_id/report/:start_date/:end_date/plans", async(req,res)=>{
    try {
        
        const { project_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params; 
       
        const prog =  await pool.query("SELECT p.plan_id, p.plan_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, p.marked_complete, w.report_id, w.week_start_date, w.week_end_date FROM plan p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2",[start_date,end_date]);
        res.json(prog.rows);
        console.log(prog.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});


app.get("/:project_id/report/:start_date/:end_date/problems", async(req,res)=>{
    try {
        
        const { project_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params; 
       
        const prob =  await pool.query("SELECT p.problem_id, p.problem_title, p.description, p.mitigation, p.plan_id, w.report_id, w.week_start_date, w.week_end_date FROM problem p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND w.project_id = $3",[start_date,end_date,project_id]);
        res.json(prob.rows);
      //  console.log(prob.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});



//for select dropdown population
    app.get("/:project_id/studentsdropdown", async(req,res)=>{
        try {
            
            const { project_id } = req.params;
            const students =  await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM student");
            res.json(students.rows);
            
            
    
        } catch (err) {
            console.error(err.message);
        }
    });

    app.get("/:plan_id/progress", async(req,res)=>{
        try {
            
            const { plan_id } = req.params;
            const progress =  await pool.query("SELECT * FROM progress WHERE plan_id = $1 ",[plan_id]);
            res.json(progress.rows[0]);
            
            
    
        } catch (err) {
            console.error(err.message);
        }
    });


    // to check if weekly report is started
    //SELECT EXISTS (SELECT 1 FROM weeklyreport WHERE week_start_date = '2022-02-06' AND week_end_date = '2022-02-12' AND project_id = 1) AS result;
    app.get("/:project_id/reportstarted/:start_date/:end_date", async(req,res)=>{
        try {
            
            const { project_id } = req.params;
            const { start_date } = req.params;
            const { end_date } = req.params; 
            const isWRStarted =  await pool.query("SELECT EXISTS (SELECT 1 FROM weeklyreport WHERE week_start_date = $1 AND week_end_date = $2 AND project_id = $3) AS result",[start_date, end_date, project_id]);
            console.log(isWRStarted.rows[0]);
            res.json(isWRStarted.rows[0]);
            
            
            
    
        } catch (err) {
            console.error(err.message);
        }
    });

    // to check if weekly report is submitted
    app.get("/:project_id/reportsubmitted/:start_date/:end_date", async(req,res)=>{
        try {
            
            const { project_id } = req.params;
            const { start_date } = req.params;
            const { end_date } = req.params; 
            const isWRSubmitted =  await pool.query("SELECT EXISTS (SELECT 1 FROM weeklyreport WHERE week_start_date = $1 AND week_end_date = $2 AND project_id = $3 AND submitted_on IS NOT NULL) AS result",[start_date, end_date, project_id]);
            console.log(isWRSubmitted.rows[0]);
            res.json(isWRSubmitted.rows[0]);
            
            
            
    
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
       // console.log(req.body);
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
       // console.log(req.body);
        const { project_id } = req.params;
        const { objective_id } = req.params;
        const { title, description } = req.body;
        const editObjective = await pool.query("UPDATE objective SET objective_title = ($1), description = ($2) WHERE objective_id = ($3) AND project_id = ($4)",[title,description,objective_id,project_id]);
        res.json(editObjective.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//update key result row on click of the edit pencil icon

app.put("/objectives/:objective_id/kr/:kr_id", async(req,res)=>{
    try {
       // console.log(req.body);
        const { kr_id } = req.params;
        const { objective_id } = req.params;
        const { description } = req.body;
        const editKR = await pool.query("UPDATE keyresult SET key_result = ($1) WHERE kr_id = ($2) AND objective_id = ($3)",[description,kr_id,objective_id]);
        res.json(editKR.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//to mark as incomplete from progress section
app.put("/:project_id/progress/markasincomplete/:plan_id", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { plan_id } = req.params;
        const { plan_title } = req.body;
        const timestamp =  new Date();
        const markIncomplete = await pool.query("UPDATE plan SET marked_complete = false, completed_on = null WHERE plan_id = ($1)",[plan_id]);
        const deleteProgress = await pool.query("DELETE FROM progress WHERE progress_title = ($1)",[plan_title]);
        res.json(markIncomplete.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//to mark previous week's plan as complete from progress section
app.put("/:project_id/progress/:plan_id/markascomplete/:start_date/:end_date", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { start_date , end_date } = req.params;
        const { plan_id } = req.params;
        const { plan_title, description, student, related_objectives } = req.body;
        const timestamp =  new Date();
        const markcomplete = await pool.query("UPDATE plan SET marked_complete = true, completed_on = $1 WHERE plan_id = ($2)",[timestamp, plan_id]);
        const addProgress = await pool.query("INSERT INTO progress (progress_title, description, student, related_objectives, completed_on, plan_id, report_id) VALUES ($1, $2, $3, $4, $5,$6,(SELECT report_id FROM weeklyreport WHERE week_start_date = $7 AND week_end_date = $8 AND project_id = $9)) RETURNING *",[plan_title, description, student, related_objectives, timestamp, plan_id,start_date,end_date,project_id]);
        res.json(markcomplete.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//to edit the progress from completed plans section
app.put("/:project_id/progress/editcompletedplan/:plan_id", async(req,res)=>{
    try {
        // console.log(req.body);
        const { project_id } = req.params;
        const { plan_id } = req.params;
        const { title, description, selectedStudentOptions, selectedObjectives } = req.body;
        const timestamp =  new Date();
        //UPDATE public.plan SET plan_title=$1, description=$2, student=$3, related_objectives=$4, marked_complete=true, completed_on=$5  WHERE WHERE plan_id=$6
        const editPlan = await pool.query("UPDATE plan SET plan_title=$1, description=$2, student=$3, related_objectives=$4, marked_complete=true, completed_on=$5  WHERE plan_id=$6",[title, description, selectedStudentOptions, selectedObjectives, timestamp, plan_id]);
        const editProgress = await pool.query("UPDATE progress SET progress_title=$1, description=$2, student=$3, related_objectives= $4, completed_on=$5, plan_id=$6 WHERE plan_id=$6",[title, description, selectedStudentOptions, selectedObjectives, timestamp, plan_id]);
        res.json(editProgress.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


app.put("/:project_id/progress/editadditionalprogress/:progress_id", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { progress_id } = req.params;
        const { title, description, selectedStudentOptions, selectedObjectives } = req.body;
        const timestamp =  new Date();
        //UPDATE public.plan SET plan_title=$1, description=$2, student=$3, related_objectives=$4, marked_complete=true, completed_on=$5  WHERE WHERE plan_id=$6
        //const editPlan = await pool.query("UPDATE plan SET plan_title=$1, description=$2, student=$3, related_objectives=$4, marked_complete=true, completed_on=$5  WHERE plan_id=$6",[title, description, selectedStudentOptions, selectedObjectives, timestamp, plan_id]);
        const editProgress = await pool.query("UPDATE progress SET progress_title=$1, description=$2, student=$3, related_objectives= $4, completed_on=$5 WHERE progress_id=$6",[title, description, selectedStudentOptions, selectedObjectives, timestamp, progress_id]);
        res.json(editProgress.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//edit plans
app.put("/:project_id/plans/editplan/:plan_id", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { plan_id } = req.params;
        const { title, description, selectedStudentOptions, selectedObjectives } = req.body;
        const timestamp =  new Date();
        //UPDATE public.plan SET plan_title=$1, description=$2, student=$3, related_objectives=$4, marked_complete=true, completed_on=$5  WHERE WHERE plan_id=$6
        //const editPlan = await pool.query("UPDATE plan SET plan_title=$1, description=$2, student=$3, related_objectives=$4, marked_complete=true, completed_on=$5  WHERE plan_id=$6",[title, description, selectedStudentOptions, selectedObjectives, timestamp, plan_id]);
        const editPlan = await pool.query("UPDATE plan SET plan_title=$1, description=$2, student=$3, related_objectives= $4 WHERE plan_id=$5",[title, description, selectedStudentOptions, selectedObjectives, plan_id]);
        res.json(editPlan.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//edit problems
app.put("/:project_id/problems/editproblem/:problem_id", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { problem_id } = req.params;
        const { title, description, mitigation } = req.body;
        const timestamp =  new Date();
        //UPDATE public.plan SET plan_title=$1, description=$2, student=$3, related_objectives=$4, marked_complete=true, completed_on=$5  WHERE WHERE plan_id=$6
        //const editPlan = await pool.query("UPDATE plan SET plan_title=$1, description=$2, student=$3, related_objectives=$4, marked_complete=true, completed_on=$5  WHERE plan_id=$6",[title, description, selectedStudentOptions, selectedObjectives, timestamp, plan_id]);
        const editProblem = await pool.query("UPDATE problem SET problem_title=$1, description=$2, mitigation=$3 WHERE problem_id=$4",[title, description, mitigation, problem_id]);
        res.json(editProblem.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//mark weekly report as submitted
app.put("/:project_id/submitreport/:start_date/:end_date", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { start_date , end_date } = req.params;
        //const { title, description, mitigation, plan_id } = req.body;
        const timestamp = new Date();
        const submitReport = await pool.query("UPDATE weeklyreport SET submitted_on = $1 WHERE week_start_date = $2 AND week_end_date = $3 AND project_id = $4",[timestamp, start_date , end_date, project_id]);
        res.json(submitReport.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//delete/remove from the screen the plan of a previous week from progress section
app.put("/:project_id/progress/remove/:plan_id", async(req,res)=>{
    try {
       // console.log(req.body);
        const { project_id } = req.params;
        const { plan_id } = req.params;
        const removePlan = await pool.query("UPDATE plan SET marked_complete = null, completed_on = null WHERE plan_id = ($1)",[plan_id]);
        res.json(removePlan.rows[0]);
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
});

app.delete("/:project_id/objectives/:objective_id", async(req,res)=>{
    try {
       // console.log("checking delete objective ");
        const { project_id } = req.params;
        const { objective_id } = req.params;
        //console.log("objective id is "+ objective_id);
        const deleteKR = await pool.query("DELETE from keyresult WHERE objective_id = $1",[objective_id]);
        const deleteObjective = await pool.query("DELETE FROM objective WHERE objective_id = $1 AND project_id = $2",[objective_id,project_id]);
        res.json("Deleted");
        
    } catch (err) {
        console.error(err.message);
    }
});


app.delete("/objectives/:objective_id/kr/:kr_id", async(req,res)=>{
    try {
       // console.log("checking delete KR ");
        const { kr_id } = req.params;
        const { objective_id } = req.params;
       // console.log("objective id is "+ objective_id);
        const deleteKR = await pool.query("DELETE from keyresult WHERE objective_id = $1 AND kr_id = $2",[objective_id,kr_id]);
        
        res.json("Deleted");
        
    } catch (err) {
        console.error(err.message);
    }
});

//Delete Progress on click of dumpster icon in Additional Completed Tasks Section
app.delete("/:project_id/report/progress/:progress_id", async(req,res)=>{
    try {
        const { progress_id } = req.params;
        const deleteProg = await pool.query("DELETE from progress WHERE progress_id = $1",[progress_id]);
        
        res.json("Deleted");
        
    } catch (err) {
        console.error(err.message);
    }
});


app.delete("/:project_id/report/plan/:plan_id", async(req,res)=>{
    try {
        const { plan_id } = req.params;
        const deletePlan = await pool.query("DELETE from plan WHERE plan_id = $1",[plan_id]);
        
        res.json("Deleted");
        
    } catch (err) {
        console.error(err.message);
    }
});

app.delete("/:project_id/report/problem/:problem_id", async(req,res)=>{
    try {
        const { problem_id } = req.params;
        const deleteProblem = await pool.query("DELETE from problem WHERE problem_id = $1",[problem_id]);
        
        res.json("Deleted");
        
    } catch (err) {
        console.error(err.message);
    }
});


app.listen(5000, ()=>{
    console.log("Server has started ");
});