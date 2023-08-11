var addTicketByData = {
    url: 'http://localhost:8088/ws/WSTicket/addTicketByData',
    cdcliente: null,
    cdcontato: null,
    idchamado: null,
    cdcategoria: null,
    cdic: null,
    nmtitulochamado: null,
    cdtipochamado: null,
    cdlocalidade: null,
    cdseveridade: null,
    dschamado: null,
    dspalavrachave: null,
    cdorigem: null,


    sendMessage: function () {
        var params = {
            cdcliente: addTicketByData.cdcliente,
            cdcontato: addTicketByData.cdcontato,
            idchamado: addTicketByData.idchamado,
            cdcategoria: addTicketByData.cdcategoria,
            cdic: addTicketByData.cdic,
            nmtitulochamado: addTicketByData.nmtitulochamado,
            cdtipochamado: addTicketByData.cdtipochamado,
            cdlocalidade: addTicketByData.cdlocalidade,
            cdseveridade: addTicketByData.cdseveridade,
            dschamado: addTicketByData.dschamado,
            dspalavrachave: addTicketByData.dspalavrachave,
            cdorigem: addTicketByData.cdorigem,
        },
        response,
        request = new HttpRequest(),
        url = addTicketByData.url;

        request.addHeader('Content-Type: application/json');
        data = JSON.stringify(params);

        Zabbix.log(4, '[Qualitor Webhook] URL: ' + url);
        Zabbix.log(4, '[Qualitor Webhook] params: ' + data);
        response = request.post(url,data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            Zabbix.log(4,response);
            response = JSON.parse(response);
            
        }
        catch (error) {
            response = null;
        }
    }
};

var closeTicket = {
    cdchamado: null,
    idfecharrelacionados: 'Y'

};

var Ic = {
    nmic: null,
    cdempresa: null,
    url: 'http://localhost:8088/ws/WSIc/',
    cdic: null,
    cdcliente: null,

    getIc: function () {
        var params = {
            nmic: Ic.nmic
        },
        response
        request = new HttpRequest(),
        url = Ic.url;

        request.addHeader('Content-Type: application/json');
        data = JSON.stringify(params);

        Zabbix.log(4, '[Qualitor Webhook] IC - URL: ' + url + 'getIc');
        Zabbix.log(4, '[Qualitor Webhook] IC - params: ' + data);
        Zabbix.log(4, '[Qualitor Webhook] IC - find cdic: ' + Ic.nmic);
        response = request.post(url + 'getIc',data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            response = JSON.parse(response);
            Ic.cdic = response.wsqualitor.response_data.dataitem.cdic;
        }
        catch (error) {
            response = null;
        }
    },

    getIcData: function () {
        var params = {
            cdic: Ic.cdic
        },
        response
        request = new HttpRequest(),
        url = Ic.url;

        request.addHeader('Content-Type: application/json');
        data = JSON.stringify(params);

        Zabbix.log(4, '[Qualitor Webhook] IC - URL: ' + url + 'getIcData');
        Zabbix.log(4, '[Qualitor Webhook] IC - params: ' + data);
        Zabbix.log(4, '[Qualitor Webhook] IC - find ic data: ' + Ic.nmic);
        response = request.post(url + 'getIcData',data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            Zabbix.log(4, response);
            
            response = JSON.parse(response);
            cdcliente = response.wsqualitor.response_data.dataitem.cdcliente;  
            cdcontato = response.wsqualitor.response_data.dataitem.cdcontato;
            cdic = response.wsqualitor.response_data.dataitem.cdic;

            Zabbix.log(4, 'cdic: ' + cdic);
            Zabbix.log(4, 'cdcliente: ' +cdcliente);
            Zabbix.log(4, 'cdcontato: ' + cdcontato);
        }
        catch (error) {
            response = null;
        }
    }
};


//procurar IC
try {
    var params = JSON.parse(value);
    
    Ic.nmic = params.host_name;
    
    Ic.getIc();
    Ic.getIcData();

}
catch (error) {
    Zabbix.log(4, '[Qualitor Webhook] failed find IC: ' + error);
    throw 'failed find IC: ' + error + '.';
}

//abrindo chamado
try {
    var params = JSON.parse(value);

    addTicketByData.cdcliente = cdcliente;
    addTicketByData.cdcontato = cdcontato;
    addTicketByData.idchamado = '4';
    addTicketByData.cdcategoria = params.tag;
    addTicketByData.cdic = cdic
    addTicketByData.nmtitulochamado = params.trigger_name
    addTicketByData.cdtipochamado = '9';
    addTicketByData.cdlocalidade = '2';
    addTicketByData.cdseveridade = '6'
    addTicketByData.dschamado = params.message
    addTicketByData.dspalavrachave = params.event_id
    addTicketByData.cdorigem = '21'

    addTicketByData.sendMessage();

    return 'OK';
}
catch (error) {
    Zabbix.log(4, '[Qualitor Webhook] notification failed: ' + error);
    throw 'Sending failed: ' + error + '.';
}