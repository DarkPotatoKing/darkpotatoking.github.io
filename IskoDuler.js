var iskoduler = function() {
	x = document.getElementsByClassName('preenlist_conflicts');

	if ($('#tr_class-info-head th').last().text().trim() == 'Probability')
	{
		$('#tr_class-info-head th').last().remove();
		for (i = 0; i < x.length; i++)
		{
			$(x[i]).find('td').last().remove();
		}
	}

	slots_demand_info = [];
	probabilities = [];

	$('#tr_class-info-head').append('<th>&nbsp;&nbsp;Probability&nbsp;&nbsp;</th>');

	for (i = 0; i < x.length; i++) {
		s = $($(x[i]).children()[3]).text();
		s = s.substring(s.indexOf('[')+1, s.indexOf(']'));
		s = s.split('/');
		slots_demand_info.push([parseInt(s[0]), parseInt(s[2])]);
	}

	for (i = 0; i < slots_demand_info.length; i++) {
		p = slots_demand_info[i][0]/slots_demand_info[i][1];
		if (p >=1.0) p = 1.0;
		probabilities.push(p);
	}


	conflicting_classes = Object.keys(conflictlist);
	for (i = 0; i < conflicting_classes.length; i++)
	{
		conflicting_classes[i] = parseInt(conflicting_classes[i]);
	}

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

	for (i = 0; i < probabilities.length; i++) {
		probabilities[i] = parseInt(100 * probabilities[i] + 0.5);
	}

	for (i = 0; i < x.length; i++) {
		$(x[i]).append('<td>' + probabilities[i] + '%</td>');
	}
}
