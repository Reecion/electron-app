const enum StatusCode {
    OK = 0,
    FAILED = 1,
    RUNNING = 2,
    STOPPED = 3
}

type LoginParams = {
    username: string;
    password: string;
}

type ProcessListItem = {
    _id: str;
    id: str;
    timestamp: string;
    status_code: StatusCodes;
    files: number;
}

type Log = {
    status_code: int,
    message: string,
    timestamp: string
}

type ProcessProgress = {
    progress: number;
    status_code: StatusCodes;
    logs: Log[];
}

type ProcessProgressRequest = {
    id: str;
    token: str;
}



type GeneratePDFsParams = {
    token: string,
    startDate: string;
    endDate: string;
    month: string;
    year: number;
    weekday: string;
    ingredienceNumberFrom: number;
    ingredienceNumberTo: number;
    skipNumber: number;
    limitNumber: number;
}


type FetchError = {
    status_code: number;
    message: string;
}

type IPCReturnType<T = undefined> = {
    status_code: number;
    message?: string;
    body?: T | undefined;
}

type IPCEvents = {
    closeApp: [undefined, void];
    login: [LoginParams, string];
    generate: [GeneratePDFsParams, undefined];
    getProcessList: [string, ProcessListItem[]];
    getProcessProgress: [ProcessProgressRequest, ProcessProgress];
}

type UnsubscribeFunction = () => void;

interface Window {
    electron: {
        closeApp: () => void;
        login: (payload: LoginParams) => Promise<string>;
        generate: (data: GeneratePDFsParams) => Promise<undefined>;
        getProcessList: (token: string) => Promise<ProcessListItem[]>;
        getProcessProgress: (payload: ProcessProgressRequest) => Promise<ProcessProgress>;
    }
}