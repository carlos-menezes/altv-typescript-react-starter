import { spawnSync, spawn, ChildProcess } from 'node:child_process';
import Watcher from 'watcher';

const fileWatcher = new Watcher(['./src'], { recursive: true, renameDetection: true });
const altvProcessName = process.platform === 'win32' ? './altv-server.exe' : './altv-server';
const altvVoiceProcessName = process.platform === 'win32' ? './altv-voice-server.exe' : './altv-voice-server';

let serverChildProcess: ChildProcess | undefined;
let voiceChildProcess: ChildProcess | undefined;

const runScript = (scriptPath: string) => {
    spawnSync('node', ['--no-warnings=ExperimentalWarning', '--loader', 'ts-node/esm', scriptPath], {
        stdio: 'inherit',
    });
};

const runCompiler = () => {
    console.log('compile\t:: started');
    runScript('./scripts/compiler.ts');
    runScript('./scripts/copy.ts');
    console.log('compile\t:: end');
};

const reboot = async () => {
    [serverChildProcess, voiceChildProcess].forEach((childProcess) => {
        childProcess?.kill();
    });

    runCompiler();
    voiceChildProcess = spawn(altvVoiceProcessName, { stdio: 'inherit' });
    serverChildProcess = spawn(altvProcessName, { stdio: 'inherit' });
};

const start = async () => {
    fileWatcher.on('change', reboot);
    await reboot();
};

start()
    .then(() => console.log('watch\t:: started'))
    .catch((err) => console.error(`watch\t:: error: ${err}`));