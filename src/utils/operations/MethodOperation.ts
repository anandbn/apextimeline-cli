import Operation from "./Operation";
import EntryOrExit from './EntryOrExit';


export default class MethodOperation extends Operation{
	protected className: String | undefined;
	protected methodName: String | undefined;

	constructor(execStartTime:number, logLineTokens:String[]) {
		super(execStartTime,logLineTokens);
        if(this.eventSubType.toString()==EntryOrExit[EntryOrExit.STARTED].toString()){
			this.name = logLineTokens[4];
			if(this.name){
				let tokens = this.name.split('\.');
				this.className = tokens[0];
				let methodTokens = tokens[1].split('(');
				this.methodName = methodTokens[0];
			}
			this.eventId = logLineTokens[logLineTokens.length-1];
		}
		

	}

}