'use strict';

var Handler = function (pool, conf) {

    var agentFromEvent = function (evt, version) {
        var key;
        if (version == '1.8') {
            switch (evt['event']) {
                case 'AgentCalled': 
                    key = 'agentcalled';
                    break;
                case 'AgentConnect':
                case 'AgentComplete':
                case 'AgentRingNoAnswer':
                default: 
                    key = 'member';
                    break;
            };
        } else if (version == '11') {
            switch (evt['event']) {
                case 'AgentCalled':
                case 'AgentConnect':
                case 'AgentComplete':
                case 'AgentRingNoAnswer':
                default: 
                    key = 'agent';
            }
        }
        return evt[key];
    }
     
    var handlerAgentEvents = function (evt) {

        var agent = agentFromEvent(evt, conf.version);
        console.log(agent, evt);
        
        var clients = pool.getClients(agent);
        
        if (clients) {
            clients.forEach(function (client, key) {
            	console.log(client.getId());
                client.emitToSocket(evt.event.toLowerCase(), {agent: agent, event: evt});
            });
        };
    };

    return {
    	handle: handlerAgentEvents
    };
};

module.exports = Handler;