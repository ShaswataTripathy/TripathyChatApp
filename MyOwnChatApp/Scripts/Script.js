$(document).ready(function () {
    var list_user = null;
    var id = null;
    var username = null;
    var chat_show = $(".chat_main ul#all");
    var tab_menu = $(".chat-content .nav.nav-pills");
    var tab_content = $(".chat-content .tab-content");

    var chatHub = $.connection.chatHub;

    chatHub.client.broadcastMessage = function (user, message, userto) {
        if (userto == 'all') {
            if (user == username) {
                chat_show.append('<li><strong>' + user + '</strong>: ' + message + '</li>');
            }
            else {
                //If it does not, then check new active
                var athis = $('a[data-id="-1"]', tab_menu);
                var lithis = athis.closest("li");
                if (!lithis.hasClass("active")) {
                    lithis.addClass("new");
                }

                //add new
                chat_show.append('<li>' + user + ': ' + message + '</li>');
            }
        }
        else {
            //The sender
            if (username == user) {
                var userto_id = list_user.indexOf(userto);
                var chat_id = "chat" + userto_id;
                var chatlist = $("#" + chat_id, tab_content);
                chatlist.append('<li><strong>' + user + '</strong>: ' + message + '</li>');

                //If it does not, then check new active
                var athis = $('a[data-id="' + userto_id + '"]', tab_menu);
                var lithis = athis.closest("li");
                if (!lithis.hasClass("active")) {
                    lithis.addClass("new");
                }


                chat_show.append('<li>' + user + ': ' + message + '</li>');


                return;
            }

            // As a recipient
            if (username == userto) {
                console.log(userto);
                console.log(user);
                var userto_id = list_user.indexOf(user);
                var chat_id = "chat" + userto_id;
                var chatlist = $("#" + chat_id, tab_content);
                console.log(chatlist.length);
                if (chatlist.length < 1) {

                    tab_menu.append('<li class="new"><a data-toggle="pill" href="#' + chat_id + '" data-id="0" data-chat="' + user + '">' + user + '</a></li>');

                    tab_content.append('<ul id="' + chat_id + '" class="tab-pane fade"></ul>');

                    chatlist = $("#" + chat_id, tab_content);
                }

                //                If it does not, then check new active
                var athis = $('a[data-id="' + userto_id + '"]', tab_menu);
                var lithis = athis.closest("li");
                if (!lithis.hasClass("active")) {
                    lithis.addClass("new");
                }


                chatlist.append('<li>' + user + '</strong>: ' + message + '</li>');
                return;
            }
        }

    };

    chatHub.client.loadUser = function (list) {
        list_user = list;
        var ol = $(".user_list");
        ol.empty();
        $.each(list, function (key, value) {
            if (value == username) {
                ol.append('<li class="chinhtoi" data-id="' + key + '" data-value="' + value + '">' + value + '</li>');
            }
            else {
                ol.append('<li data-id="' + key + '" data-value="' + value + '">' + value + '</li>');
            }
        })
    };



    $.connection.hub.start().done(function () {


        //Process Login
        var modal_login = $("#modal-login");
        if (username == null) {
            modal_login.modal({ backdrop: 'static', keyboard: false });
        }

        $(".login", modal_login).on("click", function (event) {
            var name = $(".username", modal_login).val();
            if (name != null && name != '') {
                chatHub.server.register(name).done(function (result) {
                    console.log(result);
                    if (result == true) {
                        username = name;
                        modal_login.modal('hide');

                        //Load list user;
                        chatHub.server.getListUser();
                    }
                    else {
                        alert("Please choose another name");
                    }
                });
            }
            event.preventDefault();
        })


        $(".form-chat .send_message").on("click", function (event) {
            var message = $(".form-chat .message").val();
            var a_userto = $("li.active a", tab_menu);
            var userto = a_userto.attr("data-chat");

            chatHub.server.sendMessage(username, message, userto);
            $(".form-chat .message").val("");
            event.preventDefault();
        });


        //Chat with someone

        $(document).on("click", '.user_list li', function () {


            var user_id = $(this).attr("data-id");
            var user_name = $(this).attr("data-value");

            var chatadded = false;
            if ($('a[data-chat="' + user_name + '"]', tab_menu).length > 0) {
                chatadded = true;
            }

            if (user_name != username) {
                var chatid = "chat" + user_id;

                var li = $("li", tab_menu);

                if (chatadded == false) {
                    li.removeClass("active");
                    tab_menu.append('<li class="active"><a data-toggle="pill" href="#' + chatid + '" data-id="' + user_id + '" data-chat="' + user_name + '">' + user_name + '</a></li>');
                    $("ul", tab_content).removeClass("in");
                    $("ul", tab_content).removeClass("active");
                    tab_content.append('<ul id=' + chatid + ' class="tab-pane fade in active"></ul>');
                }
                else {

                }
            }
            else {
                alert("You can not chat with yourself.")
            }
        });
    });

    $(document).on("click", ".nav-pills li", function () {
        $(this).removeClass("new");
    });
})
