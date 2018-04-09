function attachEvents(){
    let textArea = document.getElementById('messages');
    let messageUrl = 'https://messanger-7b71d.firebaseio.com/.json';
    let sender = $('#author');
    let message = $('#content');
    let submit = $('#submit').click(sendData);
    let refreshBtn = $('#refresh').click(getData);
    getData();
    setInterval(getData, 1000);
    function getData(){
        let req = {
            url : messageUrl,
            method: 'GET',
            success: loadData,
            error: displayError
        };
        $.ajax(req);
    }


    function loadData(data){
        textArea.textContent = '';
        for(let key in data){
            let name = data[key]['author'];
            let content = data[key]['content'];
            textArea.textContent += `${name}: ${content}\n`;
        }
    }

    function sendData(){
        console.log(Date.now());
        let content = {
            author: sender.val(),
            content: message.val(),
            time: Date.now()
        };
        let req = {
            url : messageUrl,
            method: 'post',
            data: JSON.stringify(content),
            success: getData,
            error: displayError
        };
        $.ajax(req);
    }

    function displayError(error){

    }
}