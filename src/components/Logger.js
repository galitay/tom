export default class Logger{
    static logPath = "https://www.itayg.com/tom/logger.php";
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