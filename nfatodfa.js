// ==================================== Taking input ======================================= //
function getInput() {

	var br = document.createElement("BR");

	var n = document.getElementById("nStates").value
	var n2 = document.getElementById("nInput").value
	var final_state = document.getElementById("fState").value

	document.getElementById("inputSection2").style.display = "none";

	document.getElementById("inputSymbols").innerHTML = "Enter language symbols: ";
	document.getElementById("inputSymbols").appendChild(br);

	for (i=0; i<n2; i++)
	{
		var x = document.createElement("INPUT");
		x.setAttribute("type", "text");
		x.setAttribute("class", "inputSymbols");
		x.setAttribute("required", "true");
		document.getElementById("inputSymbols").appendChild(x);
	}

	document.getElementById("statesInput").innerHTML = "<b>Enter transitions for states q0 to q" + String(n-1) + "</b> <br> [If multiple transitions - Separate by comma(,) and -1 for no transition] <br>"
	document.getElementById("statesInput").appendChild(br);
	/*document.getElementById("statesInput").appendChild(br);
	document.getElementById("statesInput").appendChild(br);*/

	for (i=0; i<n; i++)
	{
		var z = document.createElement("FONT")
		z.innerHTML = "q" + i + " "
		document.getElementById("statesInput").appendChild(z);
		for (j=0; j<n2; j++)
		{
			var x = document.createElement("INPUT");
			x.setAttribute("type", "text");
			x.setAttribute("class", "statesInput");
			document.getElementById("statesInput").appendChild(x);
		}
		var br = document.createElement("BR");
		document.getElementById("statesInput").appendChild(br);
	}


  	var button =document.getElementById("convert")
  	if (button.style.display === "none") {
    	button.style.display = "inline";
  	} 
}

function passInput() {

	document.getElementById("inputSection").style.float = "left";
	document.getElementById("inputSection").style.width = "48%";
	document.getElementsByTagName("footer")[0].style.display = "none";

	document.getElementById("answer").style.visibility = "visible";

	var n = document.getElementById("nStates").value
	var n2 = document.getElementById("nInput").value
	var final_state = document.getElementById("fState").value.split(",")

	var symbols = []
	var temp = document.getElementsByClassName("inputSymbols")

	for (i=0; i<n2; i++)
	{
		symbols.push(temp[i].value)
	}
	// console.log(symbols)

	var Transition_mat = []
	var temp = document.getElementsByClassName("statesInput")

	count = 0
	for (i=0; i<n; i++)
	{
		var T2 = []
		for (j=0; j<n2; j++)
		{
			var temp2 = temp[count++].value.split(",")
			var result = temp2.map(function (x) { 
				return parseInt(x, 10); 
			});
			/*console.log(result)*/
			T2.push(result)
		}
		Transition_mat.push(T2);
	}
	// console.log(Transition_mat)
	/*var F = new Array(1).fill(n-1)*/
	var temp = final_state.map(function (x) { 
				return parseInt(x, 10); 
			});

	main(Transition_mat, symbols, n, n2, temp)
}



// ======================== Convertor code ========================== //

function find_transitions(T, q, s, symbols)
{
	var trans = []
	var ind = symbols.indexOf(s)
	// console.log("In: ",T, symbols, s, ind)
	// console.log("Trial ",T[q[counter]][ind])
	for (let counter=0; counter<q.length; counter++)
	{
		var found = (T[q[counter]][ind]).indexOf(-1)
		// console.log("Found: ",found)
		if (found == -1)
		{
			trans = trans.concat(T[q[counter]][ind])
		}
	}
	const unique = new Set(trans);
	trans = [...unique];
	// console.log("Trans: ",trans)
	return trans
}


function convert_symbols(li, d)
{
	var newlist = []
	for (var i=0; i<li.length; i++)
	{
		var s = li[i]
		for (var j=0; j<d.length; j++)
		{
			if (compareArray(li[i], d[j]))
			{
				newlist[i] = d[j+1]
			}
		}
	}
	// console.log("Converted symbols: ", newlist)
	return newlist
}


