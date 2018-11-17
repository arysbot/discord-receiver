const PromClient = require("./PromClient");
const GrpcClient = require("./GrpcClient");
const uuid = require("uuid/v1");
const cluster = require("cluster");
const fs = require("fs");

const config = fs.readFileSync("../config.json");

class Sharder {
    constructor() {
        this.promClient = new PromClient();
        this.grpcClient = new GrpcClient();
        this.start();

    }
    start() {
        console.log(this.grpcClient.clients);
    }
}
