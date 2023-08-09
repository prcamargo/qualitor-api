var addTicketByData = {
    url: 'http://localhost:5000/ws/WSTicket/addTicketByData',
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
    url: 'http://localhost:5000/ws/WSIc/',
    cdic: null,

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
        Zabbix.log(4, '[Qualitor Webhook] IC - find IC: ' + nmic);
        response = request.post(url + 'getIc',data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            response = JSON.parse(response);
            const cdic = response.wsqualitor.response_data.dataitem.cdic;
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
        Zabbix.log(4, '[Qualitor Webhook] IC - find IC: ' + nmic);
        response = request.post(url + 'getIcData',data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            response = JSON.parse(response);
            const cdcliente = response.wsqualitor.response_data.dataitem.cdempresa;
            const cdcontato = response.wsqualitor.response_data.dataitem.cdcontato;
            const cdic = response.wsqualitor.response_data.dataitem.cdic;
        }
        catch (error) {
            response = null;
        }
    }
};

try {
    //procurar IC
    var params = JSON.parse(value);
    
    Ic.nmic = params.host_name;
    
    Ic.getIc();
    Ic.getIcData();

}
catch (error) {
    Zabbix.log(4, '[Qualitor Webhook] failed find IC: ' + error);
    throw 'failed find IC: ' + error + '.';
}

try {
    //abrindo chamado
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