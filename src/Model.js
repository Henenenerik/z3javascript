/**
 * Copyright Blake Loring <blake_l@parsed.uk> 2015
 */

import Z3 from "./Z3Loader";
import Expr from "./Expr";

class Model {
	constructor(context, model) {
		this.context = context;
		this.mdl = model;
		Z3.Z3_model_inc_ref(this.context.ctx, this.mdl);
	}

	toString() {
		return Z3.Z3_model_to_string(this.context.ctx, this.mdl);
	}

	ostrichModelEval() {
		//var res = childProcess.spawnSync("./piper2");
		this._output = res.stdout.toString();
	}
    
	eval(expr) {
		let res = Z3.bindings_model_eval(this.context.ctx, this.mdl, expr.ast);
		//TODO: Propogating array lengths like this is horrible, find a better way
		return res ? (new Expr(this.context, res)).setLength(expr.getLength()).setFields(expr.getFields()) : null;
	}

	destroy() {
		Z3.Z3_model_dec_ref(this.context.ctx, this.mdl);
	}
}

export default Model;
