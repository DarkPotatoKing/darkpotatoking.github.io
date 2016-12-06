// define constants
latest_jquery = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.js";
iskoduler_source_code = "https://rawgit.com/DarkPotatoKing/darkpotatoking.github.io/master/IskoDuler.js";
iskoduler_fb_page = "facebook.com/IskoDuler/";
iskoduler_error_msg = "There was a problem in running IskoDuler, please check if you can access:\n\n"
                    + iskoduler_source_code
                    + "\n\nIf you can access this site, try refreshing your browser and clicking on the bookmark again.\n\n"
                    + "If IskoDuler still doesn't work, leave a message at:\n\n"
                    + iskoduler_fb_page;


// load the latest version of jQuery first
jQuery.getScript
(
    latest_jquery,

    // then load the IskoDuler script
    function()
    {
        jQuery.getScript(iskoduler_source_code)
        // if it's successful run iskoduler
        .done
        (
            function()
            {
                iskoduler();
            }
        )
        // if not alert the user of failure
        .fail
        (
            function()
            {
                alert(iskoduler_error_msg);
            }
        );
    }
)
