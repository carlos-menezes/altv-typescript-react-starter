import fs from 'fs-extra';
import toml from 'toml';

const SERVER_CONFIG_PATH = './server.toml';

export const normalizeFilePath = (filePath: string) => filePath.replace(/\\/gm, '/');

export const shouldCompileResource = (name: string) => {
    const path = `./src/${name}`;
    return fs.existsSync(path) && !fs.existsSync(`${path}/.nocompile`);
};

const readServerConfig = () => {
    if (!fs.existsSync(SERVER_CONFIG_PATH)) {
        console.log('server.toml does not exist, please create one.');
        return null;
    }
    const fileContents = fs.readFileSync(SERVER_CONFIG_PATH, { encoding: 'utf-8' });
    return toml.parse(fileContents);
};

export const getResources = () => {
    const serverConfig = readServerConfig();
    return serverConfig?.resources.filter(shouldCompileResource) || [];
};