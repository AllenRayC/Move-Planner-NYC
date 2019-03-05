import numpy as np
import requests

import pymongo
import json

from flask import Flask, jsonify, render_template, redirect, url_for
import scrape_mars as sm


#################################################
# Database Setup
#################################################


#flask app setup
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
@app.route("/home")
def load_index():

     # Create connection variable
    conn = 'mongodb://localhost:27017'

    # Pass connection to the pymongo instance.
    client = pymongo.MongoClient(conn)

    # Connect to a database. Will create one if not already available.
    db = client.planner_db
   
    planner_info = list(db.saved_search.find())

    return render_template('index.html', saved_search=planner_info)


@app.route("/load_costs")
def scrape():
    """Initiate the scraping procedure and store results in mongo"""
    # call nyc api
    url = 'http://data.beta.nyc//dataset/d6ffa9a4-c598-4b18-8caf-14abde6a5755/resource/74cdcc33-512f-439c-a43e-c09588c4b391/download/60dbe69bcd3640d5bedde86d69ba7666geojsonmedianhouseholdincomecensustract.geojson'
    latest_costs = requests.get(url)


    # Create connection variable
    conn = 'mongodb://localhost:27017'

    # Pass connection to the pymongo instance.
    client = pymongo.MongoClient(conn)

    # Connect to a database. Will create one if not already available.
    db = client.mars_db

    # Drops collection if available to remove duplicates
    db.mars.drop()

    # Creates a collection in the database and inserts two documents
    db.mars.insert_many(latest_costs.content)
    
    #return redirect("/home", code=302)
    return (latest_costs.content)

if __name__ == '__main__':
    app.run(debug=True)