function compareArray(a1, a2)
{
	return (JSON.stringify(a1)==JSON.stringify(a2))
}


function main(Transition_mat, symbols, n, n2, final_states_nfa)
{
	var arr = [[0]]
	var dfa = []
	var states = [[0]]
	var l = 1

	console.log("Transition mat: ", Transition_mat)

	while (l!=0)
	{
		for (let counter=0; counter<n2; counter++)
		{
			// console.log("Counter: ",counter, "n2: ",n2)
			var tr = find_transitions(Transition_mat, arr[0], symbols[counter], symbols)
			tr.sort()
			dfa.push(tr)
			// console.log("DFA", dfa)
			var found = 0

			for (let i=0; i<states.length; i++)
			{
				if (JSON.stringify(states[i]) == JSON.stringify(tr))
					found = 1
			}

			if (found==0)
			{
				arr.push(tr)
				states.push(tr)
			}
		}
		arr.shift()
		l = arr.length
		// alert("Array: "+ arr)
	}

	console.log("States: ", states)
	console.log(" DFA: ", dfa)

	var final_states_dfa = []
	for (i=0; i<final_states_nfa.length; i++)
	{
		for (j=0; j<dfa.length; j++)
		{
			var ind = dfa[j].indexOf(final_states_nfa[i])
			var ind2 = -1

			for (count=0; count<final_states_dfa.length; count++)
			{
				if (JSON.stringify(final_states_dfa[count])==JSON.stringify(dfa[j]))
					ind2 = 0
			}
			// var ind2 = final_states_dfa.indexOf(dfa[j])

			// console.log(final_states_nfa[i], dfa[j], ind, ind2)

			if (ind!=-1 && ind2==-1)
				final_states_dfa.push(dfa[j])
		}
	}
	console.log("Final states dfa: ", final_states_dfa)

	var lookup = []
	var done = []
	var ch = "A"

	for (var k = 0; k<states.length; k++)
	{
		var item = states[k]
		// console.log("Item: ",item)
		var ind = done.indexOf(item)
		if (ind == -1)
		{
			lookup.push(item, ch)
			done.push(item)
		}
		ch = nextCharacter(ch)
	}

	console.log("lookup: ",lookup)

	states = convert_symbols(states, lookup)
	dfa = convert_symbols(dfa, lookup)
	final_states_dfa = convert_symbols(final_states_dfa, lookup)

	var Transition_mat_dfa = []
	var c = 0
	for (var i=0; i<states.length; i++)
	{
		var temp = []
		for (var j=0; j<n2; j++)
		{
			temp.push(dfa[c++])
			// console.log("i: ",i," j ",j," Temp: ", temp)
		}
		Transition_mat_dfa.push([states[i], temp])
	}

	console.log("DFA transition table: ",Transition_mat_dfa)
	printNFATransitionTable(Transition_mat, n, n2, states, symbols)
	printDFATransitionTable(Transition_mat_dfa, states.length, n2, final_states_dfa, symbols, lookup)
}	

function nextCharacter(c) 
{ 
	return String.fromCharCode(c.charCodeAt(0) + 1); 
} 


function printNFATransitionTable(T, n, n2, states, symbols) {

	document.getElementById("inputTransTable").innerHTML += "<br><br><span style='margin-left:3em'></span>"	
	
	for (var i=0; i<symbols.length; i++)
	{
		document.getElementById("inputTransTable").innerHTML += "<span style='margin-left:2em'></span>" + symbols[i]
	}
	
	document.getElementById("inputTransTable").innerHTML += "<br>"
	for (var i=0; i<n; i++)
	{
		document.getElementById("inputTransTable").innerHTML += "<br>"
		document.getElementById("inputTransTable").innerHTML += "q" + i +"<span style='margin-left:1em'></span>&rarr;"
		for (var j=0; j<n2; j++)
		{
			if (T[i][j]==-1)
			{
				document.getElementById("inputTransTable").innerHTML += "<span style='margin-left:2em'></span>" + -1
			}
			else 
			{
				document.getElementById("inputTransTable").innerHTML += "<span style='margin-left:2em'></span>" + addQ(T[i][j])
			}
		}
		// document.getElementById("inputTransTable").innerHTML += "<br>"
	}
}


