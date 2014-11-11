$(document).ready(function () {

    var Direct2Server = {};
    Direct2Server.Configuration = {
        DataType: 'json',
        ContentType: 'application/json; charset=utf-8',
    };

    $('[onajaxserverclick]').bind('click', function () {
        Direct2Server.bindEvent($(this), 'onajaxserverclick');
    });

    $('[onajaxserverchange]').bind('change', function () {
        Direct2Server.bindEvent($(this), 'onajaxserverchange');
    });

    $('[onajaxserverkeyup]').bind('keyup', function () {
        Direct2Server.bindEvent($(this), 'onajaxserverkeyup');
    });

    $('[onajaxserverkeydown]').bind('keydown', function () {
        Direct2Server.bindEvent($(this), 'onajaxserverkeydown');
    });

    $('[onajaxserverkeypress]').bind('keypress', function () {
        Direct2Server.bindEvent($(this), 'onajaxserverkeypress');
    });

    $('[onajaxserverfocus]').bind('focus', function () {
        Direct2Server.bindEvent($(this), 'onajaxserverfocus');
    });

    $('[onajaxserverblur]').bind('blur', function () {
        Direct2Server.bindEvent($(this), 'onajaxserverblur');
    });

    $('[onajaxservermousedown]').bind('mousedown', function () {
        Direct2Server.bindEvent($(this), 'onajaxservermousedown');
    });

    $('[onajaxservermousemove]').bind('mousemove', function () {
        Direct2Server.bindEvent($(this), 'onajaxservermousemove');
    });

    $('[onajaxservermouseout]').bind('mouseout', function () {
        Direct2Server.bindEvent($(this), 'onajaxservermouseout');
    });

    $('[onajaxservermouseover]').bind('mouseover', function () {
        Direct2Server.bindEvent($(this), 'onajaxservermouseover');
    });

    $('[onajaxservermouseup]').bind('mouseup', function () {
        Direct2Server.bindEvent($(this), 'onajaxservermouseup');
    });

    Direct2Server.bindEvent = function($element, serverEvent) {

        var urlX = Direct2Server.getBaseUrl($element, serverEvent);

        var typeX = Direct2Server.getRequestType($element);

        if (typeX == 'POST') {

            $.ajax({
                url: urlX,
                type: typeX,
                data: Direct2Server.getPostData($element),
                contentType: Direct2Server.Configuration.ContentType,
                dataType: Direct2Server.Configuration.DataType,
                success: function(data, b) {
                    Direct2Server.successHandler($element, data, b);
                },
                error: function(a, b, c) {
                    Direct2Server.errorHandler($element, a, b, c);
                }
            });
        } else {
            $.ajax({
                url: Direct2Server.getGetUrl($element,urlX),
                type: typeX,
                contentType: Direct2Server.Configuration.ContentType,
                dataType: Direct2Server.Configuration.DataType,
                success: function (data, b) {
                    Direct2Server.successHandler($element, data, b);
                },
                error: function (a, b, c) {
                    Direct2Server.errorHandler($element, a, b, c);
                }
            });
        }
    };

    Direct2Server.getBaseUrl = function ($elementX, serverEventX) {

        var url = window.location.protocol + "//" + window.location.host;

        var actions = $elementX.attr(serverEventX).split('.');
        var action = actions.pop();

        var controller = actions.pop();
        var i = controller.toLowerCase().lastIndexOf('controller');
        controller = controller.substring(0, i);

        if (Direct2Server.Configuration.Url!='' && Direct2Server.Configuration.Url!=undefined) {
            return Direct2Server.Configuration.Url + '/' + action;
        }

        return url + '/' + controller + '/' + action;
    };

    Direct2Server.getPostData = function($elementX) {
        var postMethodReference = window[$elementX.attr('postarguments')];

        if (typeof (postMethodReference) != "function") {
            alert("Exception: PostArguments method '" + $elementX.attr('postarguments') + "' is not defined!");
            throw "Exception: PostArguments method '" + $elementX.attr('postarguments') + "' is not defined!";
        }

        switch (Direct2Server.Configuration.DataType.toLowerCase()) {
        case 'json':
            return JSON.stringify(postMethodReference.call(window));
        case 'html':
            return '';
        //return (new XMLSerializer()).serializeToString(postMethodReference.call(window));
        case 'xml':
            return '';
        //return (new XMLSerializer()).serializeToString(postMethodReference.call(window));
        default:
            return '';
        }

    };

    Direct2Server.getGetUrl = function ($elementX, baseUrl) {
        var url = baseUrl;
        if ($elementX.attr('getarguments') !== undefined) {

            var getMethodReference = window[$elementX.attr('getarguments')];

            if (typeof (getMethodReference) != "function") {
                alert("Exception: GetArguments method '" + $elementX.attr('getarguments') + "' is not defined!");
                throw "Exception: GetArguments method '" + $elementX.attr('getarguments') + "' is not defined!";
            }

            var getArguments = getMethodReference.call(window);

            var count = 0;
            for (var x in getArguments) {
                if (getArguments.hasOwnProperty(x)) {
                    if (count == 0) {
                        url = url + '?' + x + '=' + getArguments[x];
                        count++;
                    } else {
                        url = url + '&' + x + '=' + getArguments[x];
                    }
                }
            }
        }

        return url;
    };

   

    Direct2Server.getRequestType = function($elementX) {
        return $elementX.attr('postarguments') !== undefined ? 'POST' : 'GET';
    };

    Direct2Server.successHandler = function($elementX, dataX, bX) {
        var callBack = window[$elementX.attr('onServerSuccessResponse')];

        if (typeof (callBack) == "function") {
            callBack.call(window, dataX);
        }
    };

    Direct2Server.errorHandler = function($elementX, aX, bX, cX) {
        var callBack = window[$elementX.attr('onServerErrorResponse')];

        if (typeof (callBack) == "function") {
            callBack.call(window, aX, bX, cX);
        }
    };
});
