# app.py

import logging
from flask import Flask
import sys
from route.sla_routes import sla_bp
from route.qlt_routes import qlt_bp
from dotenv import load_dotenv

#load env
load_dotenv()

app = Flask(__name__)

# Configurar o logger
log = logging.getLogger(__name__)
log. setLevel(logging.DEBUG)

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
log.addHandler(handler)

app.register_blueprint(sla_bp)
app.register_blueprint(qlt_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8088)
