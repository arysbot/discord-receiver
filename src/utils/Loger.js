const PromClient = require("src/utils/PromClient");
const winston = require("winston");
const GrpcTransport = require("@arys/winston-transport-grpc");

class Loger {
    constructor(opts = {}) {
        this.service = opts.service;
        this.promClient = new PromClient();
        this.loger = winston.createLogger({
            level: "info",
            format: winston.format.json(),
            transports: [
                new GrpcTransport({
                    level: "info",
                    serverURL: process.env.GRPC_URL,
                    config: { "grpc.lb_policy_name": "round_robin" },
                    path: "../node_modules/@arys/protofiles/src/Logger.proto"
                })
            ]
        });
    }

    logRequest(requestName, uuid, response, latency) {
        this.promClient.addGrpcRequest(this.service, requestName, response.code, latency);
        const loggerRequest = {
            level: "info",
            uuid,
            service: this.service,
            request: requestName,
            code: response.code
        };
        if(response.metadata) loggerRequest.metadata = response.metadata;
        this.loger.log(loggerRequest);
    }
    logEvent(eventName, shard, id) {
        this.promClient.addEvent(eventName, shard, id);
    }
}

module.exports = Loger;
