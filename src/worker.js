const Discord = require("discord.js");
const GrpcClient = require("GrpcClient");
const Loger = require("Loger");
const fs = require("fs");

class Shard {
    constructor() {
        this.grpcClient = new GrpcClient();
        this.Loger = new Loger({ service: "shard" });
        this.clientOptions = {
            shardId: parseInt(process.env.shardID),
            shardCount: parseInt(process.env.shardCount),
            messageCacheMaxSize: 0,
            disabledEvents: [
                "TYPING_START"
            ]
        };
        this.client = new Discord.Client(this.clientOptions);
        this._eventFiles = fs.readdirSync("./events");
        this.eventFunctions = {};
        for(const eventFile in this._eventFiles) {
            this.eventFunctions[eventFile] = require(`./events/${eventFile}`);
            this.client.on(eventFile, (...args) => {
                this.eventFunctions[eventFile](this, ...args);
            });
        }
    }
}

const shard = new Shard();
