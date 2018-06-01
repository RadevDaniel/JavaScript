function formSubmit() {

    var box = $('.box-alert');
    var close = $('.cross-close');
    var contentAlert = $('.content-alert');
    timeOut = undefined;

    $('form').on('submit',emailSend);
    function emailSend(e) {
        e.preventDefault();
        var name = document.getElementById('name');
        var email = document.getElementById('email');
        var web = document.getElementById('web');
        var content = document.getElementById('message');
        var text = $('<div></div>');
        var allIsValid = true;
        $(".cross-close").click(closeAlert);

        validateInputWithRegex(name, /^[A-Za-z\d]{4,20}$/g);
        validateInputWithRegex(email, /^.*?@.*?\..*$/g);
        validateInputWithRegex(web, /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/);

        function validateInputWithRegex(input, pattern) {
            if (!pattern.test(input.value)) {
                allIsValid = false;
                appendText(input);
            }
        }

        function appendText(input) {
            if (input == name) {
                text.append('<article class="alert-cont"><span class="glyphicon glyphicon-remove"></span><p class="alert-text">Name should contains 4-20 letters!</p></article>');
            } else if (input == email) {
                text.append('<article class="alert-cont"><span class="glyphicon glyphicon-remove"></span><p class="alert-text">Please provide a valid email address!</p></article>');
            } else if(input == web){
                text.append('<article class="alert-cont"><span class="glyphicon glyphicon-remove"></span><p class="alert-text">Please provide a valid web address!</p></article>');
            }
        }

        function ajaxRequest() {
            let data = {
                name: name.value,
                email: email.value,
                web: web.value,
                content: content.value
            };
            $.ajax({
                url: "https://formspree.io/d.radevs@abv.bg",
                method: "POST",
                data: data,
                dataType: "json",
                success: emailSend
            });
            function emailSend(data) {
                text.append('<article class="alert-cont"><span class="glyphicon glyphicon-ok"></span><p class="alert-text">The email has been successfully sent!</p></article>')
                notify('success', text);

                name.value = '';
                email.value = '';
                web.value = '';
                content.value = '';
            }
        }

        if (allIsValid) {
            ajaxRequest();
        } else {
            console.log('here');
            notify("wrong", text);
        }

        /*Notification Functions*/
        function notify(notificationType, text){
            if(box.hasClass('animate')){
                clearTimeout(timeOut);
                closeAlert();
                setTimeout(function(){
                    notify(notificationType, text);
                },500)
            }else{
                if(notificationType === 'wrong'){
                    box.css('background-color', '#631522');
                    close.mouseover(function(){
                        close.css('background', '#4b131f');
                    });
                    close.mouseleave(function(){
                        close.css('background', 'none');
                    });
                }else {
                    box.css('background-color', '#01414b');
                    close.mouseover(function(){
                        close.css('background', '#01303a');
                    });
                    close.mouseleave(function(){
                        close.css('background', 'none');
                    });
                }

                contentAlert.append(text);
                box.addClass('animate');
                box.removeClass('noneAnimate');
                box.removeClass("slide-out-blurred-top");

                timeOut = setTimeout(()=>{
                    closeAlert();
                }, 5000);
            }

        }

        function closeAlert() {
            clearTimeout(timeOut);             //Clear the time out if the next 5 seconds alert function is invoked
            box.removeClass('animate');
            box.addClass("slide-out-blurred-top");
            box.addClass('noneAnimate');
            setTimeout(function(){
                contentAlert.empty();
            }, 300);

        }

    }
}