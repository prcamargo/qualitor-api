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
docker run -p 5000:5000 qualitor-api
```