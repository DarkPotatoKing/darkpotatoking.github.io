// version info
current_version = '1.1';

// constants
latest_jquery = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.js';
latest_version_info = 'https://rawgit.com/DarkPotatoKing/darkpotatoking.github.io/master/latest_version.js';

// messages
prompt_update = 'Your IskoDuler bookmark is not updated, please delete the current bookmark and get the newest version at:\n\n'
              + 'iskoduler.dilimansource.com\n\n';
prompt_fail = 'There was an error in running the app, please check if you can access:\n\n'
            + latest_version_info
            + '\n\nIf you can access the above file, try refreshing your browser and click on the bookmark again. '
            + 'If it still doesn\'t work, please message our Facebook page.\n\n'
            + 'facebook.com/IskoDuler\n';

function matrix( rows, cols, defaultValue)
{

    var arr = [];

    // Creates all lines:
    for(var i=0; i < rows; i++)
    {

        // Creates an empty line
        arr.push([]);

        // Adds cols to the empty line:
        arr[i].push( new Array(cols));

        for(var j=0; j < cols; j++)
        {
            // Initializes:
            arr[i][j] = defaultValue;
        }
    }

    return arr;
}

var iskoduler = function()
{
    // get list of enlisted classes
    x = document.getElementsByClassName('preenlist_conflicts');

    // define variables
    slots_demand_info = [];
    probabilities = [];
    total_probabilities = [];
    conflicting_classes = Object.keys(conflictlist);
    class_statuses = $("td[id^=td-icon]");
    enlisted_classes_id = []
    conflict_matrix = matrix(21,21);

    // check if the Probability column already exist
    // if it exists, return immediately as there is no change in probability
    // note: this function might no longer be needed for IskoDuler 1.1 and above
    if ($('#tr_class-info-head th').last().text().trim() == 'Probability')
    {
        return;
    }


    // add a new "Probability" column
    $('#tr_class-info-head').append('<th>&nbsp;&nbsp;Probability&nbsp;&nbsp;</th>');

    // parse slots and demand and store it to slots_demand_info
    for (i = 0; i < x.length; i++)
    {
        s = $($(x[i]).children()[3]).text();
        s = s.substring(s.indexOf('[')+1, s.indexOf(']'));
        s = s.split('/');
        slots_demand_info.push([parseInt(s[0]), parseInt(s[2])]);
    }

    // compute probabilities using slots_demand_info and store it to probabilities array
    for (i = 0; i < slots_demand_info.length; i++)
    {
        p = slots_demand_info[i][0]/slots_demand_info[i][1];
        if (p >=1.0) p = 1.0;
        probabilities.push(p);
    }

    // convert every element in conflicting classes from string to int
    for (i = 0; i < conflicting_classes.length; i++)
    {
        conflicting_classes[i] = parseInt(conflicting_classes[i]);
    }

    // get which classes are enlisted
    for (var i = 0; i < class_statuses.length; ++i)
    {
        if (class_statuses[i].querySelector('img[title="Enlisted"]') !== null)
        {
            enlisted_classes_id.push(i);
        }
    }

    // set the base probs of enlisted classes to 100%
    for (var i = 0; i < enlisted_classes_id.length; ++i)
    {
        probabilities[enlisted_classes_id[i]] = 1.0;
    }




    // compute finals probs
    for (i = 0; i < conflicting_classes.length; i++)
    {
        affected_classes = Object.keys(conflictlist[conflicting_classes[i]].conflicts);
        for (j = 0; j < affected_classes.length; j++)
        {
            affected_classes[j] = parseInt(affected_classes[j]);
        }
        fl = function(x) { return x > conflicting_classes[i] };
        affected_classes = affected_classes.filter(fl);

        for (j = 0; j < affected_classes.length; j++)
        {
            probabilities[affected_classes[j]-1] = probabilities[affected_classes[j]-1] * (1.0 - probabilities[conflicting_classes[i]-1]);
        }
    }

    // round off final probabilities to the nearest percent
    for (i = 0; i < probabilities.length; i++)
    {
        probabilities[i] = parseInt(100 * probabilities[i] + 0.5);
    }

    // add final probabilities to the table
    for (i = 0; i < x.length; i++)
    {
        $(x[i]).append('<td>' + probabilities[i] + '%</td>');
    }
};

// load latest jquery
jQuery.getScript
(
    latest_jquery,
    // load latest version info
    function()
    {
        jQuery.getScript(latest_version_info)
        .done
        (
            function()
            {
                // if IskoDuler is the latest version, run it
                if (latest_version == current_version)
                {
                    iskoduler();
                }
                // else, prompt user to download new version
                else
                {
                    prompt_update += 'current version:\t' + current_version + '\n';
                    prompt_update += 'latest version:\t' + latest_version + '\n';
                    alert(prompt_update);
                }
            }
        )
        .fail
        (
            function()
            {
                alert(prompt_fail);
            }
        )
    }

);
