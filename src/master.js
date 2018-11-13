const Discord = require("discord.js");
const path = require("path");
const grpc = require("grpc");
const protoLoader = require('@grpc/proto-loader');

const shardPath = path.join(__dirname, '../node_modules/protofiles/src/shard.proto');
const shardDefinition = protoLoader.loadSync(shardPath);
const shardObject = grpc.loadPackageDefinition(shardDefinition);

const { NODE_ENV } = process.env;

const shardOrchestratorGrpcClient = new shardObject.Shard(`dns:///shard-orchestrator.arys-${NODE_ENV}.svc.cluster.local`, grpc.credentials.createInsecure());

const shardOrchestratorGrpcClient = new shardObject.Shard(`dns:///shard-orchestrator.arys-${NODE_ENV}.svc.cluster.local`, grpc.credentials.createInsecure(), {
    'grpc.lb_policy_name': 'round_robin'
});
