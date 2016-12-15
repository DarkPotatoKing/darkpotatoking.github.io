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
    base_probabilities = [];
    conflicting_classes = Object.keys(conflictlist);
    class_statuses = $("td[id^=td-icon]");
    enlisted_classes_id = []
    conflict_matrix = matrix(21,21, 0);

    // check if the Probability column already exist
    // if it exists, return immediately as there is no change in probability
    // note: this function might no longer be needed for IskoDuler 1.1 and above
    if ($('#tr_class-info-head th').last().text().trim() == 'Base Probability')
    {
        return;
    }


    // add a new "Probability" column
    $('#tr_class-info-head').append('<th>&nbsp;&nbsp;Probability&nbsp;&nbsp;</th>');
    // add a new "Base Probability" column
    $('#tr_class-info-head').append('<th>Base Probability</th>');

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



    // parse conflicting classes array to int
    for (var i = 0; i < conflicting_classes.lengh; ++i)
    {
        conflicting_classes[i] = parseInt(conflicting_classes[i]);
    }

    // traverse each class with conflicts
    for (var i = 0; i < conflicting_classes.length; ++i)
    {
        c = conflicting_classes[i];
        // get list of ids of classes in conflict with
        conflicts_with = Object.keys(conflictlist[c]['conflicts']);

        for (var j = 0; j < conflicts_with.length; ++j)
        {
            conflict_id = parseInt(conflicts_with[j]);
            conflict_matrix[c][conflict_id] = 1;
            conflict_matrix[conflict_id][c] = 1;
        }
    }

    // save current probability list to base probability list
    base_probabilities = probabilities.slice();


    // computer final probs
    for (i = 0; i < probabilities.length; ++i)
    {
        p = base_probabilities[i];
        // check for all conflicting classes ranked higher
        for (j = 0; j < i; ++j)
        {
            if (conflict_matrix[i+1][j+1] == 1)
            {
                p *= (1.0 - base_probabilities[j]);
            }
        }
        probabilities[i] = p;
    }


    // round off final probabilities to the nearest percent
    for (i = 0; i < probabilities.length; i++)
    {
        probabilities[i] = parseInt(100 * probabilities[i] + 0.5);
    }

    // round off base probabilities to the nearest percent
    for (i = 0; i < base_probabilities.length; i++)
    {
        base_probabilities[i] = parseInt(100 * base_probabilities[i] + 0.5);
    }

    // add final probabilities to the table
    for (i = 0; i < x.length; i++)
    {
        $(x[i]).append('<td>' + probabilities[i] + '%</td>');
        $(x[i]).append('<td>' + base_probabilities[i] +  '%&nbsp;<a href="http://www.facebook.com">(?)</a>' + '</td>');
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
