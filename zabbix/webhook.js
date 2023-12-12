var params = JSON.parse(value),
result = {tags: {}};

function sendMessage(url,fields) {
    try{
        req = new HttpRequest();
        req.addHeader('Content-Type: application/json');
        resp = req.post(url, JSON.stringify(fields));
        if (req.getStatus() != 200) {
            Zabbix.log(4, '[Qualitor Webhook]Error ' + resp);
            throw 'Response: ' + req.getStatus();
        }
        resp = JSON.parse(resp);
        if (resp.wsqualitor.response_status.status == 0 && resp.wsqualitor.response_data == null && resp.wsqualitor.response_status.msg != 'Ws - This ticket have no next step.'){
            Zabbix.log(4, '[Qualitor Webhook] url: ' + url + ' Error: ' + JSON.stringify(resp));
            throw 'Error: ' + JSON.stringify(resp);
        }
        return JSON.stringify(resp);
    }
    catch (e) {
        Zabbix.log(4, '[Qualitor  Webhook] send failed ' + e +' url' + url);
        throw 'send failed ' + e +' url ' + url;
    }
}

function findTicket(url,dspalavrachave,nmtitulochamado) {

    fields = {};
    fields.dspalavrachave = dspalavrachave;
    fields.nmtitulochamado = nmtitulochamado;

    resp = sendMessage(url,fields);
    resp = JSON.parse(resp);
    Zabbix.log(4, JSON.stringify(resp));
    return resp.wsqualitor.response_data.dataitem.cdchamado;
    
}

function ticketStep(cdchamado) {

}

