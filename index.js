// sahil gupta

/*
white/black in one pass
future
    allow input for frequency of statements
*/

// abbreviation hash table
var dict = {
    'function'  : 'FunctionExpression',   // note also 'FunctionDeclaration'
    'return'    : 'ReturnStatement',
    'var'       : 'VariableDeclaration',
    'if'        : 'IfStatement',
    'while'     : 'WhileStatement',
    'for'       : 'ForStatement',
    'break'     : 'BreakStatement'
    },
    methods = { whitelist: {},
                blacklist: {},
                structure: {} };    // methods and arguments required by user


// ignore arrow keys
var arrowKey = function(e) {
    var code = (e.keyCode || e.which);
    return (code >= 37 && code <= 40)
};


// input key event, list type as string
var updateList = function(e, list) {
    if (arrowKey(e)) return;

    var input;
    if (list === 'whitelist') {
        input = $('#inputW');
        methods.whitelist = {};
    } else if (list === 'blacklist') {
        input = $('#inputB');
        methods.blacklist = {};
    }

    input = input.val().split(/[\s,]+/);    // split and trim

    input.forEach(function(key) {           // update methods{}
        if (list === 'whitelist') {
            if (methods.whitelist[key])
                methods.whitelist[key]++;   // key should have freq++
            else
                methods.whitelist[key] = 1;
        } else if (list === 'blacklist') {
            methods.blacklist[key] = 0;     // key should have freq 0
        }
    });
}


// input node of tree to traverse, apply function, recurse
// modifies methods{}
var treeTraverse = function(node, f) {
    f(node);

    // for each child node or array of nodes, recurse
    var key, child;
    for (key in node) {
        if (node.hasOwnProperty(key) && (child = node[key]) instanceof Object){
            if (child instanceof Array)
                child.forEach(function(node) { treeTraverse(node, f); });
            else
                treeTraverse(child, f);            
        }
    }
};



// input syntax tree
// return array of feedback
var testAPI = function(node) {
    // if worth traversing tree
    if ($.isEmptyObject(methods.whitelist) &&
        $.isEmptyObject(methods.blacklist) &&
        $.isEmptyObject(methods.structure))
        return ['looks good'];
    
    // function checks node against each whitelist/blacklist keyword
    var checkNode = function(node) {
        var key;
        for (key in methods.whitelist) {
            if (dict[key] === node.type)
                methods.whitelist[key]--;       // keyword seen
        }

        for (key in methods.blacklist) {
            if (dict[key] === node.type)
                methods.blacklist[key]++;       // keyword seen
        }
    };

    treeTraverse(node, checkNode);              // traverse tree w checkNode()

    // loop through lists, make sure keys have correct frequency
    var feedbackW = [], feedbackB = [], key;
    for (key in methods.whitelist) {
        if (methods.whitelist[key] > 0)         // if not enough were seen
            feedbackW.push(key);
    }
    for (key in methods.blacklist) {
        if (methods.blacklist[key] > 0)         // if too many were seen
            feedbackB.push(key);
    }
    feedbackW = feedbackW.length === 0 ? 'looks good' :
                                            'need ' + feedbackW.join(' + ');
    feedbackB = feedbackB.length === 0 ? 'looks good' :
                                            'avoid ' + feedbackB.join(' + ');

    return {w: feedbackW, b: feedbackB};
};


// document ready
$(function() {
    // update methods{} when inputs change
    $('#inputW').bind('change keyup', function(e) {
        updateList(e, 'whitelist');
    });
    $('#inputB').bind('change keyup', function(e) {
        updateList(e, 'blacklist');
    });



    // run tests when textarea changes
    $('#text').bind('change keyup', function(e) {
        arrowKey(e);

            //structure: {'for': 'if'}

        // check whitelist and blacklist mutually exclusive
        var keyW, keyB;
        for (keyW in methods.whitelist) {
            for (keyB in methods.blacklist) {
                if (keyW === keyB)
                    return $('#feedback').val('whitelist overlaps blacklist');
            }
        }
        // assert whitelist and blacklist mutex

        var text = $('#text').val(),                // get textarea code
            tree = esprima.parse(text);

        // show feedback
        var feedback = testAPI(tree);
        $('#feedbackW').text(feedback.w);
        $('#feedbackB').text(feedback.b);
    });
});
