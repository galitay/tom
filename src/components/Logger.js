var BASE_URL = window.configs.baseUrl;
var LOG_PATH = window.configs.logPath;

export default class Logger{
    static logPath = BASE_URL + LOG_PATH;
    static log(postData){
        fetch(this.logPath, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(postData)
        });
    }
}