import Operation from './operations/Operation';
import OperationFactory from './OperationFactory';
import EntryOrExit from './operations/EntryOrExit';
import DatabaseOperation from './operations/DatabaseOperation';
import TriggerExecutionOperation from './operations/TriggerExecutionOperation';

export default class LogParser {

    async parseLogFileData(rawLogData: String, timeThreshold: Number) {
        let oprStack1 = new Array();
        let execStartTime: number = -1, currOp: Operation | null,
            prevOp: Operation | null, parentOpr: Operation | null;
        let logLines =  rawLogData.split('\n')
        for(let i=0;i<logLines.length;i++) {
            let currLine = logLines[i];
            //console.log(`Line from file: ${currLine}`);
            if (currLine.indexOf('|') >= 0) {
                currOp = OperationFactory.createOperationForLogLine(execStartTime, currLine);
                if (currOp) {
                    //console.log(`Line ${lineCount++} : Operation Type = ${currOp.eventType}`);
                    if (currOp.eventType === "EXECUTION" && currOp.eventSubType == EntryOrExit[EntryOrExit.STARTED]) {
                        execStartTime = currOp.startTime;
                    }
                    prevOp = oprStack1.pop();
                    if (prevOp != null && prevOp.eventId == currOp.eventId) {

                        prevOp.endTime = currOp.startTime;

                        //Set the row count for SOQL queries
                        if (currOp.eventType === "SOQL_EXECUTE" && currOp.eventSubType == EntryOrExit[EntryOrExit.END]) {
                            (<DatabaseOperation>prevOp).setRowCount((<DatabaseOperation>currOp).getRowCount());
                        }
                        if (prevOp.getElapsedMillis() >= timeThreshold ||
                            prevOp.hasOperations() ||
                            prevOp.eventType === "SOQL_EXECUTE" ||
                            prevOp.eventType === "DML" ||
                            prevOp.eventType === "EXECUTION" ||
                            prevOp instanceof TriggerExecutionOperation) {
                            //Pop the parent & add it to paren't long running operations
                            parentOpr = oprStack1.length == 0 ? null : oprStack1.pop();
                            if (parentOpr != null) {
                                parentOpr.add(prevOp);
                                //Add the parent back to the stack
                                oprStack1.push(parentOpr);
                            } else if (oprStack1.length == 0) {
                                //In the top most method, make sure you push the 
                                //previous operation back into the stack
                                oprStack1.push(prevOp);
                            }
                        }

                    } else {
                        if (prevOp != null) {
                            //console.log(`Pushed Op: ${prevOp.eventId} to stack`);
                            oprStack1.push(prevOp);
                        }
                        oprStack1.push(currOp);
                        //console.log(`Pushed Op: ${currOp.eventId} to stack`);
                    }
                    //console.log(`Line ${lineCount} : Event Id ${currOp.eventId}, Type: ${currOp.eventType}, Sub Type: ${currOp.eventSubType} `);
                } else {
                    //console.log(`Line ${lineCount++} : Operation Type = Unknown`);

                }
            }
        }
        return oprStack1;
    }

}