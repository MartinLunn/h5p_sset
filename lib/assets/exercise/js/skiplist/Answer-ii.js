const MIN_N = 0;
const MAX_N = 99;

var possible = new RandN(MIN_N, MAX_N);
var defCheck = Answer.prototype.check;
var addCheck = Answer.prototype.addCheck;

var answerFuncs = {
	"searchPath": defCheck,
	"addRemove":  addCheck
}

Answer.prototype.newPath = function (data){
	if (!data && data !== 0){
		var elems = build.getElements ();
		var nums  = elems.eachToArray (function (el){ return el.getData(); });
		data = possible.exclude (nums).next ();
	}

	this.searchingFor = data;
	setSearchingFor (data);
}

Answer.prototype.checkPointsCorrect = function (from, to) {
	from = toElementArray (from).copy ();
	to   = toElementArray (to).copy ();

	var result = true;

	// this is bad, but i'm lazy.
	function bad(){
		result = false;
		return false;
	}

	from.each (function (node){
		// find the next node ....
		var next = node.getNext ();

		// if its not connected, assume its the last element in the row.
		// we can check later if it's not by to having a size of > 0
		if (!next) return true;

		// the node MUST be in the to array.
		if (!to.contains (next)) return bad();

		// the two nodes MUST have the same height.
		if (node.getHeight () !== next.getHeight ())
			return bad();

		// the node cannot be pointed at twice,
		// so perform a shallow removal to remove it from the to array ...
		to.shallowRemoval (next);
	});

	// last check: to should now be empty
	if (to.size() > 0)
		return false;

	return result;
};

Answer.prototype.addCheck = function (){
	var leading  = leadingNodes.copy ();
	var newn     = newNodes.copy ();
	var trailing = trailingNodes.copy ();

	// step 1: check that each newNode connects to some element in trailing,
	//         and that no two newNodes connect to the same element.
	//         also check that each is on the same row...
	//         if all this is true, because there are the same number of elements in
	//         trailing and newn at most (as only this number are active at the start),
	//         then the new nodes must be correctly pointing to trailing nodes.
	if (!this.checkPointsCorrect (newNodes, trailingNodes))
		return false;

	// step 2: leading nodes should be each pointing to a new node on the same row.
	if (!this.checkPointsCorrect (leadingNodes, newNodes))
		return false;

	// step 3: we're good here.
	return true;
}

addCheck = Answer.prototype.addCheck;
answerFuncs.addRemove = addCheck;

Answer.prototype.check = function() {
	return mode.run (answerFuncs, this);
};