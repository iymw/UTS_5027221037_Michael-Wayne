const PROTO_PATH = "../flags.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const FlagService = grpc.loadPackageDefinition(packageDefinition).FlagService;
const client = new FlagService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

module.exports = client;
