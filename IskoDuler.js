var iskoduler = function()
{
	// get list of enlisted classes
	x = document.getElementsByClassName('preenlist_conflicts');

	// define variables
	slots_demand_info = [];
	probabilities = [];
	conflicting_classes = Object.keys(conflictlist);

	// check if the Probability column already exist
	// if it exists, destroy the column so that you can create a new one
	// note: this function might no longer be needed for IskoDuler 1.1 and above
	if ($('#tr_class-info-head th').last().text().trim() == 'Probability')
	{
		$('#tr_class-info-head th').last().remove();
		for (i = 0; i < x.length; i++)
		{
			$(x[i]).find('td').last().remove();
		}
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

	// computer probabilities using slots_demand_info and store it to probabilities array
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
	for (i = 0; i < probabilities.length; i++) {
		probabilities[i] = parseInt(100 * probabilities[i] + 0.5);
	}

	// add final probabilities to the table
	for (i = 0; i < x.length; i++) {
		$(x[i]).append('<td>' + probabilities[i] + '%</td>');
	}
};
