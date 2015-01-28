// sahil gupta

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