function printDFATransitionTable(T, n, n2, final_states_dfa, symbols, lookup) {
	
	document.getElementById("outputTransTable").innerHTML += "<br><br><span style='margin-left:3em'></span>"	
	for (var i=0; i<symbols.length; i++)
	{
		document.getElementById("outputTransTable").innerHTML += "<span style='margin-left:2em'></span>" + symbols[i]
	}
	document.getElementById("outputTransTable").innerHTML += "<br>"
	for (var i=0; i<n; i++)
	{
		document.getElementById("outputTransTable").innerHTML += "<br>"
		document.getElementById("outputTransTable").innerHTML += T[i][0] + "<span style='margin-left:1em'></span>&rarr;"
		for (var j=0; j<n2; j++)
		{
			document.getElementById("outputTransTable").innerHTML += "<span style='margin-left:2em'></span>" + T[i][1][j]
		}
	}

	document.getElementById("finalStates").innerHTML += "Final state(s) of DFA is(are): "
	for (var i=0; i<final_states_dfa.length; i++)
	{
		document.getElementById("finalStates").innerHTML += final_states_dfa[i] + "  "
	}
	document.getElementById("finalStates").innerHTML += "<br><table>"

	for (var i=0; i<n; i++)
	{
		for (var j=0; j<lookup.length; j++)
		{
			if (T[i][0]==lookup[j])
			{
				document.getElementById("finalStates").innerHTML += "<tr><td>" + T[i][0] + "</td><td> &rarr; </td><td> [" + addQ(lookup[j-1]) + "]</td></tr><br>"
			}
		}
	}
	document.getElementById("finalStates").innerHTML += "</table><br><br>"
}

function addQ(li)
{
	for (var i=0; i<li.length; i++)
	{
		li[i] = "q"+li[i];
	}
	return li;
}


function resetScreen() {
	document.getElementById("answer").style.display = "none";
	document.getElementById("inputSection").style.display = "none";
	document.getElementById("inputSection2").style.display = "none";
	document.getElementById("heading").style.display = "none";
	document.getElementById("about").style.display = "none";
	document.getElementById("contact").style.display = "none";
}

function showAbout() {
	resetScreen()
	document.getElementById("about").style.display = "block";
	document.getElementById("about").innerHTML = "<h1 style='text-align: center;'> Conversion from NFA to DFA </h1>"
	document.getElementsByTagName("footer")[0].style.display = "block";

	document.getElementById("about").innerHTML += "<br>An NFA can have zero, \
	one or more than one move from a given state on a given input symbol. \
	An NFA can also have NULL moves (moves without input symbol). \
	On the other hand, DFA has one and only one move from a given state on a given input symbol. <br><br>\
	<font style='font-weight: bold'>Conversion from NFA to DFA</font><br>\
	Suppose there is an NFA N < Q, &Sigma;, q0, &delta;, F > which recognizes a language L. \
	Then the DFA D < Q', &Sigma;, q0, &delta;', F' > can be constructed for language L as:<br>\
	Step 1: Initially Q' = &straightphi;.<br>\
	Step 2: Add q0 to Q'.<br>\
	Step 3: For each state in Q', find the possible set of states for each input symbol\
	using transition function of NFA. If this set of states is not in Q', add it to Q'.<br>\
	Step 4: Final state of DFA will be all states which contain F (final states of NFA). <br>"
}

function showContact() {
	resetScreen()
	document.getElementById("contact").style.display = "block";	
}