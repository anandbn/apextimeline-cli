import DatabaseOperation from "./DatabaseOperation";
import EntryOrExit  from "./EntryOrExit";

export default class DMLOperation extends DatabaseOperation{

    constructor(execStartTime:number, logLineTokens:String[]) {
        super(execStartTime,logLineTokens);
        if(this.eventSubType.toString() == EntryOrExit["BEGIN"].toString()){
			this.operationType=logLineTokens[3].substring(3);
        	this.rowCount = Number.parseInt(logLineTokens[5].substring(logLineTokens[5].indexOf(':')+1));
        	this.name = logLineTokens[4];
        }
    }
}