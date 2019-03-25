import Operation from "./Operation";
import EntryOrExit from './EntryOrExit';


export default class ExecutionOperation extends Operation{

    constructor(execStartTime:number,logLineTokens:String[]){
        super(execStartTime,logLineTokens);
		this.eventId = "ENTRY_POINT";
		this.name="MAIN";
        let timeTokens:String[]  = logLineTokens[0].split(" ");
        this.startTime= Number(timeTokens[1].substring(1,timeTokens[1].length-1));
        this.timeStamp=timeTokens[0];
        let  eventTokens:String[]  = logLineTokens[1].split("_");
        this.eventType = eventTokens[0];
        this.eventSubType =EntryOrExit[eventTokens[eventTokens.length-1] as keyof typeof EntryOrExit];
        this.execStartTime=execStartTime;

    }
}