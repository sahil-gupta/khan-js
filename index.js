// sahil gupta

/*
function, return, var, while, for, break, if, else
white/black in one pass
*/

// input esprima tree, type of api, api arguments
var testAPI = function(codeTree, type, args) {
    if (type === 'whitelist') {
        return args + '3333333';
    } else if (type === 'blacklist') {
        return args + '4444444';
    } else if (type === 'structure') {
        return args + '5555555';
    }
    return 'heree';
};


// document ready
$(function() {
    var temp = 'var x = 2 * 3;';
    $('#code-text').val(temp);

    var apis = {
        whitelist: 'for, var',
        blacklist: 'while',
        structure: {'for': 'if'}
    };

    $('#code-text').bind('change keyup', function(e) {
        var code = (e.keyCode || e.which);          // ignore arrow keys
        if(code >= 37 && code <= 40)
            return;

        var codeText = $('#code-text').val(),       // get textarea code
            codeTree = esprima.parse(codeText);

        $('#code-tree').val(JSON.stringify(codeTree, null, 4)); // show tree

        var message = '';
        for (type in apis)
            message += testAPI(codeTree, type, apis[type]) + '\n';

        console.log(message);

    });

});
