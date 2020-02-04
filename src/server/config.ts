import * as toml from 'toml';
import * as fs from 'fs';

export default toml.parse(fs.readFileSync(__dirname + '/../../config.dist.toml').toString());