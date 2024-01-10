from flask import Blueprint, request, jsonify
import os
from zeep import Client
from zeep.helpers import serialize_object

#env
qualitor_ws_usr = os.environ.get('QUALITOR_WS_USR')
qualitor_ws_pwd = os.environ.get('QUALITOR_WS_PWD')
qualitor_ws_uri = os.environ.get('QUALITOR_URI')

qlt_bp = Blueprint('qlt', __name__)

@qlt_bp.route('/ws/<int:cdempresa>/<ws>/<op>/', methods=['POST'])
@qlt_bp.route('/ws/<ws>/<op>/', methods=['POST'])
def qualitor(ws,op,cdempresa):

    try:
        json_data = request.get_json()

        #connect qualitor
        qlt = Client(qualitor_ws_uri+ws)
        token = qlt.service.login(qualitor_ws_usr,qualitor_ws_pwd,cdempresa)

        xml_data = serialize_object(json_data)

        return qlt.service.__getitem__(op)(token,xml_data)

    except Exception as e:
            return str(e)