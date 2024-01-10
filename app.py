# app.py

from flask import Flask
from route.db import db_bp
from route.qlt import qlt_bp
from dotenv import load_dotenv

#load env
load_dotenv()

app = Flask(__name__)

app.register_blueprint(db_bp)
app.register_blueprint(qlt_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8088)
