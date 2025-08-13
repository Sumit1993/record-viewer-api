"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const record_entity_1 = require("./entities/record.entity");
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [record_entity_1.Record],
    migrations: ['src/migrations/*.ts'],
    ssl: true,
    schema: 'record_viewer',
});
//# sourceMappingURL=data-source.js.map