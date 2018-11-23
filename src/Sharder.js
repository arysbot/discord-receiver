const PromClient = require("./PromClient");
const GrpcClient = require("./GrpcClient");
const uuid = require("uuid/v1");
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
    }

    identify() {
        const uuid = uuid();
        let timestampStart = Date.now();
        const request = { uuid };
        // send grpc request
        this.grpcClient.clients.shardOrchestrator.identify(request, (error, response) => {
            const timestampEnd = Date.now();
            if(error) {

            }

        });
        // send log to winston saying that the instanced identifies
        // send error to sentry if couldn't identify
    }
}

module.exports = Sharder;
