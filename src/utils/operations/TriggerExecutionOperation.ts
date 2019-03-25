import DatabaseOperation  from "./DatabaseOperation";
import EntryOrExit from './EntryOrExit';

enum TriggerEvent{
    BeforeInsert='BeforeInsert',BeforeUpdate='BeforeUpdate',BeforeDelete='BeforeDelete',
    AfterInsert='AfterInsert',AfterUpdate='AfterUpdate',AfterDelete='AfterDelete',AfterUndelete='AfterUndelete'
}

export default class TriggerExecutionOperation extends DatabaseOperation{
    protected objectName:String | undefined;
    protected triggerEvent:TriggerEvent | undefined;

    constructor(execStartTime:number,logLineTokens: String[]) {
        super(execStartTime,logLineTokens);
        this.operationType="TRIGGER";
		this.eventId = "TRIGGER";
        let timeTokens:String[]  = logLineTokens[0].split(" ");
        this.startTime= Number(timeTokens[1].substring(1,timeTokens[1].length-1));
        this.timeStamp=timeTokens[0];
        let eventTokens:String[]  = logLineTokens[1].split("_");
        this.eventType = eventTokens[0]+"_"+eventTokens[1];
        this.eventSubType = EntryOrExit[eventTokens[eventTokens.length-1] as keyof typeof EntryOrExit];
		if(this.eventSubType.toString() === EntryOrExit["STARTED"].toString()){
			this.parseAndInitTriggerDetails(logLineTokens[4]);
			this.eventId=this.name;
		}
		if(this.eventSubType.toString() === EntryOrExit["FINISHED"].toString()){
			this.parseAndInitTriggerDetails(logLineTokens[2]);
			this.eventId=this.name;
		}
    }
    
    parseAndInitTriggerDetails(triggerLogTxt:String){
		//STARTED: triggerName    on Object        trigger event <eventType>  for [list of objects]
		//Eg.      AccountTrigger on PersonAccount trigger event BeforeInsert for [new]
		let triggerTokens:String[] = triggerLogTxt.split(" ");
		this.name=triggerTokens[0];
        this.objectName=triggerTokens[2];
        this.triggerEvent=TriggerEvent[triggerTokens[5] as keyof typeof TriggerEvent] ;
 		
	}
}