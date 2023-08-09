import logging
from flask import Blueprint, request, jsonify
from pyqualitor import QualitorWS
import xmltodict
import sys,os

#env
qualitor_ws_usr = os.environ.get('QUALITOR_WS_USR')
qualitor_ws_pwd = os.environ.get('QUALITOR_WS_PWD')
qualitor_ws_uri = os.environ.get('QUALITOR_URI')

qlt_bp = Blueprint('qlt', __name__)

# Configurar o logger
log = logging.getLogger(__name__)
log. setLevel(logging.DEBUG)

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
log.addHandler(handler)

@qlt_bp.route('/ws/<ws>/<op>', methods=['POST'])
def qualitor(ws,op):

    json_data = request.get_json()

    #conectando ao qualitor
    qws = QualitorWS(qualitor_ws_uri+ws)
    qws.login(qualitor_ws_usr, qualitor_ws_pwd, '2')

    try:
        #obter metodo 
        metodo = getattr(qws, op, None)

        if callable(metodo):
            
            res = metodo(**json_data)
            
            return jsonify(xmltodict.parse(res))
        else:
            return f'Metodo não encontrado'
        
    except Exception as e:
        log.error(f'Erro ao chamar metodo {str(e)}')
        return f'Erro ao chamar metodo: {str(e)}'
