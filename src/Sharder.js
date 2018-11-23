const PromClient = require("./PromClient");
const GrpcClient = require("./GrpcClient");
const _uuid = require("uuid/v1");
const cluster = require("cluster");
const winston = require("winston");
const GrpcTransport = require("@arys/winston-transport-grpc");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new GrpcTransport({ level: "info",
            serverURL: `127.0.0.1:8881`,
            config: { "grpc.lb_policy_name": "round_robin" },
            path: "../node_modules/@arys/protofiles/src/Logger.proto" })
    ]
});

/**
    logger.log({
    level: "info",
    uuid: "dfht",
    service: "tester",
    request: "log",
    code: "200"
});
 */


class Sharder {
    constructor() {
        this.promClient = new PromClient();
        this.grpcClient = new GrpcClient();
        this.loger = winston.createLogger({
            level: "info",
            format: winston.format.json(),
            transports: [
                new GrpcTransport({ level: "info",
                    serverURL: `127.0.0.1:8881`,
                    config: { "grpc.lb_policy_name": "round_robin" },
                    path: "../node_modules/@arys/protofiles/src/Logger.proto" })
            ]
        });
        this.service = "sharder"
    }
    _log(requestName, uuid, response, latency){
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
    identify() {
        const uuid = _uuid();
        const timestampStart = Date.now();
        const request = { uuid };
        // send grpc request
        this.grpcClient.clients.shardOrchestrator.identify(request, (error, response) => {
            const timestampEnd = Date.now();
            const latency = timestampEnd - timestampStart;
            this._log("Logger#Identify", uuid, response, latency);
            if(error || response.errorLog) {
                throw error;
            }

            const shardAmount = response.endShard - response.startShard;
            for(let i = 0; i < shardAmount; i++) {
                const env = {
                    totalShard: response.totalShard,
                    shard: response.startShard + i,
                    DISCORD_TOKEN: process.env.DISCORD_TOKEN
                };
            }
        });
        // send log to winston saying that the instanced identifies
        // send error to sentry if couldn't identify
    }
}

module.exports = Sharder;
