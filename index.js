// sahil gupta


// abbreviation hash table
var dict = {
    'funcExp'   : 'FunctionExpression',
    'funcDec'   : 'FunctionDeclaration',
    'return'    : 'ReturnStatement',
    'var'       : 'VariableDeclaration',
    'if'        : 'IfStatement',
    'while'     : 'WhileStatement',
    'for'       : 'ForStatement',
    'break'     : 'BreakStatement'
    },
    methods = { whitelist: {},
                blacklist: {},
                structure: {} };        // methods and keywords for tests


// ignore arrow keys
var arrowKey = function(e) {
    var code = (e.keyCode || e.which);
    return (code >= 37 && code <= 40);
};


// input key event, list type as string
// goes through input labels and updates methods{}
var updateList = function(e, list) {
    var input;
    if (list === 'structure') {
        input = $('#inputS').val();
        methods.structure = JSON.parse(input);  // convert to JSON
    } else {
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
                else if (dict[key])             // if a keyword
                    methods.whitelist[key] = 1;
            } else if (list === 'blacklist') {
                methods.blacklist[key] = 0;     // key should have freq 0
            }
        });
    }
}


// input root node of tree to traverse, function f to apply, child to search
// modifies methods{}
// returns 1 if child found
var treeTraverse = function(node, f, childKey) {
    f(node);
    if (node && dict[childKey] === node.type)       // child match
        methods.structure = 1;

    var parentKey = Object.keys(methods.structure)[0];
    if (node && dict[parentKey] === node.type)      // parent match
        childKey = methods.structure[parentKey];    // begin search for child

    // for each child node or array of nodes, recurse
    var key, child;
    for (key in node) {
        if (node.hasOwnProperty(key) && (child = node[key]) instanceof Object){
            if (child instanceof Array)     // if array
                child.forEach(function(node) {
                    treeTraverse(node, f, childKey);
                });
            else                            // else if single
                treeTraverse(child, f, childKey);
        }
    }
};


// input syntax tree
// return array of feedback
var testAPI = function(node) {
    // checks node against each whitelist/blacklist keyword
    var checkNode = function(node) {
        var key;
        for (key in methods.whitelist) {
            if (node && dict[key] === node.type)
                methods.whitelist[key]--;           // keyword seen
        }

        for (key in methods.blacklist) {
            if (node && dict[key] === node.type)
                methods.blacklist[key]++;           // keyword seen
        }
    };

    treeTraverse(node, checkNode, '');              // transfer control

    // loop through lists, check that keys have correct frequency
    var feedbackW = [], feedbackB = [], feedbackS, key;
    for (key in methods.whitelist) {
        if (methods.whitelist[key] > 0)             // if not enough were seen
            feedbackW.push(key);
    }
    for (key in methods.blacklist) {
        if (methods.blacklist[key] > 0)             // if too many were seen
            feedbackB.push(key);
    }

    feedbackW = feedbackW.length === 0 ? 'looks good' :
                                         'need - ' + feedbackW.join(' | ');
    feedbackB = feedbackB.length === 0 ? 'looks good' :
                                         'avoid - ' + feedbackB.join(' | ');
    feedbackS = methods.structure === 1 ? 'looks good' : 'take another look';
    return { w: feedbackW,
             b: feedbackB,
             s: feedbackS };
};


// input change event
// make call to testing API
// output feedback in index.html
var runTests = function(e) {
    if (arrowKey(e))
        return;

    updateList(e, 'whitelist');
    updateList(e, 'blacklist');
    updateList(e, 'structure');

    var text = editor.getValue(),           // get ace editor code
        tree,
        feedback;
    
    try {                                   // make sure error doesn't block
        tree = esprima.parse(text);
        feedback = testAPI(tree);           // call to API
        $('#feedbackW').text(feedback.w);
        $('#feedbackB').text(feedback.b);
        $('#feedbackS').text(feedback.s);
    } catch(e) {
        console.log(e);
        $('#feedbackW').text('-');          // indeterminate
        $('#feedbackB').text('-');
        $('#feedbackS').text('-');
    }
};


// document ready
$(function() {
    // run tests when keywords change
    $('#inputW, #inputB, #inputS').bind('change keyup', function(e) {
        runTests(e);
    });
    
    // run tests when code changes
    editor.getSession().on('change', function(e) {
        runTests(e);        
    });
});
