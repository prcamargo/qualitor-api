# Qualitor-api
Api Qualitor para integração com o webservice Qualitor

### Instalação

1. Clonar repositorio

```bash
git clone https://github.com/prcamargo/qualitor-api.git
cd qualitor-api
```

2. build docker
```bash
docker build -t qualitor-api .
```

3. execute
```bash 
docker run -it -p 5000:5000 -e QUALITOR_DB_HOST=<ip_db_qualitor> \
-e QUALITOR_DB_USR=<usr_db_qualitor> \
-e QUALITOR_DB_PWD=<pass_db_qualitor> \
-e QUALITOR_DB_BASE=<db_name> \
-e QUALITOR_URI= <uri eq.: https://qualitor.com.br/qualitor/ws/services/service.php?wsdl=> \
-e QUALITOR_WS_USR=<usr_qualitor> \
-e QUALITOR_WS_PWD=<pass_qualitor> \
qualitor-api
```