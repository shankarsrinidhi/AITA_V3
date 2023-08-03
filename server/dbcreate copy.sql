CREATE SEQUENCE IF NOT EXISTS public."Cohort_cohort_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY cohort.cohort_id;

CREATE SEQUENCE IF NOT EXISTS public."KeyResult_KR_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1
    OWNED BY keyresult.kr_id;

CREATE SEQUENCE IF NOT EXISTS public."Objective_objective_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1
    OWNED BY objective.objective_id;

CREATE SEQUENCE IF NOT EXISTS public."Plan_plan_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1
    OWNED BY plan.plan_id;

CREATE SEQUENCE IF NOT EXISTS public."Problem_problem_id"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1
    OWNED BY problem.problem_id;

CREATE SEQUENCE IF NOT EXISTS public."Progress_progress_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1
    OWNED BY progress.progress_id;

CREATE SEQUENCE IF NOT EXISTS public."Project_project_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1
    OWNED BY project.project_id;

CREATE SEQUENCE IF NOT EXISTS public."Team_team_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY team.team_id;

CREATE SEQUENCE IF NOT EXISTS public."Test_test_id_sequence"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1
    OWNED BY test.id;

CREATE SEQUENCE IF NOT EXISTS public."WeeklyReport_report_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1
    OWNED BY weeklyreport.report_id;

CREATE SEQUENCE IF NOT EXISTS public.todo_todo_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY todo.todo_id;

