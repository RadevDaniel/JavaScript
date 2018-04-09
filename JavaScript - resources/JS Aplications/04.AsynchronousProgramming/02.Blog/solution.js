function attachEvents(){
    $('#btnLoadPosts').click(loadPosts);
    $('#btnViewPost').click(viewPosts);

    let posts = $('#posts');
    posts.empty();

    let username = "ivan";
    let password = "ivan";
    let baseUrl = 'https://baas.kinvey.com/appdata/kid_S12vAfbPW/';
    let baseHeader = {
      "Authorization" : "Basic" + ' ' + btoa(username + ":" + password)
    };

    console.log(baseHeader);

    function loadPosts(){
        let request = {
            url: baseUrl + 'posts',
            headers: baseHeader,
            method: 'GET'
        };
        $.ajax(request)
            .then(showPosts)
            .catch(displayError);

        function showPosts(data){
            for(let post of data){
                let postId = post._id;
                let title = post.title;
                posts.append($('<option>').text(title).val(postId))
            }
        }
    }



    function viewPosts(){
       let commentID = posts.find('option:selected').val();

        let request = {
            url: baseUrl + 'comments/' + `?query={"posid":"${commentID}"}`,
            headers: baseHeader,
            method: 'GET'
        };
        $.ajax(request)
            .then(showComments)
            .catch(displayError);

        function showComments(data){
            console.log(data);
        }
    }

    function displayError(reason){

    }
}