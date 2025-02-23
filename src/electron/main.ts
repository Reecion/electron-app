import { app, BrowserWindow } from 'electron'
import { fetch_data, getServerIP, ipcMainHandle, ipcMainOn, isDev } from './util.js';
import { getPreloadPath, getUIPath } from './path_resolver.js';

import log from 'electron-log';

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
            nodeIntegration: true,
            webSecurity: false
        },
        width: 1280,
        height: 832,
        resizable: false,
        frame: false,
    });
    log.initialize();
    log.info('Log from the main process');
    log.info(getUIPath());
    log.info(app.getAppPath());
    log.info('-----------');

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
    } else {
        mainWindow.loadFile(getUIPath());
    }
})

ipcMainOn('closeApp', () => {
    app.quit()
})

ipcMainHandle('login', async (payload) => {
    console.log('Trying to log in...')
    if (payload.username == '' || payload.password == '') {
        throw { status_code: 400, message: 'Username and password cannot be empty' }
    }

    try {
        const url = getServerIP() + '/login'
        const result = await fetch_data(url, {
            "username": payload.username,
            "password": payload.password
        }, 'POST');

        return result.token;
    } catch (error: any) {
        console.log("Failed to fetch /login, reason: " + error.message)
        throw {status_code: error.status_code, message: error.message};
    }
})

ipcMainHandle('getProcessList', async (token)  => {
    console.log('Trying to get process list...')
    const url = getServerIP() + '/processes'
    try {
        const result = await fetch_data(url, {
            "token": token,
            "page": 0,
            "files": 8
        }, 'POST');
        return result;
    } catch (error: any) {
        console.log("Failed to fetch /processes, reason: " + error.message)
        throw {status_code: error.status_code, message: error.message};
    }
})

ipcMainHandle('getProcessProgress', async (payload) => {
    console.log('Trying to get process preview...')
    const url = getServerIP() + '/preview/' + payload.id

    try {
        const result = await fetch_data(url, {
            "token": payload.token
        }, 'POST');

        return result;
    } catch (error: any) {
        console.log("Failed to fetch /preview, reason: " + error.message)
        throw {status_code: error.status_code, message: error.message};
    }
})

ipcMainHandle('generate', async (data) => {
    console.log('Trying to get generate...')
    const url = getServerIP() + '/generate'
    try {
        const result = await fetch_data(url, data, 'POST');

        return result;
    } catch (error: any) {
        console.log("Failed to fetch /generate, reason: " + error.message)
        throw {status_code: error.status_code, message: error.message};
    }
})
