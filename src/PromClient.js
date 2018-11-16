// Libraries
const path = require("path");
const fs = require("fs");
const os = require("os");
const uuid = require("uuid/v1");
const promClient = require("prom-client");
// consts
const { NODE_ENV } = process.env;
const grpcServers = fs.readFileSync("../config.json");


const { register, Histogram } = promClient;

class promClient {
    constructor() {
        this._client = promClient;
        this.metrics = {};
        this.metrics.grpcRequests = new Histogram({
            name: "grpc requests",
            help: "amount of requests sent over grpc",
            label: ["service", "instance", "request", "code"]
        });
        this.metrics.grpcLatency = new Histogram({
            name: "grpc latency",
            help: "history of the grpc request-response time",
            labelNames: ["service", "instance", "request", "code"]
        });
        this.metrics.messageRate = new Histogram({
            name: "discord message rate",
            help: "amount of messages tthe bot receives from all guilds at a given time",
            label: ["shard", "guild"]
        });
        this.grpcRequests = this.metrics.grpcRequests;
        this.grpcLatency = this.metrics.grpcLatency;
        this.messageRate = this.metrics.messageRate;
    }
    addGrpcLatency() {
        this
    }
}
