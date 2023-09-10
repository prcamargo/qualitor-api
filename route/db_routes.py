import logging
from flask import Blueprint, jsonify
from db.db import check_sla, reativeTicket
from db.db import closeTicket as db_closeTicket
from datetime import datetime, timedelta 
import requests
import sys
import json

db_bp = Blueprint('db', __name__)

# Configurar o logger
log = logging.getLogger(__name__)
log. setLevel(logging.DEBUG)

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
log.addHandler(handler)

@db_bp.route('/db/sla/', methods=['GET'])
def verificar_sla():
    
    try:
        data = check_sla()

        result = []

        for t in data:
            row_dict = {}

            #converte string datetime 2023-07-11 15:39:49
            data_sup = datetime.strptime(t['data_sup'], '%Y-%m-%d %H:%M:%S')

            sla = timedelta(hours=t['SLA'])

            #calcule a data e hora em que o SLA sera atingido
            data_sla_atingido = data_sup + sla

            #obtenha a data e hra atual
            agora = datetime.now()

            cdchamado = t['cdchamado']
            SLA = t['SLA']

            row_dict['cdchama'] = cdchamado

            if agora >= data_sla_atingido:

                log.info(f'Chamado {cdchamado} estourou o SLA de {SLA}h ')

                row_dict['SLA'] = 'estourou'

                #adicionar nota no chamado
                data = {"cdchamado": str(cdchamado),
                        "cdtipoacompanhamento": "4",
                        "dsacompanhamento": "SLA estourou"
                        }

                resp = requests.post('http://localhost:8088/ws/WSTicket/addTicketHistory', json=data)

                log.info(f'add nota no chamado {cdchamado} resp {resp.status_code}')

                ##change suspensão para em atentimento
                reativeTicket(cdchamado)
                log.info(f'O status do chamado {cdchamado} foi alterado para Em Atendimento ')

            else:
                
                log.info(f'Chamado {cdchamado} nao estourou SLA')

                row_dict['SLA'] = 'Nao estourou'

            result.append(row_dict)     

        #logger.info(f"SLA verificado para data {data} e período {y} horas. Resultado: {resultado}")
        return jsonify({"resultado": result})

    except ValueError as e:
        log.error(f"Erro ao verificar SLA: {e}")
        return jsonify({"Erro": "Formato de data inválido."}), 400

@db_bp.route('/db/close/<cdchamado>', methods=['GET'])
def closeTicket(cdchamado):

    #adicionar nota no chamado
    #data = {"cdchamado": str(cdchamado),
    #        "cdtipoacompanhamento": "4",
    #        "dsacompanhamento": "chamado encerrado"
    #        }

    #resp = requests.post('http://localhost:8088/ws/WSTicket/addTicketHistory', json=data)

    #log.info(f'add nota no chamado {cdchamado} resp {resp.status_code}')

    # fechar chamado query
    db_closeTicket(cdchamado)
    return jsonify({"Ticket close": cdchamado})