CREATE TABLE IF NOT EXISTS public.cohort
(
    cohort_id integer NOT NULL DEFAULT nextval('"Cohort_cohort_id_seq"'::regclass),
    cohort_name text COLLATE pg_catalog."default",
    size integer,
    instructor_id character varying(12) COLLATE pg_catalog."default",
    instructor_email character varying(150) COLLATE pg_catalog."default",
    CONSTRAINT "Cohort_pkey" PRIMARY KEY (cohort_id)
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.course
(
    crn character varying(5) COLLATE pg_catalog."default" NOT NULL,
    course_code character varying(8) COLLATE pg_catalog."default",
    course_description text COLLATE pg_catalog."default",
    modality text COLLATE pg_catalog."default",
    class_size integer,
    instructor_id character varying(12) COLLATE pg_catalog."default",
    instructor_email character varying(150) COLLATE pg_catalog."default",
    ta_id character varying(12) COLLATE pg_catalog."default",
    ta_email character varying(150) COLLATE pg_catalog."default",
    CONSTRAINT "Course_pkey" PRIMARY KEY (crn),
    CONSTRAINT "instructor_FK" FOREIGN KEY (instructor_id)
        REFERENCES public.instructor (instructor_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.instructor
(
    instructor_id character varying(9) COLLATE pg_catalog."default" NOT NULL,
    email character varying(150) COLLATE pg_catalog."default",
    phone_number character varying(12) COLLATE pg_catalog."default",
    first_name character varying COLLATE pg_catalog."default",
    last_name character varying COLLATE pg_catalog."default",
    CONSTRAINT "Instructor_pkey" PRIMARY KEY (instructor_id)
)

TABLESPACE pg_default;


CREATE TABLE IF NOT EXISTS public.keyresult
(
    kr_id integer NOT NULL DEFAULT nextval('"KeyResult_KR_id_seq"'::regclass),
    key_result text COLLATE pg_catalog."default",
    objective_id integer,
    assumption text COLLATE pg_catalog."default",
    CONSTRAINT "KeyResult_pkey" PRIMARY KEY (kr_id),
    CONSTRAINT objective_id FOREIGN KEY (objective_id)
        REFERENCES public.objective (objective_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;




CREATE TABLE IF NOT EXISTS public.objective
(
    objective_id integer NOT NULL DEFAULT nextval('"Objective_objective_id_seq"'::regclass),
    objective_title character varying(500) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    assumption text COLLATE pg_catalog."default",
    team_id integer,
    CONSTRAINT "Objective_pkey" PRIMARY KEY (objective_id),
    CONSTRAINT "FK_team_id" FOREIGN KEY (team_id)
        REFERENCES public.team (team_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;




CREATE TABLE IF NOT EXISTS public.plan
(
    plan_id integer NOT NULL DEFAULT nextval('"Plan_plan_id_seq"'::regclass),
    plan_title text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    student text[] COLLATE pg_catalog."default",
    report_id integer,
    assumption text COLLATE pg_catalog."default",
    marked_complete boolean DEFAULT false,
    completed_on timestamp with time zone,
    related_objectives text[] COLLATE pg_catalog."default",
    CONSTRAINT "Plan_pkey" PRIMARY KEY (plan_id),
    CONSTRAINT report_id FOREIGN KEY (report_id)
        REFERENCES public.weeklyreport (report_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;


CREATE TABLE IF NOT EXISTS public.problem
(
    problem_id integer NOT NULL DEFAULT nextval('"Problem_problem_id"'::regclass),
    problem_title text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    mitigation text COLLATE pg_catalog."default",
    report_id integer,
    plan_id integer,
    CONSTRAINT "Problem_pkey" PRIMARY KEY (problem_id),
    CONSTRAINT plan_id FOREIGN KEY (plan_id)
        REFERENCES public.plan (plan_id) MATCH SIMPLE
        ON UPDATE SET NULL
        ON DELETE SET NULL
        NOT VALID,
    CONSTRAINT report_id FOREIGN KEY (report_id)
        REFERENCES public.weeklyreport (report_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;




CREATE TABLE IF NOT EXISTS public.progress
(
    progress_id integer NOT NULL DEFAULT nextval('"Progress_progress_id_seq"'::regclass),
    progress_title text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    student text[] COLLATE pg_catalog."default",
    report_id integer,
    assumption text COLLATE pg_catalog."default",
    completed_on timestamp with time zone,
    plan_id integer,
    related_objectives text[] COLLATE pg_catalog."default",
    CONSTRAINT "Progress_pkey" PRIMARY KEY (progress_id),
    CONSTRAINT plan_id FOREIGN KEY (plan_id)
        REFERENCES public.plan (plan_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
        NOT VALID,
    CONSTRAINT report_id FOREIGN KEY (report_id)
        REFERENCES public.weeklyreport (report_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;



CREATE TABLE IF NOT EXISTS public.project
(
    project_id integer NOT NULL DEFAULT nextval('"Project_project_id_seq"'::regclass),
    project_title character varying(500) COLLATE pg_catalog."default",
    mission text COLLATE pg_catalog."default",
    industry text COLLATE pg_catalog."default",
    team_id integer,
    mokrsubmitted boolean DEFAULT false,
    CONSTRAINT "Project_pkey" PRIMARY KEY (project_id),
    CONSTRAINT team_id FOREIGN KEY (team_id)
        REFERENCES public.team (team_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;



CREATE TABLE IF NOT EXISTS public.student
(
    email character varying COLLATE pg_catalog."default" NOT NULL,
    phone_number character varying(12) COLLATE pg_catalog."default",
    first_name character varying COLLATE pg_catalog."default",
    last_name character varying COLLATE pg_catalog."default",
    CONSTRAINT "Student" PRIMARY KEY (email),
    CONSTRAINT student_id UNIQUE (email)
)

TABLESPACE pg_default;



CREATE TABLE IF NOT EXISTS public.student_teams
(
    email character varying COLLATE pg_catalog."default" NOT NULL,
    team_id integer NOT NULL,
    CONSTRAINT "Student_Teams" PRIMARY KEY (email, team_id),
    CONSTRAINT fk1 FOREIGN KEY (email)
        REFERENCES public.student (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk2 FOREIGN KEY (team_id)
        REFERENCES public.team (team_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;



CREATE TABLE IF NOT EXISTS public.team
(
    team_id integer NOT NULL DEFAULT nextval('"Team_team_id_seq"'::regclass),
    team_name character varying(200) COLLATE pg_catalog."default",
    instructor_id character varying(9) COLLATE pg_catalog."default",
    noncurricular boolean DEFAULT false,
    cohort_id integer,
    "CRN" character varying(5) COLLATE pg_catalog."default",
    mission text COLLATE pg_catalog."default",
    industry text COLLATE pg_catalog."default",
    "MOKRSubmitted" boolean DEFAULT false,
    CONSTRAINT "Team_pkey" PRIMARY KEY (team_id),
    CONSTRAINT "CRN" FOREIGN KEY ("CRN")
        REFERENCES public.course (crn) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT cohort_id FOREIGN KEY (cohort_id)
        REFERENCES public.cohort (cohort_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT instructor_id FOREIGN KEY (instructor_id)
        REFERENCES public.instructor (instructor_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;




CREATE TABLE IF NOT EXISTS public.test
(
    id integer NOT NULL DEFAULT nextval('"Test_test_id_sequence"'::regclass),
    CONSTRAINT test_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;


CREATE TABLE IF NOT EXISTS public.todo
(
    todo_id integer NOT NULL DEFAULT nextval('todo_todo_id_seq'::regclass),
    description character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT todo_pkey PRIMARY KEY (todo_id)
)

TABLESPACE pg_default;



CREATE TABLE IF NOT EXISTS public.weeklyreport
(
    report_id integer NOT NULL DEFAULT nextval('"WeeklyReport_report_id_seq"'::regclass),
    week_start_date date,
    week_end_date date,
    submitted_on timestamp with time zone,
    started boolean DEFAULT false,
    team_id integer,
    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY (report_id),
    CONSTRAINT "FK_Team_id" FOREIGN KEY (team_id)
        REFERENCES public.team (team_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;