//abrir ticket
if (params.event_value == 1 && params.event_updata_status == 0) {
    Zabbix.log(4, '[Qualitor Webhook] Open Ticket - find ic');
    //procurando IC method getic
    fields = {};
    fields.nmic = params.host_name;
    url = params.event_uri + 'WSIc/getIc';
    resp = sendMessage(url,fields);

    //procurando cdic method getdataic
    resp = JSON.parse(resp);
    fields = {};
    fields.cdic = resp.wsqualitor.response_data.dataitem.cdic;
    url = params.event_uri + 'WSIc/getIcData';
    resp = sendMessage(url,fields);

    //criando json para abertura de chamado
    resp = JSON.parse(resp);
    fields = {};
    fields.cdcliente = resp.wsqualitor.response_data.dataitem.cdcliente;
    fields.cdcontato = resp.wsqualitor.response_data.dataitem.cdcontato;
    fields.cdic = resp.wsqualitor.response_data.dataitem.cdic;
    fields.idchamado = '4';
    fields.cdcategoria = params.cdcategoria;
    fields.nmtitulochamado = params.trigger_name;
    fields.cdtipochamado = '9';
    fields.cdlocalidade = '2';
    fields.cdseveridade = '6';
    fields.dschamado = params.message;
    fields.dspalavrachave = 'zbx' + params.event_id;
    fields.cdorigem = '21';

    Zabbix.log(3, JSON.stringify(fields))

    url = params.event_uri + 'WSTicket/addTicketByData';
    resp = sendMessage(url, fields);

    Zabbix.log(3, '[Qualitor Webhook] Open ticket ' + resp);
    resp = JSON.parse(resp);
    cdchamado = resp.wsqualitor.response_data.dataitem.cdchamado;
    result.tags.zbx_qlt_ticket = cdchamado;
    result.tags.zbx_qlt_ticketlink = 'https://portal.vantix.com.br/html/hd/hdincidente/cadastro_incidente.php?cdchamado=' + cdchamado;
    return JSON.stringify(result);
}
//encerrar chamado
else if ( params.event_value == 0){

    if (params.qlt_ticket == null) {
        Zabbix.log(3,'[Qualitor Webhook] chamado n encontrado event ' + params.event_id);
        throw 'chamado n encontrado event ' + params.event_id;
    }

    Zabbix.log(4, '[Qualitor Webhook] chamado: ' + params.qlt_ticket);
    //convert string
    cdchamado = "" + params.qlt_ticket;

    //iniciar chamado
    fields = {};
    fields.cdchamado = cdchamado;

    Zabbix.log(3, '[Qualitor Webhook] verificar se chamado ja foi iniciado');
    url = params.event_uri + 'WSTicket/getTicketData';
    resp = sendMessage(url,fields);
    resp = JSON.parse(resp);
    if (resp.wsqualitor.response_data.dataitem.nmsituacao == 'Aguardando atendimento') {
        Zabbix.log(3, '[Qualitor Webhook] iniciando chamado ' + cdchamado);
        url = params.event_uri + 'WSTicket/startTicket';
        sendMessage(url,fields);
    }

   //avancando etapa para chamado de link down
   if (params.cdcategoria == 14773) {
        do {
            //procurar etapa
            url = params.event_uri + 'WSTicket/getTicketNextSteps';
            resp = sendMessage(url,fields);
            Zabbix.log(4,'[Qualitor Webhook] ' + resp);
            resp = JSON.parse(resp);
            if (resp.wsqualitor.response_data != null) {
                dataItems = resp.wsqualitor.response_data.dataitem;
            } else {
                return "OK"
            }
            
            targetNmetapa = 'De "N1 - Em tratativa" para "Encerrado"';
            targetEntry = null;

            for (var i = 0; i < dataItems.length; i++) {
                /*if (dataItems[i].nmetapa === targetNmetapa1) {*/
                var nmetapa = dataItems[i].nmetapa;
                if (nmetapa.match(/Encerrado/)) {
                    targetEntry = dataItems[i];
                    break;
                } 
            }

            //avancando etapa
            url = params.event_uri + 'WSTicket/setTicketStep';
            if (targetEntry) {
                cdetapa = targetEntry.cdetapa;
            } else {
                cdetapa = dataItems.cdetapa;
            }
            
            fields.cdetapa = "" + cdetapa;
            Zabbix.log(4, 'etapa ' + cdetapa)
            fields.nmidentificador = "zbx";
            resp = sendMessage(url,fields); //avançando etapa
            Zabbix.log(4, '[Qualitor Webhook] ' + resp);
            resp = JSON.parse(resp);

        } while ( resp.wsqualitor.response_status.msg != 'Ws - This ticket have no next step.' );
        return JSON.stringify(resp);

        /*
        url =  'http://localhost:8088/db/close/' + cdchamado;
        req = new HttpRequest();
        //req.addHeader('Content-Type: application/json');
        resp = req.get(url);
        if (req.getStatus() != 200) {
            Zabbix.log(4, '[Qualitor Webhook]Error ' + resp);
            throw 'Response: ' + req.getStatus();
        }
        return JSON.stringify(resp);
        */
    } else { 
        //encerrando chamado

        url = params.event_uri + 'WSTicket/closeTicket';
        fields.idfecharrelacionados = 'Y';
        resp = sendMessage(url,fields);
        Zabbix.log(3, '[Qualitor Webhook] Close ticket ' + resp);

        return JSON.stringify(resp);
    }
}
//add nota
else {
    Zabbix.log(4, '[Qualitor Webhook] add nota');
    if (params.qlt_ticket == null) {
        Zabbix.log(3,'[Qualitor Webhook] chamado n encontrado event ' + params.event_id);
        throw 'chamado n encontrado event ' + params.event_id;
    }

    //convert string
    cdchamado = "" + params.qlt_ticket;
/*
    //iniciar chamado
    fields = {};
    fields.cdchamado = cdchamado;

    Zabbix.log(3, '[Qualitor Webhook] verificar se chamado ja foi iniciado');
    url = params.event_uri + 'WSTicket/getTicketData';
    resp = sendMessage(url,fields);
    resp = JSON.parse(resp);
    if (resp.wsqualitor.response_data.dataitem.nmsituacao == 'Aguardando atendimento') {
        Zabbix.log(3, '[Qualitor Webhook] iniciando chamado ' + cdchamado);
        url = params.event_uri + 'WSTicket/startTicket';
        sendMessage(url,fields);
    }
*/
    //add nota
    url = params.event_uri + 'WSTicket/addTicketHistory';
    fields = {};
    fields.cdchamado = cdchamado;
    fields.dsacompanhamento = params.message;
    fields.cdtipoacompanhamento = '4';
    resp = sendMessage(url,fields);
    Zabbix.log(3, '[Qualitor Webhook] Add note ticket ' + resp)
    return "OK"
}