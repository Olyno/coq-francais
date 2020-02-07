import * as toml from 'toml';
import * as fs from 'fs';

let config = {
    server: {
        port: process.env.PORT
    },
    database: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        url: process.env.DB_URL
    }
};

const configFile = fs.readFileSync(__dirname + '/../../config.dist.toml');

if (config) {
    config = toml.parse(configFile.toString());
}

export default config;