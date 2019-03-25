import Operation from "./Operation";
import EntryOrExit from './EntryOrExit';


export default class MethodOperation extends Operation{
	constructor(execStartTime:number, logLineTokens:String[]) {
		super(execStartTime,logLineTokens);
        if(this.eventSubType.toString()==EntryOrExit[EntryOrExit.STARTED].toString()){
			this.name = logLineTokens[4];
			this.eventId = logLineTokens[logLineTokens.length-1];
        }

	}

}