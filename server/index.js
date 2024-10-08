const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());
const authenticateFirebaseToken = require('./middleware/firebase');

//routes 

//post routes

//post new objective
app.post("/:team_id/objectives", authenticateFirebaseToken,  async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { title, description } = req.body;
        const newObjective = await pool.query("INSERT INTO objective (objective_title, description, team_id) VALUES($1,$2,$3) RETURNING *",[title,description,team_id]);
        res.json(newObjective.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//post new Key result
app.post("/objectives/:objective_id/kr", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { objective_id } = req.params;
        const { description } = req.body;
        const newKR = await pool.query("INSERT INTO keyresult(key_result, objective_id) VALUES($1,$2) RETURNING *",[description,objective_id]);
        res.json(newKR.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//Post new progress row
app.post("/:team_id/report/:start_date/:end_date/progress", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date , end_date } = req.params;
        const { title, description, selectedStudentOptions, selectedObjectives } = req.body;
        const timestamp = new Date();
        const newProg = await pool.query("INSERT INTO progress(progress_title, description, student, related_objectives, completed_on, report_id) VALUES($1,$2,$3,$4,$5,(SELECT report_id FROM weeklyreport WHERE week_start_date = $6 AND week_end_date = $7 AND team_id = $8)) RETURNING *",[title, description, selectedStudentOptions, selectedObjectives, timestamp, start_date, end_date, team_id]);
        res.json(newProg.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//Post new plan
app.post("/:team_id/report/:start_date/:end_date/plan", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date , end_date } = req.params;
        const { title, description, selectedStudentOptions, selectedObjectives } = req.body;
        const timestamp = new Date();
        const newPlan = await pool.query("INSERT INTO plan(plan_title, description, student, related_objectives, report_id) VALUES($1,$2,$3,$4,(SELECT report_id FROM weeklyreport WHERE week_start_date = $5 AND week_end_date = $6 AND team_id = $7)) RETURNING *",[title, description, selectedStudentOptions, selectedObjectives, start_date, end_date, team_id]);
        res.json(newPlan.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//post new problem
app.post("/:team_id/report/:start_date/:end_date/problem", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date , end_date } = req.params;
        const { title, description, mitigation, plan_id } = req.body;
        const newProblem = await pool.query("INSERT INTO problem(problem_title, description, mitigation, plan_id, report_id) VALUES($1,$2,$3,$4,(SELECT report_id FROM weeklyreport WHERE week_start_date = $5 AND week_end_date = $6 AND team_id = $7)) RETURNING *",[title, description, mitigation, plan_id, start_date, end_date, team_id]);
        res.json(newProblem.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//post start weekly report
app.post("/:team_id/startreport/:start_date/:end_date", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date , end_date } = req.params;
        const startReport = await pool.query("INSERT INTO weeklyreport(week_start_date, week_end_date, team_id, started) VALUES($1,$2,$3,true) RETURNING *",[start_date , end_date, team_id]);
        res.json(startReport.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//post new student on signup
app.post("/student/new", async(req,res)=>{
    try {
        const { email, firstName , lastName } = req.body;
        const newStudent = await pool.query("INSERT INTO users (email, first_name, last_name, new) VALUES($1,$2,$3, true) RETURNING *",[email , firstName, lastName]);
        res.json(newStudent.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// post new team on sql
app.post("/newTeam", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { name, industry, selectedStudentOptions, selectedInstructorOptions } = req.body;
        const newTeam = await pool.query("INSERT INTO team (team_name, industry) VALUES($1,$2) RETURNING team_id",[name, industry]);
        const check = newTeam.rows[0].team_id;
        const addStudents = await pool.query(" SELECT insert_students_to_teams($1, $2)",[selectedStudentOptions,check]);
        const addInstructors = await pool.query(" SELECT insert_students_to_teams($1, $2)",[selectedInstructorOptions,check]);
        res.json(newTeam.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// post new course in database and add instructor_course data
app.post("/newCourse", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { crn, courseCode, courseTitle, courseModality, selectedInstructorOptions, email } = req.body;
        const newCourse = await pool.query("INSERT INTO course(crn, course_code, course_description, modality, lead_instructor) VALUES($1,$2,$3,$4,$5) RETURNING course_id",[crn, courseCode, courseTitle, courseModality, email]);
        const check = newCourse.rows[0].course_id;
        const addInstructors = await pool.query(" SELECT insert_instructors_to_courses($1, $2)",[selectedInstructorOptions,check]);
        res.json(newCourse.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


// post new instructor on newUser signup page
app.post("/newInstructor", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { email } = req.body;
        const newInstructor = await pool.query("INSERT INTO instructor (instructor_email, first_name, last_name) VALUES ($1::VARCHAR, (SELECT first_name FROM users WHERE email = $1), (SELECT last_name FROM users WHERE email = $1))",[email]);
        res.json("updated");
    } catch (err) {
        console.error(err.message);
    }
});

//to insert a request entry into the teams_request table
app.post("/:team_id/requestToJoin", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { email } = req.body;
        const {team_id} = req.params;
        const addRequest =  await pool.query("INSERT INTO team_requests(requestor_email, team_id, status) VALUES ($1, $2, 'pending')",[email, team_id]);
        res.json("Inserted");
    } catch (err) {
        console.error(err.message);
    }
});


//to insert a request entry into the course_request table
app.post("/:course_id/requestToJoinCourse", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { email } = req.body;
        const {course_id} = req.params;
        const addRequest =  await pool.query("INSERT INTO course_requests(requestor_email, course_id, status) VALUES ($1, $2, 'pending')",[email, course_id]);
        res.json("Inserted");
    } catch (err) {
        console.error(err.message);
    }
});


//Get routes 

//Get team ids for a given user
app.post("/teams", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { id } = req.body;
        const teams =  await pool.query("SELECT team_name, team_id FROM team WHERE team_id IN (SELECT team_id FROM users s JOIN student_teams st ON s.email = st.email WHERE s.email = $1 GROUP BY st.team_id) ORDER BY team_id",[id]);
        res.json(teams.rows);
    } catch (err) {
        console.error("in this /teams "+err.message);
    }
});


//Get course ids for a given instructor
app.post("/courses", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { id } = req.body;
        const courses =  await pool.query("SELECT course_description, course_id, course_code FROM course WHERE course_id IN (SELECT ic.course_id FROM instructor i JOIN instructor_courses ic ON i.instructor_email = ic.instructor_email WHERE i.instructor_email = $1 GROUP BY ic.course_id) ORDER BY course_id",[id]);
        res.json(courses.rows);
    } catch (err) {
        console.error("in this /courses "+err.message);
    }
});

app.get("/courseteams/:course_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { course_id } = req.params;
        const teams =  await pool.query("SELECT * FROM team WHERE course_id = $1",[course_id]);
        res.json(teams.rows);
    } catch (err) {
        console.error("in this /courseteams "+err.message);
    }
});

//Get current team details
app.get("/teamdetails/:id",  async(req,res)=>{
    try {
        const { id } = req.params;
        const teams =  await pool.query("SELECT  t.team_id, t.team_name, t.industry, jsonb_agg(jsonb_build_object('email', st.email, 'isInstructor', s.isInstructor, 'full_name', concat(s.first_name,' ', s.last_name))) AS students FROM team t LEFT JOIN student_teams st ON t.team_id = st.team_id LEFT JOIN users s ON st.email = s.email WHERE t.team_id = $1 GROUP BY t.team_id",[id]);
        res.json(teams.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//Get course details to display on the edit course page
app.get("/coursedetails/:id",  async(req,res)=>{
    try {
        const { id } = req.params;
        const teams =  await pool.query("SELECT  c.course_id, c.crn, c.course_code, c.course_description, c.modality, jsonb_agg(jsonb_build_object('email', ic.instructor_email, 'full_name', concat(i.first_name,' ', i.last_name))) AS instructors FROM course c LEFT JOIN instructor_courses ic ON c.course_id = ic.course_id LEFT JOIN instructor i ON ic.instructor_email = i.instructor_email WHERE c.course_id = $1 GROUP BY c.course_id",[id]);
        res.json(teams.rows);
    } catch (err) {
        console.error(err.message);
    }
});


//Get team name details to display on the header
app.get("/:id/teamName",  authenticateFirebaseToken, async(req,res)=>{
    try {
        const { id } = req.params;
        const teamName =  await pool.query("SELECT team_name FROM team WHERE team_id = $1",[id]);
        res.json(teamName.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//Get course name details to display on the header
app.get("/:id/courseName",  authenticateFirebaseToken, async(req,res)=>{
    try {
        const { id } = req.params;
        const courseName =  await pool.query("SELECT course_code, course_description FROM course WHERE course_id = $1",[id]);
        res.json(courseName.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//Get all objectives for a project
app.get("/:team_id/objectives", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const todo =  await pool.query("SELECT * FROM objective WHERE team_id = $1",[team_id]);
        res.json(todo.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//Get all the objectives with their corresponding key results
app.get("/:team_id/objectives/check", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const todo =  await pool.query("SELECT jsonb_build_object( 'objective_id', o.objective_id, 'objective_title', o.objective_title, 'description', o.description, 'keyresults', jsonb_agg(jsonb_build_object('kr_id', k.kr_id,'key_result', k.key_result))) AS objective FROM objective o LEFT JOIN keyresult k ON o.objective_id = k.objective_id WHERE o.team_id = $1 GROUP BY o.objective_id ORDER BY o.objective_id",[team_id]);
        res.json(todo.rows);
    } catch (err) {
        console.error(err.message);
    }
});



//Get the problem list of the past week of all teams to display on inst home page
app.get("/:course_id/problems/:week_start/:week_end/check", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { course_id, week_start, week_end } = req.params;
        const todo =  await pool.query("SELECT t.team_id, t.team_name, jsonb_agg(jsonb_build_object('problem_id', p.problem_id, 'problem_title', p.problem_title, 'description', p.description, 'mitigation', p.mitigation)) AS team_problems FROM team t JOIN weeklyreport r ON t.team_id = r.team_id JOIN problem p ON p.report_id = r.report_id JOIN course c ON c.course_id = t.course_id WHERE r.week_start_date = $1 AND r.week_end_date = $2 AND c.course_id = $3 GROUP BY t.team_id, t.team_name ORDER BY t.team_id",[week_start, week_end, course_id]);
        res.json(todo.rows);
    } catch (err) {
        console.error(err.message);
    }
});


//Get the list of teams that did not submit the weekly reports to display on inst home page
app.get("/:course_id/notsubmitted/:week_start/:week_end/check", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { course_id, week_start, week_end } = req.params;
        const teams =  await pool.query("SELECT t.team_id, t.team_name FROM team t WHERE t.team_id NOT IN (SELECT w.team_id FROM weeklyreport w JOIN team t ON w.team_id = t.team_id JOIN course c ON c.course_id = t.course_id  WHERE week_start_date = $1 AND week_end_date = $2 AND submitted_on IS NOT null) AND t.course_id = $3",[ week_start, week_end, course_id]);
        res.json(teams.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//Get the list of teams that submitted the weekly reports late to display on inst home page
app.get("/:course_id/latesubmission/:week_start/:week_end/check", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { course_id, week_start, week_end } = req.params;
        const teams =  await pool.query("SELECT t.team_id, t.team_name FROM weeklyreport w JOIN team t ON w.team_id = t.team_id JOIN course c ON c.course_id = t.course_id  WHERE week_start_date = $1 AND week_end_date = $2 AND submitted_on IS NOT NULL AND submitted_on > week_end_date AND c.course_id = $3",[ week_start, week_end, course_id]);
        res.json(teams.rows);
    } catch (err) {
        console.error(err.message);
    }
});


//get details for home page display past weekly reports cards
app.get("/:team_id/pastweeklyreports/check", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const todo =  await pool.query("SELECT jsonb_build_object( 'report_id', r.report_id, 'week_start_date', r.week_start_date, 'week_end_date', r.week_end_date, 'submitted_on', r.submitted_on, 'team_id', r.team_id, 'started', r.started, 'progress', jsonb_agg(jsonb_build_object('progress_id', p.progress_id, 'progress_title', p.progress_title))) AS report FROM weeklyreport r LEFT JOIN progress p ON r.report_id = p.report_id WHERE r.team_id = $1 AND r.submitted_on IS NOT NULL GROUP BY r.report_id ORDER BY r.week_start_date DESC",[team_id]);
        res.json(todo.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// check for MOKR submission
app.get("/:team_id/isMOKRSubmitted", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { id } = req.params;
        const mokrSubmitted =  await pool.query("SELECT mokrsubmitted FROM project WHERE team_id = $1",[id]);
        res.json(mokrSubmitted.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//mission of the project
app.get("/:team_id/mission", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const mission =  await pool.query("SELECT mission FROM team WHERE team_id = $1",[team_id]);
        res.json(mission.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//get details of the progress 
app.get("/:team_id/report/:report_id/progress", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { report_id } = req.params;
        const prog =  await pool.query("SELECT p.progress_id, p.progress_title, p.description, p.student, p.report_id, p.related_objectives, w.week_start_date, w.week_end_date FROM progress p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.report_id = $1 AND w.team_id = $2",[report_id, team_id]);
        res.json(prog.rows);
    } catch (err) {
        console.error(err.message);
    }
});


app.get("/:team_id/report/:start_date/:end_date/progress", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params;
        const prog =  await pool.query("SELECT p.progress_id, p.progress_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, w.report_id, w.week_start_date, w.week_end_date FROM progress p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND w.team_id = $3",[start_date,end_date, team_id]);
        res.json(prog.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get progress details of plans from past week that is completed (to display in completed plans section)
app.get("/:team_id/report/:start_date/:end_date/completedplans", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params;
        const prog =  await pool.query("SELECT p.plan_id, p.plan_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, w.report_id, w.week_start_date, w.week_end_date FROM plan p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND p.marked_complete = true AND w.team_id = $3",[start_date,end_date, team_id]);
        res.json(prog.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get plans details from past week that have not been marked complete (to display in uncompleted plans section)
app.get("/:team_id/report/:start_date/:end_date/uncompletedplans", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params; 
        const prog =  await pool.query("SELECT p.plan_id, p.plan_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, w.report_id, w.week_start_date, w.week_end_date FROM plan p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND p.marked_complete = false AND w.team_id = $3",[start_date,end_date,team_id]);
        res.json(prog.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//to get list of all planned tasks to be displayed on the home screen
app.get("/:team_id/home/:start_date/:end_date/plannedtasks", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params; 
        const prog =  await pool.query("SELECT p.plan_id, p.plan_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, p.marked_complete, w.report_id, w.week_start_date, w.week_end_date FROM plan p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND w.team_id = $3",[start_date,end_date,team_id]);
        res.json(prog.rows);
    } catch (err) {
        console.error(err.message);
    }
});


//To display additional completed tasks in weekly report page
app.get("/:team_id/report/:start_date/:end_date/additionalprogress", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params; 
        const prog =  await pool.query("SELECT p.progress_id, p.progress_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, p.plan_id, w.report_id, w.week_start_date, w.week_end_date FROM progress p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND p.plan_id IS null AND w.team_id = $3",[start_date,end_date,team_id]);
        res.json(prog.rows);
    } catch (err) {
        console.error(err.message);
    }
});


//to display current week plans in plans section
app.get("/:team_id/report/:start_date/:end_date/plans", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params;
        const prog =  await pool.query("SELECT p.plan_id, p.plan_title, p.description, p.student, p.related_objectives, p.assumption, p.completed_on, p.marked_complete, w.report_id, w.week_start_date, w.week_end_date FROM plan p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND w.team_id = $3",[start_date,end_date,team_id]);
        res.json(prog.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//to display problems in problems section of weekly report page
app.get("/:team_id/report/:start_date/:end_date/problems", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date } = req.params;
        const { end_date } = req.params;
        const prob =  await pool.query("SELECT p.problem_id, p.problem_title, p.description, p.mitigation, p.plan_id, w.report_id, w.week_start_date, w.week_end_date FROM problem p JOIN weeklyreport w ON p.report_id = w.report_id WHERE w.week_start_date = $1 AND w.week_end_date = $2 AND w.team_id = $3",[start_date,end_date,team_id]);
        res.json(prob.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//for select dropdown population
    app.get("/:team_id/studentsdropdown", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { team_id } = req.params;
            const students =  await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users s JOIN student_teams st ON s.email = st.email WHERE st.team_id =$1",[team_id]);
            res.json(students.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    // for dropdown of all students of the app to add to the new team
    app.post("/fullstudentsdropdown", authenticateFirebaseToken, async(req,res)=>{
        try {
           const {id} = req.body;
            const students =  await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS full_name, email FROM users s WHERE s.email != $1 AND s.isInstructor IS NOT true",[id]);
            res.json(students.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    
    // fetch the user details upon logging in
    app.post("/fetchUserDetails", authenticateFirebaseToken, async(req,res)=>{
        try {
           const {id} = req.body;
            const user =  await pool.query("SELECT * FROM users WHERE email = $1",[id]);
            res.json(user.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    // for dropdown of all instructors of the app to add to the new team
    app.post("/fullinstructorsdropdown", authenticateFirebaseToken, async(req,res)=>{
        try {
           const {id} = req.body;
            const students =  await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS full_name, instructor_email FROM instructor i WHERE i.instructor_email != $1",[id]);
            res.json(students.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    // for dropdown of all students not part of the team for edit team page
    app.post("/teamstudentsdropdown/:team_id", authenticateFirebaseToken, async(req,res)=>{
        try {
            const {team_id} = req.params;
           const {id} = req.body;
            const students =  await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS full_name, s.email FROM users s WHERE s.email NOT IN (SELECT s.email FROM users s JOIN student_teams st ON s.email = st.email WHERE st.team_id =$1) AND s.isInstructor IS false",[team_id]);
            res.json(students.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    // for dropdown of all students not part of the team for edit team page
    app.post("/teaminstructorsdropdown/:team_id", authenticateFirebaseToken, async(req,res)=>{
        try {
            const {team_id} = req.params;
           const {id} = req.body;
            const students =  await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS full_name, s.email FROM users s WHERE s.email NOT IN (SELECT s.email FROM users s JOIN student_teams st ON s.email = st.email WHERE st.team_id =$1) AND s.isInstructor IS true",[team_id]);
            res.json(students.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    app.get("/:plan_id/progress", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { plan_id } = req.params;
            const progress =  await pool.query("SELECT * FROM progress WHERE plan_id = $1 ",[plan_id]);
            res.json(progress.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    });


    // to check if weekly report is started
        app.get("/:team_id/reportstarted/:start_date/:end_date", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { team_id } = req.params;
            const { start_date } = req.params;
            const { end_date } = req.params; 
            const isWRStarted =  await pool.query("SELECT EXISTS (SELECT 1 FROM weeklyreport WHERE week_start_date = $1 AND week_end_date = $2 AND team_id = $3) AS result",[start_date, end_date, team_id]);
            res.json(isWRStarted.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    });

    // to check if weekly report is submitted
    app.get("/:team_id/reportsubmitted/:start_date/:end_date", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { team_id } = req.params;
            const { start_date } = req.params;
            const { end_date } = req.params; 
            const isWRSubmitted =  await pool.query("SELECT EXISTS (SELECT 1 FROM weeklyreport WHERE week_start_date = $1 AND week_end_date = $2 AND team_id = $3 AND submitted_on IS NOT NULL) AS result",[start_date, end_date, team_id]);
            res.json(isWRSubmitted.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    });

    // to check if user is part of any team
    app.get("/userteam/:email", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { email } = req.params;
            const userTeam =  await pool.query("SELECT EXISTS (SELECT team_id FROM users s JOIN student_teams st ON s.email = st.email WHERE s.email = $1 GROUP BY st.team_id) AS result",[email]);
            res.json(userTeam.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    });

    // to get dropdown list of courses
    app.get("/courses", authenticateFirebaseToken, async(req,res)=>{
        try {
            const courses =  await pool.query("SELECT * FROM course ORDER BY course_code ASC");
            res.json(courses.rows);
        } catch (err) {
            console.error(err.message);
        }
    });


    // to get dropdown list of teams part of that course
    app.post("/course/allTeams", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { email } = req.body;
            const courseTeams =  await pool.query("SELECT * FROM team WHERE team_lead != $1 OR team_lead IS NULL AND course_id IN (SELECT course_id FROM course_students WHERE email = $1) AND team_id NOT IN (SELECT team_id FROM team_requests WHERE requestor_email = $1 AND (status = 'pending' OR status = 'accepted'))",[email]);
            res.json(courseTeams.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    // to get dropdown list of teams requested to join
      app.post("/course/requestedTeams", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { email } = req.body;
            const courseTeams =  await pool.query("SELECT * FROM team WHERE team_id IN (SELECT team_id FROM team_requests WHERE requestor_email = $1 AND status = 'pending' )",[email]);
            res.json(courseTeams.rows);
        } catch (err) {
            console.error(err.message);
        }
    });


    // to get dropdown list of courses the instructor has not requested to join
    app.post("/unrequestedCourses", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { email } = req.body;
            const courseTeams =  await pool.query("SELECT * FROM course WHERE lead_instructor != $1 AND course_id NOT IN (SELECT course_id FROM course_requests WHERE requestor_email = $1 AND (status = 'pending' OR status = 'accepted'))",[email]);
            res.json(courseTeams.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    // to get dropdown list of courses an instructor has requested to join
    app.post("/requestedCourses", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { email } = req.body;
            const requestedCourses =  await pool.query("SELECT * FROM course WHERE course_id IN (SELECT course_id FROM course_requests WHERE requestor_email = $1 AND status = 'pending' )",[email]);
            res.json(requestedCourses.rows);
        } catch (err) {
            console.error(err.message);
        }
    });


  
    //to get dropdown list of teams you lead
    app.post("/course/ledTeams", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { email } = req.body;
            const courseTeams =  await pool.query("SELECT * FROM team WHERE team_lead = $1 AND course_id IN (SELECT course_id FROM course_students WHERE email = $1)",[email]);
            res.json(courseTeams.rows);
        } catch (err) {
            console.error(err.message);
        }
    });


    //to get dropdown list of teams you lead
    app.post("/ledCourses", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { email } = req.body;
            const ledCourses =  await pool.query("SELECT * FROM course WHERE lead_instructor = $1",[email]);
            res.json(ledCourses.rows);
        } catch (err) {
            console.error(err.message);
        }
    });


    //to get list of all students who had requested to join the team in Edit Team Page
    app.get("/requestsToJoinTeam/:team_id", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { team_id } = req.params;
            const requests =  await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS full_name, u.email, tr.request_id FROM users u JOIN team_requests tr ON u.email = tr.requestor_email WHERE tr.team_id = $1 AND tr.status = 'pending'",[team_id]);
            res.json(requests.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    //to get list of all instructors who had requested to join the team in Edit Course Page
    app.get("/instructorRequestsToJoinCourse/:course_id", authenticateFirebaseToken, async(req,res)=>{
        try {
            const { course_id } = req.params;
            const requests =  await pool.query("SELECT CONCAT(first_name, ' ', last_name) AS full_name, u.email, tr.request_id FROM instructor u JOIN course_requests tr ON u.email = tr.requestor_email WHERE tr.course_id = $1 AND tr.status = 'pending'",[course_id]);
            res.json(requests.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    


//put routes

//add mission details
app.put("/:team_id/mission", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { mission } = req.body;
        const addMission = await pool.query("UPDATE team SET  mission = ($1) WHERE team_id = ($2)",[mission,team_id]);
        res.json(addMission.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//update objective row on click of the edit pencil icon
app.put("/:team_id/objectives/:objective_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { objective_id } = req.params;
        const { title, description } = req.body;
        const editObjective = await pool.query("UPDATE objective SET objective_title = ($1), description = ($2) WHERE objective_id = ($3) AND team_id = ($4)",[title,description,objective_id,team_id]);
        res.json(editObjective.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//update key result row on click of the edit pencil icon
app.put("/objectives/:objective_id/kr/:kr_id", authenticateFirebaseToken, async(req,res)=>{
    try {
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
app.put("/:team_id/progress/markasincomplete/:plan_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { plan_id } = req.params;
        const { plan_title } = req.body;
        const markIncomplete = await pool.query("UPDATE plan SET marked_complete = false, completed_on = null WHERE plan_id = ($1)",[plan_id]);
        const deleteProgress = await pool.query("DELETE FROM progress WHERE progress_title = ($1)",[plan_title]);
        res.json(markIncomplete.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//to mark previous week's plan as complete from progress section
app.put("/:team_id/progress/:plan_id/markascomplete/:start_date/:end_date", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date , end_date } = req.params;
        const { plan_id } = req.params;
        const { plan_title, description, student, related_objectives } = req.body;
        const timestamp =  new Date();
        const markcomplete = await pool.query("UPDATE plan SET marked_complete = true, completed_on = $1 WHERE plan_id = ($2)",[timestamp, plan_id]);
        const addProgress = await pool.query("INSERT INTO progress (progress_title, description, student, related_objectives, completed_on, plan_id, report_id) VALUES ($1, $2, $3, $4, $5,$6,(SELECT report_id FROM weeklyreport WHERE week_start_date = $7 AND week_end_date = $8 AND team_id = $9)) RETURNING *",[plan_title, description, student, related_objectives, timestamp, plan_id,start_date,end_date,team_id]);
        res.json(markcomplete.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//to edit the progress from completed plans section
app.put("/:team_id/progress/editcompletedplan/:plan_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { plan_id } = req.params;
        const { title, description, selectedStudentOptions, selectedObjectives } = req.body;
        const timestamp =  new Date();
        const editPlan = await pool.query("UPDATE plan SET plan_title=$1, description=$2, student=$3, related_objectives=$4, marked_complete=true, completed_on=$5  WHERE plan_id=$6",[title, description, selectedStudentOptions, selectedObjectives, timestamp, plan_id]);
        const editProgress = await pool.query("UPDATE progress SET progress_title=$1, description=$2, student=$3, related_objectives= $4, completed_on=$5, plan_id=$6 WHERE plan_id=$6",[title, description, selectedStudentOptions, selectedObjectives, timestamp, plan_id]);
        res.json(editProgress.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// to edit additional progress
app.put("/:team_id/progress/editadditionalprogress/:progress_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { progress_id } = req.params;
        const { title, description, selectedStudentOptions, selectedObjectives } = req.body;
        const timestamp =  new Date();
        const editProgress = await pool.query("UPDATE progress SET progress_title=$1, description=$2, student=$3, related_objectives= $4, completed_on=$5 WHERE progress_id=$6",[title, description, selectedStudentOptions, selectedObjectives, timestamp, progress_id]);
        res.json(editProgress.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//edit plans
app.put("/:team_id/plans/editplan/:plan_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { plan_id } = req.params;
        const { title, description, selectedStudentOptions, selectedObjectives } = req.body;
        const timestamp =  new Date();
        const editPlan = await pool.query("UPDATE plan SET plan_title=$1, description=$2, student=$3, related_objectives= $4 WHERE plan_id=$5",[title, description, selectedStudentOptions, selectedObjectives, plan_id]);
        res.json(editPlan.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//edit problems
app.put("/:team_id/problems/editproblem/:problem_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { problem_id } = req.params;
        const { title, description, mitigation } = req.body;
        const timestamp =  new Date();
        const editProblem = await pool.query("UPDATE problem SET problem_title=$1, description=$2, mitigation=$3 WHERE problem_id=$4",[title, description, mitigation, problem_id]);
        res.json(editProblem.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//mark weekly report as submitted
app.put("/:team_id/submitreport/:start_date/:end_date", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { start_date , end_date } = req.params;
        const timestamp = new Date();
        const submitReport = await pool.query("UPDATE weeklyreport SET submitted_on = $1 WHERE week_start_date = $2 AND week_end_date = $3 AND team_id = $4",[timestamp, start_date , end_date, team_id]);
        res.json(submitReport.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//delete/remove from the screen the plan of a previous week from progress section
app.put("/:team_id/progress/remove/:plan_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { plan_id } = req.params;
        const removePlan = await pool.query("UPDATE plan SET marked_complete = null, completed_on = null WHERE plan_id = ($1)",[plan_id]);
        res.json(removePlan.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


//edit team functionality in edit team page
app.put("/editTeam/:team_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const {team_id} = req.params;
        const { name, industry, selectedStudentOptions } = req.body;
        const newTeam = await pool.query("UPDATE team SET team_name = $1, industry = $2 WHERE team_id=$3",[name, industry,team_id]);
        const addStudents = await pool.query(" SELECT insert_students_to_teams($1, $2)",[selectedStudentOptions,team_id]);
        res.json("updated");
    } catch (err) {
        console.error(err.message);
    }
});

//edit new user info
app.put("/newuser", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { email, selectedOption, selectedOptionCourse } = req.body;
        const newUser = await pool.query("UPDATE users SET new = false, type = $1, course_id = $2 WHERE email =$3",[selectedOption, selectedOptionCourse, email]);
        res.json("updated");
    } catch (err) {
        console.error(err.message);
    }
});

//When user cancels their request
app.put("/:team_id/cancelRequest", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { email} = req.body;
        const {team_id} = req.params;
        const newUser = await pool.query("UPDATE team_requests SET status = 'cancelled' WHERE requestor_email =$1 AND team_id = $2",[email, team_id]);
        res.json("updated");
    } catch (err) {
        console.error(err.message);
    }
});

//When an instructor cancels their request to join a course
app.put("/:course_id/cancelRequestCourse", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { email} = req.body;
        const {course_id} = req.params;
        const cancelReq = await pool.query("UPDATE course_requests SET status = 'cancelled' WHERE requestor_email =$1 AND course_id = $2",[email, course_id]);
        res.json("updated");
    } catch (err) {
        console.error(err.message);
    }
});

//When the team lead rejects another student's request to join the team
app.put("/:team_id/rejectStudentRequest", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { email, request_id } = req.body;
        const {team_id} = req.params;
        const cancelReq = await pool.query("UPDATE team_requests SET status = 'rejected' WHERE requestor_email =$1 AND team_id = $2 AND request_id = $3",[email, team_id, request_id]);
        res.json("updated");
    } catch (err) {
        console.error(err.message);
    }
});

//When the lead instructor rejects another instructor's request to join the course
app.put("/:course_id/rejectInstructorRequest", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { email, request_id } = req.body;
        const {course_id} = req.params;
        const cancelReq = await pool.query("UPDATE course_requests SET status = 'rejected' WHERE requestor_email =$1 AND course_id = $2 AND request_id = $3",[email, course_id, request_id]);
        res.json("updated");
    } catch (err) {
        console.error(err.message);
    }
});

//When the team lead accepts another student's request to join the team
app.put("/:team_id/acceptStudentRequest", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { email, request_id} = req.body;
        const {team_id} = req.params;
        const acceptReq = await pool.query("UPDATE team_requests SET status = 'accepted' WHERE requestor_email =$1 AND team_id = $2 AND request_id = $3",[email, team_id, request_id]);
        const postStudentTeams = await pool.query("INSERT INTO student_teams (email, team_id) VALUES ($1, $2) ",[email, team_id]);
        res.json("updated");
    } catch (err) {
        console.error(err.message);
    }
});

//When the lead instructor accepts another instructor's request to join the team
app.put("/:course_id/acceptInstructorRequest", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { email, request_id} = req.body;
        const {course_id} = req.params;
        const acceptReq = await pool.query("UPDATE course_requests SET status = 'accepted' WHERE requestor_email =$1 AND course_id = $2 AND request_id = $3",[email, course_id, request_id]);
        const postStudentTeams = await pool.query("INSERT INTO instructor_courses (email, course_id) VALUES ($1, $2) ",[email, course_id]);
        res.json("updated");
    } catch (err) {
        console.error(err.message);
    }
});



//delete routes

//delete objectives and KRs (check cascading)
app.delete("/:team_id/objectives/:objective_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const { objective_id } = req.params;
        const deleteKR = await pool.query("DELETE from keyresult WHERE objective_id = $1",[objective_id]);
        const deleteObjective = await pool.query("DELETE FROM objective WHERE objective_id = $1 AND team_id = $2",[objective_id,team_id]);
        res.json("Deleted");
    } catch (err) {
        console.error(err.message);
    }
});

//delete KR
app.delete("/objectives/:objective_id/kr/:kr_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { kr_id } = req.params;
        const { objective_id } = req.params;
        const deleteKR = await pool.query("DELETE from keyresult WHERE objective_id = $1 AND kr_id = $2",[objective_id,kr_id]);
        res.json("Deleted");
    } catch (err) {
        console.error(err.message);
    }
});

//Delete Progress on click of dumpster icon in Additional Completed Tasks Section
app.delete("/:team_id/report/progress/:progress_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { progress_id } = req.params;
        const deleteProg = await pool.query("DELETE from progress WHERE progress_id = $1",[progress_id]);
        res.json("Deleted");
    } catch (err) {
        console.error(err.message);
    }
});

//delete plans
app.delete("/:team_id/report/plan/:plan_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { plan_id } = req.params;
        const deletePlan = await pool.query("DELETE from plan WHERE plan_id = $1",[plan_id]);
        res.json("Deleted");
    } catch (err) {
        console.error(err.message);
    }
});

//delete problem
app.delete("/:team_id/report/problem/:problem_id", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { problem_id } = req.params;
        const deleteProblem = await pool.query("DELETE from problem WHERE problem_id = $1",[problem_id]);
        res.json("Deleted");
    } catch (err) {
        console.error(err.message);
    }
});

//delete student from team
app.delete("/:team_id/removestudent", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { team_id } = req.params;
        const {email} = req.body;
        const deleteStudent = await pool.query("DELETE from student_teams WHERE email = $1 AND team_id =$2",[email,team_id]);
        res.json("Deleted");
    } catch (err) {
        console.error(err.message);
    }
});

//delete instructor from course
app.delete("/:course_id/removeinstructor", authenticateFirebaseToken, async(req,res)=>{
    try {
        const { course_id } = req.params;
        const {email} = req.body;
        const deleteStudent = await pool.query("DELETE from instructor_courses WHERE email = $1 AND course_id =$2",[email,course_id]);
        res.json("Deleted");
    } catch (err) {
        console.error(err.message);
    }
});


app.listen(5000, ()=>{
    console.log("Server has started ");
});