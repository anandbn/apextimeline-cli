import DatabaseOperation from "./DatabaseOperation";
import EntryOrExit from "./EntryOrExit";

export default class QueryOperation extends DatabaseOperation{

    constructor(execStartTime:number, logLineTokens:String[]) {
        super(execStartTime,logLineTokens);
        if(this.eventSubType.toString() == EntryOrExit["BEGIN"].toString()){
            this.name=logLineTokens[4];
			this.operationType="Query";
		}
        if(this.eventSubType.toString() === EntryOrExit["END"].toString()){
        	this.rowCount = Number.parseInt(logLineTokens[3].substring(logLineTokens[3].indexOf(':')+1));
        }
        
    }
}