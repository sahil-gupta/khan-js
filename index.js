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
}


// methods and arguments required by user
var methods = {
    whitelist: {},
    blacklist: {},
    structure: {}
};


// input node of tree to traverse, apply function, recurse
// modifies methods{}
var treeTraverse = function(node, f) {
    f(node);

    // for each child node or array of nodes, recurse
    var key, child;
    for (key in node) {
        if (node.hasOwnProperty(key) && (child = node[key]) instanceof Object)
            $.each(child, function(i, node) { treeTraverse(node, f); });
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

    return ['heree'];
};


// document ready
$(function() {
    // initial textarea value
    var temp = 'var x = 2 * 3;';
    $('#text').val(temp);

    // run tests when textarea changes
    $('#text').bind('change keyup', function(e) {
        var code = (e.keyCode || e.which);              // ignore arrow keys
        if(code >= 37 && code <= 40)
            return;

        methods = {                                     // update methods
            whitelist: {'for': 1, 'var': 1},
            blacklist: {'while': 0},
            structure: {'for': 'if'}
        };


        var text = $('#text').val(),               // get textarea code
            tree = esprima.parse(text);

        $('#tree').val(JSON.stringify(tree, null, 4));  // show tree

        var feedback = testAPI(tree);
        // console.log(feedback); // heree
    });

});
