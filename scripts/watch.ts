import { spawnSync, spawn, ChildProcess } from 'node:child_process';
import Watcher from 'watcher';

const isWindows = process.platform === 'win32';

const fileWatcher = new Watcher(['./src', './src-web'], { recursive: true, renameDetection: true });
const altvProcessName = isWindows ? './altv-server.exe' : './altv-server';
// const altvVoiceProcessName = isWindows ? './altv-voice-server.exe' : './altv-voice-server';

let serverChildProcess: ChildProcess | undefined;
// let voiceChildProcess: ChildProcess | undefined;

const runScript = (scriptPath: string) => {
    spawnSync('node', ['--no-warnings=ExperimentalWarning', '--loader', 'ts-node/esm', scriptPath], {
        stdio: 'inherit',
    });
};

const run = async () => {
    spawnSync(`npx${isWindows ? '.cmd' : ''}`, ['vite', 'build', './src-web'], {
        stdio: 'inherit',
    });

    runScript('./scripts/compiler.ts');
    runScript('./scripts/copy.ts');
};

const reboot = async () => {
    [serverChildProcess, /* voiceChildProcess */].forEach((childProcess) => {
        childProcess?.kill('SIGINT');
    });

    await run();
    // voiceChildProcess = spawn(altvVoiceProcessName, { stdio: 'inherit' });
    serverChildProcess = spawn(altvProcessName, { stdio: 'inherit' });
};

const start = async () => {
    fileWatcher.on('change', reboot);
    await reboot();
};

start()
    .then(() => console.log('watch\t:: started'))
    .catch((err) => console.error(`watch\t:: error: ${err}`));


