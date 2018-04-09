function startApp(){

    showView('viewWelcome');
    showHideMenuLinks();

    //IMPLEMENTING MENU-lINKS
    $('.nav:contains("Catalog")').click(viewCatalog);
    $('.nav:contains("Submit Link")').click(viewSubmitLink);
    $('.nav:contains("My Posts")').click(viewMyPosts);
    $('.commentsLink').click(viewComments);
    $('.editLink').click(viewEditLinks);

    //IMPLEMENTING BUTTON EVENTS
    $('#btnLogin').click(login);
    $('#btnRegister').click(register);
    $('#btnSubmitPost').click(submitPost);
    $('#btnEditPost').click(editPost);
    $('#btnPostComment').click(comment);
    $('#profile:contains("logout")').click(logout);

    //IMPLEMENTING CONST LINKS
    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_H12p6taYb';
    const appSecret = '2eae527b254d4a51b8222ebc15d6cae8';
    const loadingBox = $('#loadingBox');
    const infoBox = $('#infoBox');
    const errorBox = $('#errorBox');
    const authorizationHeaders = {
        'Authorization': 'Basic ' + btoa(appKey + ':' + appSecret),
        'Content-Type': 'Application/json'
    };
    let profile = $('#profile span');

    //implementing useful functions
    $('form').submit(function (event) {
        event.preventDefault();
    });
    $(document).on({
        ajaxStart: function() { loadingBox.fadeIn()},
        ajaxStop: function() {loadingBox.fadeOut()}
    });
    function showInfo(message){
        infoBox.text(message);
        infoBox.show();

        setTimeout(function(){
            infoBox.fadeOut();
        }, 3000)
    }
    function showHideMenuLinks(){
        if(sessionStorage.getItem('authToken')){
            $('#menu').show();
            $('#profile').show();
            let username = sessionStorage.getItem('username');
            let profile = $('#profile span');
            profile.text(username);
            console.log(username);
        } else{
            $('#menu').hide();
            $('#profile').hide();
        }
    }
    function handleAjaxError(response){
        let errorMsg = JSON.stringify(response);
        if(response.readyState === 0){
            errorMsg = "Cannot connect due to network error.";
        }
        if(response.responseJSON && response.responseJSON.description){
            errorMsg = response.responseJSON.description;
        }
        showError(errorMsg)
    }
    function saveDataInSession(data){
        let authToken = data._kmd.authtoken;
        sessionStorage.setItem('authToken', authToken);
        let userId = data._id;
        sessionStorage.setItem('userId', userId);
        let username = data.username;
        profile.text(username);
        sessionStorage.setItem('username', username);
    }
    function showError(errorMsg){
        errorBox.text('Error: ' + errorMsg);
        errorBox.fadeIn();
        errorBox.click(() => errorBox.fadeOut());
    }
    function getKinveyAuthHeaders(){
        return {
            'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')
        };
    }


    //Implementing MenuFunctions
    function showView(viewName){
        $('#container section').hide();
        $(`#${viewName}`).show();
    }
    function viewCatalog(){
        showView('viewCatalog');
        listPosts();
    }
    function viewSubmitLink(){
        showView('viewSubmit');
    }
    function viewMyPosts(){
        showView('viewMyPosts');
    }
    function viewComments(){
        showView('viewComments');
    }
    function viewEditLinks(){
        showView('viewEdit');
    }

    //IMPLEMENTING REQUESTS
    function register(){
        let username = $('#registerForm input[name=username]');
        let password = $('#registerForm input[name=password]');
        let repeatPass = $('#registerForm input[name=repeatPass]');

        if(password.val() !== repeatPass.val()){
            showError("Passwords don't match");
            return;
        }

        let regData = {
            username: username.val(),
            password: password.val()
        };

        let request = {
            url: baseUrl + 'user/' + appKey + '/',
            method: 'POST',
            data: JSON.stringify(regData),
            headers: authorizationHeaders,
            success: registerSuccess,
            error: handleAjaxError
        };
        $.ajax(request);

        function registerSuccess(data){
            saveDataInSession(data);
            showHideMenuLinks();
            viewCatalog();
            showInfo('Register successful.')
        }

        username.val('');
        password.val('');
        repeatPass.val('');
    }
    function login(){
        let username = $('#loginForm input[name=username]');
        let password = $('#loginForm input[name=password]');

        let userData = {
            username: username.val(),
            password: password.val()
        };
        let request = {
            method: 'POST',
            url: baseUrl + 'user/' + appKey + '/login',
            headers: authorizationHeaders,
            data: JSON.stringify(userData),
            success: loginSuccess,
            error: handleAjaxError
        };

        $.ajax(request);

        function loginSuccess(userInfo){
            saveDataInSession(userInfo);
            showHideMenuLinks();
            viewCatalog();
            showInfo('Login Successful.');
        }

        username.val('');
        password.val('');
    }
    function logout(){
        let headers = {
            authorization: 'Kinvey ' + sessionStorage.getItem('authToken'),
            'Content-Type': 'Application/json'
        };
        let request = {
            url: baseUrl + 'user/' + appKey + '/_logout',
            method: 'POST',
            headers: headers,
            success: logoutSuccess,
            error: handleAjaxError
        };
        $.ajax(request);
        function logoutSuccess(data){
            sessionStorage.clear();
            profile.text('');
            showHideMenuLinks();
            showView('viewWelcome');
            showInfo('Logout successful.');
        }
    }

    function listPosts(){

        let request = {
            url: baseUrl + 'appdata/' + appKey + '/posts',
            method: 'GET',
            headers: getKinveyAuthHeaders(),
            success: loadPostSuccess,
            error: handleAjaxError
        };

        $.ajax(request);

        function loadPostSuccess(posts){
            showInfo('Posts loaded.');
            let postsContainer = $('#viewCatalog .posts');
            postsContainer.empty();
            var count = 0;

            if(posts.length === 0){
                $('#viewCatalog .posts').text('No posts in the library');
            }else{
                for(let post of posts){
                    count++;
                    let container = $('<article class="post">')
                        .append($(`<div class="col rank"><span>${count}</span>`))
                        .append($('<div class="col thumbnail">')
                            .append($(`<a href="${post.url}">`)
                                .append($(`<img src="${post.imageUrl}">`))))
                        .append($('<div class="post-content">')
                            .append($(`<div class="title"><a href="${post.url}">${post.title}</a>`))
                            .append($(`<div class="details"><div class="info">submitted ${count} day ago by ${post.author}</div>`)
                            .append($('<div class="controls">')
                                .append($('<ul>')
                                    .append($('<li class="action">')
                                        .append($('<a class="commentsLink" href="#">comments</a>').click(listComments.bind(this, post))))
                                    .append($('<li class="action">')
                                        .append($('<a class="editLink" href="#">edit</a>').click(loadPostForEdit.bind(this, post))))
                                    .append($('<li class="action">')
                                        .append($('<a class="deleteLink" href="#">delete</a>').click(deletePost.bind(this, post))))))));

                    postsContainer.append(container);

                    if(post._acl.creator !== sessionStorage['userId']){
                        $('li > .editLink').remove();
                        $('li > .deleteLink').hide();
                    }
                }
            }
        }

    }

    function listComments(post){
        viewComments();
        sessionStorage.setItem('id', post._id);
        let request = {
            url: baseUrl + 'appdata/' + appKey + '/comments' + `?query={"postId":"${post._id}"}`,
            method: 'GET',
            headers: getKinveyAuthHeaders(),
            success: loadPostSuccess,
            error: handleAjaxError
        };
        $.ajax(request);

        function loadPostSuccess(data){
            $('#viewComments article').remove();


            for(let comment of data){
                let container = $('<article class="post post-content">');
                container.append($(`<p>${comment.content}</p>`))
                         .append($(`<div class="info">submitted 5 days ago by ${comment.author} </div>`)
                                .append($('<a href="#" class="deleteLink">| delete</a>').click(deleteLink.bind(this, comment))));

                $('#viewComments').append(container);
                if(comment._acl.creator !== sessionStorage['userId']){
                    $('.deleteLink').hide();
                }
            }

        }
    }

    function comment(){
        let postData = {
            author: sessionStorage.getItem('username'),
            content: $('#commentForm textarea[name=content]').val(),
            postId: sessionStorage.getItem('id')
        };

        let request = {
            method: 'POST',
            url: baseUrl + 'appdata/' + appKey + '/comments',
            headers: getKinveyAuthHeaders(),
            data: postData,
            success: commentSuccess,
            error: handleAjaxError
        };
        $.ajax(request);
        function commentSuccess(data){
            showInfo('Comment sended');
            listComments();
        }
    }

    function deleteLink(data){
        let request = {
            method: 'DELETE',
            url: baseUrl + 'appdata/' + appKey + '/comments/' + data._id,
            headers: getKinveyAuthHeaders(),
            success: deletePostSuccess,
            error: handleAjaxError
        };

        $.ajax(request);

        function deletePostSuccess(data){
            viewComments();
            showInfo('Comment deleted.')
        }
    }

    function submitPost(){
        let postData = {
            author: sessionStorage.getItem('username'),
            title: $('#submitForm input[name=title]').val(),
            url: $('#submitForm input[name=url]').val(),
            imageUrl: $('#submitForm input[name=image]').val(),
            description: $('#submitForm textarea[name=comment]').val()
        };

        let request = {
            method: 'POST',
            url: baseUrl + 'appdata/' + appKey + '/posts',
            headers: getKinveyAuthHeaders(),
            data: postData,
            success: createPostSuccess,
            error: handleAjaxError
        };

        $.ajax(request);

        function createPostSuccess(data){
            viewCatalog();
            showInfo('Post created.');
        }
    }


    function deletePost(post){
        let request = {
            method: 'DELETE',
            url: baseUrl + 'appdata/' + appKey + '/posts/' + post._id,
            headers: getKinveyAuthHeaders(),
            success: deletePostSuccess,
            error: handleAjaxError
        };

        $.ajax(request);

        function deletePostSuccess(data){
            viewCatalog();
            showInfo('Post deleted.')
        }
    }
    function loadPostForEdit(post){
        let request = {
            method: 'GET',
            url: baseUrl + 'appdata/' + appKey + '/posts/' + post._id,
            headers: getKinveyAuthHeaders(),
            success: loadPostForEditSuccess,
            error: handleAjaxError
        };

        $.ajax(request);

        function loadPostForEditSuccess(data){
            sessionStorage.setItem('postId',data._id);
            $('#editPostForm input[name=url]').val(data.url);
            $('#editPostForm input[name=title]').val(data.title);
            $('#editPostForm input[name=image]').val(data.imageUrl);
            $('#editPostForm textarea[name=description]').val(data.description);

            viewEditLinks();
        }
    }

    function editPost(){
        let postData = {
            title: $('#editPostForm input[name=title]').val(),
            url: $('#editPostForm input[name=url]').val(),
            imageUrl: $('#editPostForm input[name=image]').val(),
            description: $('#editPostForm textarea[name=comment]').val()
        };
        let request = {
            method: 'PUT',
            url: baseUrl + 'appdata/' + appKey + '/posts/' + sessionStorage.getItem('postId'),
            headers: getKinveyAuthHeaders(),
            data: postData,
            success: editBookSuccess,
            error: handleAjaxError
        };
        $.ajax(request);

        function editBookSuccess(data){
            viewCatalog();
            showInfo('Post edited.');
        }
    }
}