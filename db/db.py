# db.py
import os
import pymssql
import logging
import sys,os

#env
qualitor_db_usr = os.environ.get('QUALITOR_DB_USR')
qualitor_db_pwd = os.environ.get('QUALITOR_DB_PWD')
qualitor_db_host = os.environ.get('QUALITOR_DB_HOST')
qualitor_db_base = os.environ.get('QUALITOR_DB_BASE')

print(qualitor_db_usr)
print(qualitor_db_pwd)
print(qualitor_db_host)
print(qualitor_db_base)

# Configurar o logger
log = logging.getLogger(__name__)
log. setLevel(logging.DEBUG)

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
log.addHandler(handler)

conn = pymssql.connect(server=qualitor_db_host, user=qualitor_db_usr, password=qualitor_db_pwd, database=qualitor_db_base)
cursor = conn.cursor() 

def check_sla():

    QUERY = '''
        -- QUERY PARA SELECIONAR CHAMADOS E ICS
        select
            A.cdchamado as 'Código do Chamado',
            B.cdic as 'Código do IC',
            C.nmic as 'Nome do IC',
            D.vlinformacao as 'SLA',
            max(E.dtacompanhamento) as 'Data da Ultima Suspensão'
        from 
            hd_chamado A
            join hd_chamadoic B ON A.cdchamado = B.cdchamado
            join gc_ic C ON B.cdic = C.cdic
            join gc_icinfo D ON C.cdic = D.cdic
            join hd_acompanhamento E ON A.cdchamado = E.cdchamado
        where 
            A.cdcategoria in(14773,6611,6600) -- CATEGORIAS DE LINK WAN
            and
            A.cdsituacao = 5 -- SUSPENSO
            and
            D.cdinformacao = 107 -- Especifica Informação Adicional (SLA)
            and
            E.dsacompanhamento like'%suspenso%'
        group by
            A.cdchamado,B.cdic,C.nmic,D.vlinformacao
        ''' 
    cursor.execute(QUERY)
    data = cursor.fetchall()

    result = []
    
    for row in data:

        row_dict = {}
    
        try:
            row_dict["cdchamado"] = row[0]
        except IndexError:
            pass
        
        try:
            row_dict["cdic"] = row[1]
        except IndexError:
            pass
        
        try:
            row_dict["nmic"] = row[2]
        except IndexError:
            pass
        
        
        try:
            row_dict["SLA"] = int(row[3])
        except ValueError:
            row_dict["SLA"] = 0
        
        try:
            row_dict["data_sup"] = row[4].strftime('%Y-%m-%d %H:%M:%S')
        except (IndexError, AttributeError):
            pass

        result.append(row_dict)

    return result

def reativeTicket(cdchamado):

    QUERY= f'''
        UPDATE hd_chamado
        SET cdsituacao = 3,cdsubsituacao = 2074
        WHERE cdchamado = '{cdchamado}';
        '''
    try:
        #commit query
        cursor.execute(QUERY)
        conn.commit()
        log.info(f'commit no db {cdchamado}')

    except Exception as e:
        # Caso haja algum erro, fazer rollback
        conn.rollback()
        log.info(f'Erro {cdchamado} {e}')
        print("Erro:", e)

def closeTicket(cdchamado):

    # alterar cdsituação para 3 
    QUERY= f'''
        UPDATE hd_chamado
        SET cdsituacao = 7,cdsubsituacao= 2077
        WHERE cdchamado = '{cdchamado}';
        '''
    try:
        #commit query
        cursor.execute(QUERY)
        conn.commit()
        log.info(f'commit no db {cdchamado}')
        return f'close ticket {cdchamado}'

    except Exception as e:
        # Caso haja algum erro, fazer rollback
        conn.rollback()
        log.info(f'Erro {cdchamado} {e}')
        print("Erro:", e)