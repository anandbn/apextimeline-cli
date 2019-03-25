import EntryOrExit from "./EntryOrExit";

export default class Operation{

    name: String;
    eventId:String;
    timeStamp:String;
    startTime:number;
    endTime:number;
    eventType:String | undefined;
    execStartTime:number;
    eventSubType:EntryOrExit;
    operations: Array<Operation> | undefined;
    constructor(execStartTime:number, logLineTokens:String[]){
        this.name='';
        this.startTime=0;
        this.endTime=0;
        this.eventId = logLineTokens[2];
        let timeTokens:String[] = logLineTokens[0].split(" ");
       
        this.startTime= Number(timeTokens[1].substring(1,timeTokens[1].length-1));
        this.timeStamp=timeTokens[0];
        let eventTokens:String[] = logLineTokens[1].split("_");
        if(eventTokens.length == 2 ){
            if(eventTokens[1] === "DEBUG"){
                this.eventType=eventTokens.join('_');
            }else{
                this.eventType=eventTokens[0];
            }
        }else{
            let subTokens = eventTokens.splice(0,eventTokens.length-1);
            this.eventType = subTokens.join('_');
        }
        let subType = eventTokens[eventTokens.length-1];
        this.eventSubType = EntryOrExit[subType as keyof typeof EntryOrExit];
        this.execStartTime=execStartTime;
    }

	getElapsedMillis():number{
		return (this.endTime - this.startTime) / 1000000;
	}

	
	getElapsedSinceStart():number {
		return (this.endTime - this.execStartTime) / 1000000;
	}


    add(operation:Operation){
		if(!this.operations){
			this.operations = new Array<Operation>();
		}
		return this.operations.push(operation);
	}

    hasOperations():Boolean{
        return !(this.operations==null || this.operations.length === 0);
    }

}