// Libraries
const os = require("os");
const PromClient = require("prom-client");
// consts


const { register, Histogram } = PromClient;

class promClient {
    constructor() {
        this._client = PromClient;
        this.register = promClient.register;
        this.metrics = {};
        this.metrics.grpcRequests = new Histogram({
            name: "grpc_requests",
            help: "amount of requests sent over grpc",
            label: ["service", "instance", "request", "code"]
        });
        this.metrics.grpcLatency = new Histogram({
            name: "grpc_latency",
            help: "history of the grpc request-response time",
            labelNames: ["service", "instance", "request", "code"]
        });
        this.metrics.messageRate = new Histogram({
            name: "discord_message_rate",
            help: "amount of messages tthe bot receives from all guilds at a given time",
            label: ["shard", "guild"]
        });
        this.grpcRequests = this.metrics.grpcRequests;
        this.grpcLatency = this.metrics.grpcLatency;
        this.messageRate = this.metrics.messageRate;
    }
    addGrpcRequest(service, request, code) {
        this.grpcRequests.labels(service, os.hostname(), request, code).observe(1);
    }
    addGrpcLatency(service, request, code, latency) {
        this.grpcLatency.labels(service, os.hostname(), request, code).observe(latency);
    }
    addMessage(shard, guild) {
        this.messageRate.labels(shard, guild).observe(1);
    }
}

module.exports = promClient;
