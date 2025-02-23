import { ipcMain, WebContents, WebFrameMain } from "electron"
import { getUIPath } from "./path_resolver.js";
import { pathToFileURL } from 'url';


export function isDev(): boolean {
    return false
    return process.env.NODE_ENV === 'development'
};

export function getServerIP(): string {
    if (isDev()) {
        return 'http://127.0.0.1:30200';
    }
    return 'http://127.0.0.1:30200';
}


export function ipcMainHandle<Key extends keyof IPCEvents>(
    key: Key,
    handler: (payload: IPCEvents[Key][0]) => Promise<IPCEvents[Key][1]>
) {
    ipcMain.handle(key, async (event, payload) => {
        // validate event sender url
        if (event.senderFrame === null) return;
        validateEventFrame(event.senderFrame);

        return await handler(payload).then((res) => {
            const _r: IPCReturnType<IPCEvents[Key][1]> = { status_code: 200, message: 'ok', body: res }
            return _r;
        }).catch((error) => {
            const _r: IPCReturnType<IPCEvents[Key][1]> = { status_code: error.status_code, message: error.message }
            return _r;
        })
    });
};


export function ipcMainOn<Key extends keyof IPCEvents>(
    key: Key,
    
    handler: (payload: IPCEvents[Key][0]) => void 
) {
    ipcMain.on(key, (event, payload) => {
        // validate event sender url
        if (event.senderFrame === null) return;
        validateEventFrame(event.senderFrame);

        return handler(payload);
    });
};


export function ipcWebContentsSend<Key extends keyof IPCEvents>(
    key: Key,
    webContantes: WebContents,
    payload: IPCEvents[Key]
) {
    webContantes.send(key, payload);
};


// ------- Util -------
export function validateEventFrame(frame: WebFrameMain) {
    if (isDev() && new URL(frame.url).host === 'localhost:5123') {
        return;
    } 
    const frameURL = frame.url.replaceAll('\\', '/');
    const pathToFileURLx = pathToFileURL(getUIPath()).toString().replaceAll('\\', '/');
    if (!frameURL.startsWith(pathToFileURLx)) {
        throw new Error('Malicious event - frame url: ' + frameURL + ' is not ' + pathToFileURLx); 
    }
}



export async function fetch_data(url: string, body: any = {}, method: string = 'GET') {
    const response = await fetch(url, { 
        method: method, 
        body: JSON.stringify(body), 
        headers: { 
            "Content-type": "application/json; charset=UTF-8",
            'Accept': 'application/json'
        } 
    }).catch((error) => {
        throw {status_code: 500, message: "Failed to fetch data, reason:" + error};
    });
    return await response.json()
    .then((json) => {
        if (response.status === 422)
            throw {status_code: response.status, message: 'Unprocessable Entity'};
        else if (response.status !== 200) 
            throw {status_code: response.status, message: json.message ?? 'Failed to fetch data'};
        return json
    }).catch((error) => {
        throw error;
    });

}