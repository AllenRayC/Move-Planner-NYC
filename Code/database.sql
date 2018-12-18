
DROP DATABASE IF EXISTS move_nyc;
CREATE DATABASE move_nyc;
USE move_nyc;

CREATE TABLE high_schools (
	ID int NOT NULL AUTO_INCREMENT,
    advancedplacement_courses VARCHAR(500),
    attendance_rate FLOAT,
    college_career_rate FLOAT,
    graduation_rate FLOAT,
    latitude FLOAT,
	location VARCHAR(100),
	longitude FLOAT,
    overview_paragraph VARCHAR(1000),
    school_email VARCHAR(50),
    school_name VARCHAR(100),
    total_students INT,
    website VARCHAR(100),
    PRIMARY KEY (ID)
);

select * from high_schools;