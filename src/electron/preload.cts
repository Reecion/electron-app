const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    closeApp: () => ipcSend('closeApp'),
    login: (payload) => ipcInvoke('login', payload),
    generate: (data) => ipcInvoke('generate', data),
    getProcessList: (token) => ipcInvoke('getProcessList', token),
    getProcessProgress: (payload) => ipcInvoke('getProcessProgress', payload)
} satisfies Window['electron'])


async function ipcInvoke<Key extends keyof IPCEvents>(
    key: Key,
    payload?: IPCEvents[Key][0]
): Promise<IPCEvents[Key][1]> {
    return await electron.ipcRenderer.invoke(key, payload)
    .then((res: IPCReturnType<IPCEvents[Key][1]> | IPCReturnType) => {
        if (res.status_code != 200) { 
            return Promise.reject({status_code: res.status_code, message: res.message}); 
        }
        return Promise.resolve(res.body); 
    }).catch((error) => Promise.reject(error) );
}


function ipcOn<Key extends keyof IPCEvents>(
    key: Key,
    callback: (payload: IPCEvents[Key][1]) => void
) {
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
}


function ipcSend<Key extends keyof IPCEvents>(
    key: Key, 
    payload?: IPCEvents[Key]
) {
    electron.ipcRenderer.send(key, payload);
}