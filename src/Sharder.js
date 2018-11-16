// Libraries
const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");
const os = require("os");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const uuid = require("uuid/v1");
const promClient = require("prom-client");
// consts
const { NODE_ENV } = process.env;
const grpcServers = fs.readFileSync("../config.json");


const { register, Histogram } = promClient;

class Sharder {
    constructor() {
        this.grpcProto = {};
        this.grpcClients = {};
        this._grpcProto = {};
        Object.keys(grpcServers).forEach((server) => {
            // load protofile
            this._grpcProto[server].path = path.join(__dirname,
                `../node_modules/protofiles/src/${grpcServers[server].name}.proto`);
            this._grpcProto[server].definition = protoLoader.loadSync(this._grpcProto[server].path);
            this._grpcProto[server].object = grpc.loadPackageDefinition(this._grpcProto[server].definition);
            this.grpcProto[grpcServers[server].name] = this._grpcProto[server].object[server];
            // start grpc client
            this.grpcClients[server] = new this.grpcProto[grpcServers[server].name](`dns:///${grpcServers[server].serviceName}.arys-${NODE_ENV}.svc.cluster.local`, // eslint-disable-line
                grpc.credentials.createInsecure(), grpcServers[server].config);
        });
        const { shardOrchestrator, commands, messageHandler } = this.grpcClients;
        shardOrchestrator.Identify({ uuid: uuid() }, (err, resp) => {
            if(err) {

            }
        });

        this.metrics = {};
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
    }
}
