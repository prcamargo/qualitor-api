# Use uma imagem base do Python
FROM python:3.8-slim

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de código para o diretório de trabalho
COPY . /app

# Defina a variável de ambiente QUALITOR_URL
ENV QUALITOR_DB_HOST=
ENV QUALITOR_DB_USR=
ENV QUALITOR_DB_PWD=
ENV QUALITOR_DB_BASE=
ENV QUALITOR_URI=
ENV QUALITOR_WS_USR=
ENV QUALITOR_WS_PWD=

# Instale as dependências
RUN pip install -r requirements.txt

# Exponha a porta em que a aplicação estará executando
EXPOSE 5000

# Inicie o servidor Flask
CMD ["python", "app.py"]
