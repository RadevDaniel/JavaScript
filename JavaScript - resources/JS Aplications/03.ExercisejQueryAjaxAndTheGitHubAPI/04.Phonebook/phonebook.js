function attachEvents(){
    let loadBtn = $('#btnLoad').click(loadPhonebook);
    let createBtn = $('#btnCreate').click(createContact);
    let phoneBook = $('#phonebook');
    let person = $('#person');
    let phone = $('#phone');
    let baseUrl = "https://phones-669e7.firebaseio.com/phonebook";

    function loadPhonebook(){
        phoneBook.empty();
        let req = {
            url: baseUrl + '.json',
            type: 'GET',
            success: displayPhonebook,
            error: displayError
        };
        $.ajax(req);
    }

    function displayPhonebook (data){
        for (let key in data){
            let person = data[key]['person'];
            let number = data[key]['phone'];
            phoneBook.append($(`<li>${person}: ${number}</li>`)
                .append('<button>[Delete]</button>').click(deleteContact.bind(this, key)));
        }

    }

    function deleteContact(key){
        let deleteReq = {
            url: baseUrl + '/' +  key + '.json',
            method: 'DELETE',
            success: loadPhonebook,
            error: displayError
        };
        $.ajax(deleteReq);
    }

    function createContact(){
        let data = {
            person: person.val(),
            phone: phone.val()
        };
        let createReq = {
            url: baseUrl + '.json',
            method: 'POST',
            data: JSON.stringify(data),
            success: loadPhonebook,
            error: displayError
        };
        $.ajax(createReq);

        person.val('');
        phone.val('');
    }

    function displayError (error){
        phoneBook.append(`<li>${error.status}: ${error.statusText}</li>`)
    }
}