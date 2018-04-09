$(document).ready(function(){

    listTags();

    //IMPLEMENTING MAIN TAGS
    location.hash = "tags=red,blue,purple";
    window.location = location.hash;

    //GLOBAL VARIABLE
    const box = $('.box');


    //IMPLEMENTING EVENTS

    /*Listing tags when URL address is changed*/
    $(window).on('hashchange', () => {listTags(); location.hash = "tags=" + extractTags();} );

    /*Show/Hide input tag panel*/
    $('.add-tag').on('click', function() {
        $('.input-tag').slideToggle("100");
    });

    /*Preventing page to reload*/
    $('form').on('submit', (e) => {
        e.preventDefault();
    });

    $('input[type=button]').on('click', insertTag);

    $(".cross-close").click(closeAlert);


    //IMPLEMENTING FUNCTIONS

    /*Extracting tags to array*/
    function extractTags (){
        let tags = location.hash;
        let index = tags.indexOf('=');

        let extractedTags = tags.substr(index + 1)
            .replace(/,/g, ' ')
            .split(' ')
            .map(el => el.toLowerCase());     //MAP RETURNS EACH TAG TO LOWER CASE

        if(extractedTags.toString() === ''){
            return extractedTags = [];
        }
       return extractedTags;                //RETURNS ARRAY FROM URL AFTER "=" SIGN
    }

    /*Listing tags to DOM*/
    function listTags(){
        let extractedTags = extractTags();
        let list = $('.tag-body > ul');
        list.empty();

        for(let li of extractedTags){
            list.append(`<li>${li}</li>`);  //APPENDING TAG ITEMS TO HTML
        }

        $('.tag-body ul li').click(removeTag);

    }

    /*Inserting tags from DOM to URL*/
    function insertTag() {
        if(box.hasClass('animate')){
            closeAlert();
        }
        const insertedTag = $('#text-tag');
        let extractedTags = extractTags();

        if(insertedTag.val().length === 0){
                notify('wrong', 'Tag should contains at least one symbol.');
                return;
        }

        extractedTags.push(insertedTag.val().toLowerCase());
        extractedTags.join(',');

        location.hash = `tags=${extractedTags}`;
        window.location = location.hash;

        notify('true', 'Tag was added successfully.');

        insertedTag.val('');
    }

    /*Deleting Tags from DOM and URL*/
    function removeTag(){
        $(this).fadeOut();

        let tagToRemove = $(this).text();
        let extractedTags = extractTags();

        let removed = extractedTags.filter(tag => tag !== tagToRemove);

            location.hash = `tags=${removed}`;
            window.location = location.hash;

        if(box.hasClass('animate')){
            closeAlert();
        }
        setTimeout(() => {notify('true', 'Tag has removed successfully.')}, 100); //Need time to close the alert if there is is open

    }

    /*Notification Functions*/
    function notify(notificationType, text){
        const image = $('.img-alert');
        image.empty();

        if(notificationType === 'wrong'){
            box.css('background-color', 'rgba(99, 17, 18, 0.72)');
            image.append('<img src="http://www.pngmart.com/files/3/Red-Cross-PNG-Clipart.png" alt="thick" width="100">');
        }else {
            box.css('background-color', 'rgba(24, 99, 68, 0.72)');
            image.append(' <img src="https://www.alwakad.net/wp-content/uploads/2015/12/201512032.png" alt="thick" width="50">');
        }

        $('.alert-text').text(text);
        box.addClass('animate');
        box.removeClass('noneAnimate');
        box.removeClass("slide-out-blurred-top");

        timeOut = setTimeout(()=>{
            closeAlert();
        }, 5000);

    }

    function closeAlert() {
        clearTimeout(timeOut);             //Clear the time out if the next 5 seconds alert function is invoked
        box.addClass("slide-out-blurred-top");
        box.removeClass('animate');
        box.addClass('noneAnimate');
    }
});