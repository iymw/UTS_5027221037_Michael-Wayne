const PROTO_PATH = "../flags.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { v4: uuidv4 } = require("uuid");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const flagsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

// use sequelize
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('crud_grpc', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const Flag = sequelize.define('Flag',
    {
        id: { type: DataTypes.STRING, primaryKey: true },
        answer: { type: DataTypes.STRING, allowNull: false }
    },
    { tableName: 'flags', timestamps: false });

sequelize.sync()
    .then(() => { console.log('Database synchronized'); })
    .catch(err => { console.error('Database synchronization failed:', err); });

// perform crud
server.addService(flagsProto.FlagService.service, {
    getAll: async (_, callback) => {
        const getAllFlags = await Flag.findAll();
        callback(null, { flags: getAllFlags });
    },

    get: async (call, callback) => {
        const flag = await Flag.findByPk(call.request.id)
        if (flag) {
            callback(null, flag);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    insert: async (call, callback) => {
        const flag = call.request;

        flag.id = uuidv4();
        const postFlag = await Flag.create(flag);
        callback(null, { flag: postFlag });
    },

    update: async (call, callback) => {
        const existingFlag = await Flag.findByPk(call.request.id);
        if (existingFlag) {
            existingFlag.answer = call.request.answer;
            await existingFlag.save();
            callback(null, existingFlag);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    remove: async (call, callback) => {
        const existingFlagIndex = await Flag.findByPk(call.request.id);

        if (existingFlagIndex) {
            await existingFlagIndex.destroy();
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    }
});

server.bindAsync("localhost:30043", grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log("Server running at http://localhost:30043");
});
