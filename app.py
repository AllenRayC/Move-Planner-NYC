import os

import pandas as pd
import numpy as np
import itertools

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

import pandas as pd
import datetime as dt

from flask import Flask, jsonify, render_template
#from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
#CORS(app)

#################################################
# Database Setup
#################################################

# reflect an existing database into a new model
Base = automap_base()

engine = create_engine("mysql://root:raynor1128@localhost/move_nyc")

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table

High_Schools = Base.classes.high_schools
#app.config['MYSQL_DATABASE_DB'] = 'high_schools'
My_user_settings = Base.classes.user_settings

session = Session(engine)

@app.route("/")
def index():
    """Return the homepage."""
    session = Session(engine)
    settings_info = session.query(My_user_settings.field_name, My_user_settings.field_value) \
        .filter(My_user_settings.user_name == 'default').all()

    #convert the results to a dictionary of field/value pairs
    d = dict(itertools.zip_longest(*[iter(list(np.ravel(settings_info)))] * 2, fillvalue=""))
    saved_settings = jsonify(d)

    return render_template("index.html", user_settings=saved_settings)

@app.route("/user_settings")
def user_settings():
    """Return the homepage."""
    session = Session(engine)
    settings_info = session.query(My_user_settings.field_name, My_user_settings.field_value) \
        .filter(My_user_settings.user_name == 'default').all()

    #convert the results to a dictionary of field/value pairs
    d = dict(itertools.zip_longest(*[iter(list(np.ravel(settings_info)))] * 2, fillvalue=""))
    saved_settings = jsonify(d)
    return saved_settings

@app.route('/summary')
def summary():
    results = session.query(High_Schools.school_name, High_Schools.graduation_rate).all()
    all_names = list(np.ravel(results))
    return jsonify(all_names)


@app.route("/highschool/<school_name>")
def highschool(school_name):
    sel = [
        High_Schools.school_name,
        High_Schools.advancedplacement_courses,
        High_Schools.attendance_rate,
        High_Schools.college_career_rate,
        High_Schools.graduation_rate,
        High_Schools.location,
        High_Schools.overview_paragraph,
        High_Schools.school_email,
        High_Schools.total_students,
        High_Schools.website
    ]
    
    #results = session.query(High_Schools.school_name).all()
    results = session.query(*sel).filter(High_Schools.school_name == school_name).all()
    #results = db.session.query("select * from high_schools")
    # Use Pandas to perform the sql query
    #stmt = db.session.query(HighSchools).statement
    #df = pd.read_sql_query(stmt, db.session.bind)
    
    #all_names = list(np.ravel(results))
    school_info = {}
    for result in results:
        school_info["school_name"] = result[0]
        school_info["advancedplacement_courses"] = result[1]
        school_info["attendance_rate"] = result[2]
        school_info["college_career_rate"] = result[3]
        school_info["graduation_rate"] = result[4]
        school_info["location"] = result[5]
        school_info["overview_paragraph"] = result[6]
        school_info["school_email"] = result[7]
        school_info["total_students"] = result[8]
        school_info["website"] = result[9]

    # Return a list of the column names (sample names)
    #return jsonify(list(df.columns)[2:])
    return jsonify(school_info)
    #return jsonify(all_names)
"""

@app.route("/metadata/<sample>")
def sample_metadata(sample):
    #Return the MetaData for a given sample.
    sel = [
        Samples_Metadata.sample,
        Samples_Metadata.ETHNICITY,
        Samples_Metadata.GENDER,
        Samples_Metadata.AGE,
        Samples_Metadata.LOCATION,
        Samples_Metadata.BBTYPE,
        Samples_Metadata.WFREQ,
    ]

    results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()

    # Create a dictionary entry for each row of metadata information
    sample_metadata = {}
    for result in results:
        sample_metadata["sample"] = result[0]
        sample_metadata["ETHNICITY"] = result[1]
        sample_metadata["GENDER"] = result[2]
        sample_metadata["AGE"] = result[3]
        sample_metadata["LOCATION"] = result[4]
        sample_metadata["BBTYPE"] = result[5]
        sample_metadata["WFREQ"] = result[6]

    print(sample_metadata)
    return jsonify(sample_metadata)


@app.route("/samples/<sample>")
def samples(sample):
    #Return `otu_ids`, `otu_labels`,and `sample_values`.
    stmt = db.session.query(Samples).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1
    sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]
    # Format the data to send as json
    data = {
        "otu_ids": sample_data.otu_id.values.tolist(),
        "sample_values": sample_data[sample].values.tolist(),
        "otu_labels": sample_data.otu_label.tolist(),
    }
    return jsonify(data)
"""

if __name__ == "__main__":
    app.run()
