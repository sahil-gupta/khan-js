// sahil gupta 2015

/*
why esprima over acorn
    both parse javascript and get the job done
    both produce well-documented, beautiful ASTs
    both have optional 'loose mode' where tolerates errors
acorn pros
    by esprima's own benchmarks
        acorn is trivially faster (./p-speed.png)
    30kb smaller
esprima pros
    compatible with modern firefox, chrome, ie8+
    acorn incompatible with ie8 in js strict mode
        determined with http://jscc.info (./p-acorn.png)

specs
    whitelist
        empty, one, many
    blacklist
        empty, one, many
    structure
        empty, one, nest
    extra
        code editor
        nonblocking

*/

// document ready
$(function() {
    console.log('hello world');
    $('#code-in').val('var x = 2 * 3;');
    var codeIn, codeoOut;

    $('#code-in').bind('change keyup', function() {
        codeIn = $('#code-in').val();
        codeOut = esprima.parse(codeIn);

        console.log(codeOut);

        $('#code-out').val(JSON.stringify(codeOut, null, 4));
    });

});
