interface Imeta { 
    data?: any | null;
    error?: any;
    success?: any;
}

interface Iheaders {
    [index : string] : string
}

interface Ioptions {
    method: string;
    headers: Iheaders;
    body? : string;
}

const host : string = 'http://172.18.0.2:4000';

export default function (url : string, method : string, meta : Imeta = null) {
    const { success = null, error = null, data = null } = meta;
    const headers = {'Content-Type': 'application/json'};
    const options : Ioptions = { method, headers };
    if (typeof data === "object" && data !== null) {
        options['body'] = JSON.stringify(data);
    }
    fetch(host+url, options )
        .then((response : any) : object => response.json())
        .then((data : any) : any => success(data))
        .catch((error : any) : void => alert('Cannot reach the server!'+error));
}