"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("./models");
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const models_1 = __importDefault(require("./models"));
const cors_1 = __importDefault(require("cors"));
const migrations_1 = require("./sequelize/helpers/migrations");
const utils_1 = require("./utils");
const routes_1 = require("./routes");
const graphql_1 = require("./graphql");
const http_1 = require("http");
const auth_1 = require("./auth");
const resError_1 = require("./middleware/resError");
const { sequelize } = models_1.default;
async function bootstrap() {
    try {
        await sequelize.authenticate();
        const migrations = await (0, migrations_1.checkForMigrations)();
        if (migrations.length) {
            console.log('Pending migrations need to be run:\n', migrations.map((migration) => migration.name).join('\n '), '\nUse this command to run migrations:\n yarn sequelize db:migrate');
            process.exit(1);
        }
        utils_1.log.info('Database connection has been established successfully.');
    }
    catch (err) {
        utils_1.log.warn({
            err,
        }, 'Unable to connect to the database');
    }
    utils_1.log.info('Sequelize Database Connected');
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    app.use((0, cors_1.default)());
    app.use(resError_1.resError);
    app.use(bodyParser.json());
    (0, auth_1.initAuth)(app);
    (0, routes_1.initRoutes)(app);
    await (0, graphql_1.initGraphql)(app, httpServer);
    const port = process.env.PORT;
    httpServer.listen(port, () => {
        utils_1.log.info(`Server running at http://localhost:${port}`);
    });
}
bootstrap();
//# sourceMappingURL=index.js.map