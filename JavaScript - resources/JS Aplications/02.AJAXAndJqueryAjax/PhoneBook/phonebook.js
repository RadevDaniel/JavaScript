function phones(){
    $('#btnCreate').click(createContact);
    let baseServiceUrl = "https://phonebook-c0cee.firebaseio.com/phonebook";
    let phoneBook = $('#phonebook');
    let person = $('#person');
    let phone = $('#phone');
    loadContacts();

    function loadContacts(){
        let req = {
            url: baseServiceUrl + ".json",
            method: "GET",
            success: displayContacts,
            error: displayError
        };
        $.ajax(req);
    }


    function displayContacts(contacts){
        phoneBook.empty();
        for(let key in contacts){
            let person = contacts[key]['person'];
            let phone = contacts[key]['phone'];
            let li = $('<li>');
            let button = $('<button id="butn">Delete</button>').click(deleteContact.bind(this, key));
            li.html(`<p class="span">${person}: ${phone}</p>`).appendTo(phoneBook);
            li.append(button);
        }
    }

    function displayError(error){
        notify(error.status + ' ' + error.statusText);
    }

    function createContact(){
        let data = {
            person: person.val(),
            phone: phone.val()
        };
        let req = {
            url: baseServiceUrl + '.json',
            method: 'POST',
            data: JSON.stringify(data),
            success: loadContacts,
            error: displayError
        };
        $.ajax(req);
        person.val('');
        phone.val('');
    }

    function deleteContact(key){
        let request = {
            url : baseServiceUrl + '/' + key + '.json',
            method: 'DELETE',
            success: loadContacts,
            error: displayError
        };
        $.ajax(request);

    }


    function notify(message) {
        let display = document.getElementById('notification');
        display.textContent = message;
        display.style.display = 'block';
        setTimeout(stop, 2000);
        function stop(){
            display.style.display = 'none';
        }
    }

}