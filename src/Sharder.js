const PromClient = require("./PromClient");
const GrpcClient = require("./GrpcClient");
const uuid = require("uuid/v1");
const cluster = require("cluster");
const raven = require("raven");
const fs = require("fs");

const config = fs.readFileSync("../config.json");


class Sharder {
    constructor() {
        raven.config("https://cf3928d8c0064d2a922b71609f64792e@sentry.io/225011").install();
        raven.context(function () {
            this.promClient = new PromClient();
            this.grpcClient = new GrpcClient();
        });
    }

    identify() {
        const uuid = uuid();
        // send grpc request

        // send log to winston saying that the instanced identifies
        // send error to sentry if couldn't identify
    }
}

module.exports = Sharder;
