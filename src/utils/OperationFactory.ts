import MethodOperation from "./operations/MethodOperation";
import QueryOperation from './operations/QueryOperation';
import DMLOperation from './operations/DMLOperation';
import ExecutionOperation from './operations/ExecutionOperation';
import Operation from './operations/Operation'
import TriggerExecutionOperation from './operations/TriggerExecutionOperation';

export default class OperationFactory{

    static createOperationForLogLine(execStartTime:number,logLine:String) : Operation | null {
        let tokens:String[]  = logLine.split("|");
        if(tokens && tokens.length>1){
            if(tokens[1].startsWith("METHOD_")){
                return new MethodOperation(execStartTime,tokens);
            }else if(tokens[1].startsWith("SOQL_EXECUTE_")){
                return new QueryOperation(execStartTime,tokens);
            }else if(tokens[1].startsWith("DML_")){
                return new DMLOperation(execStartTime,tokens);
            }else if(tokens[1].startsWith("EXECUTION_")){
                return new ExecutionOperation(execStartTime,tokens);
            }else if(tokens[1].startsWith("CODE_UNIT_")){
                //Check if this is a trigger
                if(tokens[tokens.length-1].indexOf("trigger")>-1){
                    //this is a trigger code execution
                    return new TriggerExecutionOperation(execStartTime,tokens);
                }else{
                    return new MethodOperation(execStartTime,tokens);
                }
            }
        }

        return null;
		
	}
}