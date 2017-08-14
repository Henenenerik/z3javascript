/**
 * Copyright Blake Loring <blake_l@parsed.uk>
 */
class Query {
	constructor(exprs, checks, maxRefinements) {
		this.exprs = exprs;
		this.checks = checks;
        this.maxRefinements = maxRefinements || -1;
	}

	getModel(solver) {
		return Query.process(solver, [this]);
	}
}

Query.MAX_REFINEMENTS = -1;
Query.TOTAL = 0;

Query.canAttempt = function(currentAttempts) {
    return Query.MAX_REFINEMENTS == -1 || (currentAttempts < Query.MAX_REFINEMENTS);
}

Query.process = function(solver, alternatives) {
    let attempts = 0;
    
	while (Query.canAttempt(attempts) && alternatives.length) {
        
        attempts++;
        Query.TOTAL++;

		let next = alternatives.shift();

		let model;

		solver.push();
        {
        	next.exprs.forEach(clause => solver.assert(clause));
            //console.log(`${solver.toString()}`);
            model = solver.getModel();
        }
        solver.pop();

        if (model) {

            //console.log(`${model.toString()}`);
            
            //Run all the checks and concat any alternatives
            let Checks = next.checks.map(check => check(next, model));
            alternatives = Checks.reduce((alt, next) => alt.concat(next.alternatives), alternatives);

            //Find any failing check
        	let Failed = Checks.find(check => !check.isSAT);
        	
        	//If we have found a satisfying model return it otherwise add alternatives from check
        	if (Failed) {
        		model.destroy();
        	} else {
                return model;
            }
        } //Else unsat
	}

    return null;
}

export default Query;
