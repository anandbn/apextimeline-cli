import Operation from "./Operation";
import EntryOrExit from './EntryOrExit';


export default class CalloutOperation extends Operation{
	protected url: String | undefined;
	protected httpMethod: String | undefined;
	protected statusMsg: String | undefined;
	protected statusCode: String | undefined;

	constructor(execStartTime:number, logLineTokens:String[]) {
		super(execStartTime,logLineTokens);
		let calloutLogInfo = logLineTokens[3]
		if(this.eventSubType.toString() == EntryOrExit["REQUEST"].toString()){
			//Endpoint=https://..., Method=GET
			let calloutInfo = calloutLogInfo.substring(calloutLogInfo.indexOf('[')+1,calloutLogInfo.indexOf(']'));
			this.url = calloutInfo.substring(calloutInfo.indexOf('=')+1,calloutInfo.indexOf('Method')-2);
			this.httpMethod = calloutInfo.substring(calloutInfo.indexOf('Method')).split('=')[1];
		}
		if(this.eventSubType.toString() == EntryOrExit["RESPONSE"].toString()){
			//Endpoint=https://..., Method=GET
			let calloutInfo = calloutLogInfo.substring(calloutLogInfo.indexOf('[')+1,calloutLogInfo.indexOf(']'));
			this.statusMsg = calloutInfo.substring(calloutInfo.indexOf('=')+1,calloutInfo.indexOf('StatusCode')-2);
			this.statusCode = calloutInfo.substring(calloutInfo.indexOf('StatusCode')).split('=')[1];
		}
		
	}

	setStatusMsg(msg:String){
		this.statusMsg=msg;
	}
	setStatusCode(code:String){
		this.statusCode=code;
	}

	getStatusCode(){
		return this.statusCode;
	}
	getStatusMsg(){
		return this.statusMsg;
	}
}