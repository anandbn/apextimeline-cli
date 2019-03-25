import Operation from "./Operation";

class UserDebugOperation extends Operation{
    debugText: String;

    constructor(execStartTime:number, logLineTokens:String[]) {
        super(execStartTime,logLineTokens);
        this.debugText = logLineTokens[logLineTokens.length-1];
    }
}
export = UserDebugOperation;