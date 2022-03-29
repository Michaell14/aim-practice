import $ from "jquery";


  
$( "#reset" ).click(function() {
    location.reload();
});

$( "#settings" ).click(function() {
    $("#settingsMenu").removeClass("invisible");
    $("#menu").addClass("invisible");
});

