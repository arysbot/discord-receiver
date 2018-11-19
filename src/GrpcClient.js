// Libraries
const path = require("path");
const fs = require("fs");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
// consts
const { NODE_ENV } = process.env;
let config = fs.readFileSync("../config.json");
config = JSON.parse(config);
const grpcServers = config.grpc;

class grpcClient {
    constructor() {
        this.proto = {};
        this.clients = {};
        this._proto = {};
        Object.keys(grpcServers).forEach((server) => {
            // load protofile
            this._proto[server] = {};
            this._proto[server].path = path.join(__dirname,
                `../node_modules/protofiles/src/${server}.proto`);
            this._proto[server].definition = protoLoader.loadSync(this._proto[server].path);
            this._proto[server].object = grpc.loadPackageDefinition(this._proto[server].definition);
            this.proto[grpcServers[server].name] = this._proto[server].object[server];
            // start grpc client
            this.clients[grpcServers[server].name] = new this.proto[grpcServers[server].name](`dns:///${grpcServers[server].serviceName}.arys-${NODE_ENV}.svc.cluster.local`, // eslint-disable-line
                grpc.credentials.createInsecure(), grpcServers[server].config);
        });
    }
}

module.exports = grpcClient;
