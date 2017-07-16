let latest_jquery=`https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.js`;let pre_table_info=$(`div[style='float:right; font-weight: bold']`);let announcement=[`<h1 style='text-align: center'>Note: IskoDuler DOES NOT automatically recompute probabilities when changing rankings. Click the button below to refresh the computations.</h1>`];let button=`<input style="width:100%;background-color: #e7e7e7;color: black;font-size:24px;" id="refreshButton" type="button" value="REFRESH" onclick="refresh();" />`;let compute_probabilities=function(){$(`#tr_class-info-head`).append(`<th id='probability_header'>&nbsp;&nbsp;Probability&nbsp;&nbsp;</th>`);$(`#tr_class-info-head`).append(`<th id='base_probability_header'>Base Probability</th>`);x=document.getElementsByClassName(`preenlist_conflicts`);slots_demand_info=[];probabilities=[];base_probabilities=[];conflicting_classes=Object.keys(conflictlist);class_statuses=$(`td[id^=td-icon]`);enlisted_classes_id=[];conflict_matrix=matrix(21,21,0);for(i=0;i<x.length;i++){tr_obj=$(x[i]).children();tr_obj=filter_for_nstp_and_econ11(tr_obj);s=tr_obj.find(`.td_classname`).text();s=s.substring(s.indexOf(`[`)+1,s.indexOf(`]`));s=s.split(`/`);slots_demand_info.push([parseInt(s[0]),parseInt(s[2])])}
for(i=0;i<slots_demand_info.length;i++){p=slots_demand_info[i][0]/slots_demand_info[i][1];if(p>=1.0)p=1.0;probabilities.push(p)}
for(i=0;i<conflicting_classes.length;i++){conflicting_classes[i]=parseInt(conflicting_classes[i])}
for(let i=0;i<class_statuses.length;++i){if(class_statuses[i].querySelector(`img[title='Enlisted']`)!==null){enlisted_classes_id.push(i)}}
for(let i=0;i<enlisted_classes_id.length;++i)
{probabilities[enlisted_classes_id[i]]=1.0}
for(let i=0;i<conflicting_classes.length;++i){conflicting_classes[i]=parseInt(conflicting_classes[i])}
for(let i=0;i<conflicting_classes.length;++i){c=conflicting_classes[i];conflicts_with=Object.keys(conflictlist[c][`conflicts`]);for(let j=0;j<conflicts_with.length;++j){conflict_id=parseInt(conflicts_with[j]);conflict_matrix[c][conflict_id]=1;conflict_matrix[conflict_id][c]=1}}
base_probabilities=probabilities.slice();for(i=0;i<probabilities.length;++i){p=base_probabilities[i];for(j=0;j<i;++j){if(conflict_matrix[i+1][j+1]==1){p*=(1.0-base_probabilities[j])}}
probabilities[i]=p}
for(i=0;i<probabilities.length;i++){probabilities[i]=parseInt(100*probabilities[i]+0.5)}
for(i=0;i<base_probabilities.length;i++){base_probabilities[i]=parseInt(100*base_probabilities[i]+0.5)}
for(i=0;i<x.length;i++){var tr_obj=$(x[i]).children();tr_obj=filter_for_nstp_and_econ11(tr_obj);tr_obj.append(`<td class='td_probability'>`+probabilities[i]+`%</td>`);tr_obj.append(`<td class='td_base_probability'>`+base_probabilities[i]+`%&nbsp;<a href='http://facebook.com/IskoDuler/photos/a.1102011849897053.1073741828.1101849453246626/1121795081252063'>(?)</a>`+`</td>`);empty_tr_objs=$(x[i]).children().filter(function(){return this!=tr_obj[0]});empty_tr_objs.append(`<td class='td_filler'></td><td class='td_filler'></td>`)}}
let delete_added_columns=function(){while(document.getElementsByClassName('td_probability').length>0){document.getElementsByClassName('td_probability')[0].remove()}
while(document.getElementsByClassName('td_base_probability').length>0){document.getElementsByClassName('td_base_probability')[0].remove()}
while(document.getElementsByClassName('td_filler').length>0){document.getElementsByClassName('td_filler')[0].remove()}
document.getElementById('probability_header').remove();document.getElementById('base_probability_header').remove()}
let insert_announcements=function(){$(announcement[0]).insertBefore(pre_table_info);$(button).insertBefore(pre_table_info)}
let matrix=function(rows,cols,defaultValue){let arr=[];for(let i=0;i<rows;i++){arr.push([]);arr[i].push(new Array(cols));for(let j=0;j<cols;j++){arr[i][j]=defaultValue}}
return arr};let filter_for_nstp_and_econ11=function(tr_obj){if(tr_obj.length>1){tr_obj=tr_obj.filter(function(i){return i!=0&&$(this).find(`.td_credits`).html().indexOf(`0.0`)<0});tr_obj=$(tr_obj[0])}
return tr_obj}
let iskoduler=function(){if($(`#tr_class-info-head th`).last().text().trim()==`Base Probability`){return}
insert_announcements();compute_probabilities()};jQuery.getScript(latest_jquery,function(){iskoduler()});let refresh=function(){delete_added_columns();compute_probabilities()}