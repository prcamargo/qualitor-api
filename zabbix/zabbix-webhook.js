var Ticket = {
    url: 'http://localhost:8088/ws/WSTicket/',
    
    // var para abertura de chamado
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
    mntitulochamado: null,

    //var para encerrar chamado
    cdchamado: null,
    idfecharrelacionados: 'Y',

    // var add nota
    cdtipoacompanhamento: '4',
    dsacompanhamento: null,

    //func abertura de chamado (ic)
    addTicketByData: function () {
        var params = {
            cdcliente: Ticket.cdcliente,
            cdcontato: Ticket.cdcontato,
            idchamado: Ticket.idchamado,
            cdcategoria: Ticket.cdcategoria,
            cdic: Ticket.cdic,
            nmtitulochamado: Ticket.nmtitulochamado,
            cdtipochamado: Ticket.cdtipochamado,
            cdlocalidade: Ticket.cdlocalidade,
            cdseveridade: Ticket.cdseveridade,
            dschamado: Ticket.dschamado,
            dspalavrachave: Ticket.dspalavrachave,
            cdorigem: Ticket.cdorigem,
        },
        response,
        request = new HttpRequest(),
        url = Ticket.url;

        request.addHeader('Content-Type: application/json');
        data = JSON.stringify(params);

        Zabbix.log(4, '[Qualitor Webhook] URL: ' + url + 'addTicketByData');
        Zabbix.log(4, '[Qualitor Webhook] params: ' + data);

        Zabbix.log(0, '[Qualitor Webhook] abrindo chamado envento: ' + Ticket.dspalavrachave);
        response = request.post(url + 'addTicketByData',data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            Zabbix.log(0,response);
            response = JSON.parse(response);
            
        }
        catch (error) {
            response = null;
        }
    },

    closeTicket: function () {
        var params = {
            cdchamado: Ticket.cdchamado,
            idfecharrelacionados: Ticket.idfecharrelacionados
        },
        response,
        request = new HttpRequest(),
        url = Ticket.url;

        request.addHeader('Content-Type: application/json');
        data = JSON.stringify(params);

        Zabbix.log(4, '[Qualitor Webhook] URL: ' + url + 'closeTicket');
        Zabbix.log(4, '[Qualitor Webhook] params: ' + data);

        Zabbix.log(0, '[Qualitor Webhook] encerrando chamado: ' + Ticket.cdchamado);
        response = request.post(url + 'closeTicket',data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            Zabbix.log(0,response);
            response = JSON.parse(response);
            
        }
        catch (error) {
            response = null;
        }
    },

    addTicketHistory: function () {
        var params = {
            cdchamado: Ticket.cdchamado,
            cdtipoacompanhamento: Ticket.cdtipoacompanhamento,
            dsacompanhamento: Ticket.dsacompanhamento
        },
        response,
        request = new HttpRequest(),
        url = Ticket.url;

        request.addHeader('Content-Type: application/json');
        data = JSON.stringify(params);

        Zabbix.log(4, '[Qualitor Webhook] URL: ' + url + 'addTicketHistory');
        Zabbix.log(4, '[Qualitor Webhook] params: ' + data);

        Zabbix.log(0, '[Qualitor Webhook] nota add no chamado: ' + Ticket.cdchamado);
        response = request.post(url + 'addTicketHistory',data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            Zabbix.log(0,response);
            response = JSON.parse(response);
            
        }
        catch (error) {
            response = null;
        }
    },

    getTicket: function () {
        var params = {
            dspalavrachave: Ticket.dspalavrachave,
            nmtitulochamado: Ticket.nmtitulochamado
        },
        response,
        request = new HttpRequest(),
        url = Ticket.url;

        request.addHeader('Content-Type: application/json');
        data = JSON.stringify(params);

        Zabbix.log(4, '[Qualitor Webhook] URL: ' + url + 'getTicket');
        Zabbix.log(4, '[Qualitor Webhook] params: ' + data);

        Zabbix.log(0, '[Qualitor Webhook] procurando chamado: ' + Ticket.cdchamado);
        response = request.post(url + 'getTicket',data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            Zabbix.log(0,response);
            response = JSON.parse(response);         
            cdchamado = response.wsqualitor.response_data.dataitem.cdchamado;          
        }
        catch (error) {
            response = null;
        }
    },
    
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
        Zabbix.log(0, '[Qualitor Webhook] IC - find cdic: ' + Ic.nmic);
        response = request.post(url + 'getIc',data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            Zabbix.log(0,response);
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
        Zabbix.log(0, '[Qualitor Webhook] IC - find ic data: ' + Ic.nmic);
        response = request.post(url + 'getIcData',data);
        Zabbix.log(4, '[Qualitor Webhook] HTTP code: ' + request.getStatus());

        try {
            Zabbix.log(0, response);
            
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


//
try {
    var params = JSON.parse(value);
    //abertura de chamado
    if (params.event_value == 1) {

        //procurar IC 
        Ic.nmic = params.host_name;
        Ic.getIc();
        Ic.getIcData();

        //formando json
        Ticket.cdcliente = cdcliente;
        Ticket.cdcontato = cdcontato;
        Ticket.idchamado = '4';
        Ticket.cdcategoria = params.tag;
        Ticket.cdic = cdic
        Ticket.nmtitulochamado = params.trigger_name
        Ticket.cdtipochamado = '9';
        Ticket.cdlocalidade = '2';
        Ticket.cdseveridade = '6'
        Ticket.dschamado = params.message
        Ticket.dspalavrachave = params.event_id
        Ticket.cdorigem = '21'

        Ticket.addTicketByData();

        return 'OK';

    }
    //encerrar chamado
    else if (params.event_value == 0) {

        //procurar chamado
        Ticket.dspalavrachave = params.event_id;
        Ticket.nmtitulochamado = params.trigger_name;
        Ticket.getTicket();

        //encerrandno chamado
        Ticket.cdchamado = cdchamado;
        Ticket.closeTicket();

        return 'OK';
    }
    //add nota
    else {

        //procurar chamado
        Ticket.event_id = params.event_id;
        Ticket.trigger_name;
        Ticket.getTicket();

        //add nota
        Ticket.dsacompanhamento = params.message;
        Ticket.cdchamado = cdchamado;
        Ticket.addTicketHistory();

    }
}
catch (error) {
    Zabbix.log(4, '[Qualitor Webhook] notification failed: ' + error);
    throw 'Sending failed: ' + error + '.';
}