import { core, flags, SfdxCommand, SfdxResult} from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';

import axios from 'axios';
import LogParser from '../../utils/LogParser';
import QueryOperation from '../../utils/operations/QueryOperation';
import DMLOperation from '../../utils/operations/DMLOperation';
import TriggerExecutionOperation from '../../utils/operations/TriggerExecutionOperation';
import Operation from '../../utils/operations/Operation';
import DatabaseOperation from '../../utils/operations/DatabaseOperation';
import { ANTLRInputStream, CommonTokenStream, ParserRuleContext } from 'antlr4ts';
import { SOQLParser,  Soql_queryContext, Boolean_literalContext } from "../../utils/soql-parser/SOQLParser";
import { SOQLLexer } from "../../utils/soql-parser/SOQLLexer";

import fs =require('fs');
import { ParseTree } from 'antlr4ts/tree/ParseTree';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('apexlogparser', 'parse');

export default class Parse extends SfdxCommand {

    public static description = messages.getMessage('commandDescription');
    private static ALL_SUMMARY_COLS = {
        columns: [
            { key: 'type', label: 'DB Operation Type' },
            { key: 'count', label: '# of operations' },
            { key: 'ellapsedTimeMillis', label: 'Total Time (ms)' }

        ]
    };
    private static DB_SUMMARY_COLS = {
        columns: [
            { key: 'type', label: 'DB Operation Type' },
            { key: 'name', label: 'Object / Trigger Name / Class name' },
            { key: 'rowCount', label: 'Rows' },
            { key: 'elapsedTime', label: 'Total Time (ms)' }

        ]
    };
        
    public static examples = [
        `$ sfdx apexlog:parse --targetusername myOrg@example.com 
        `,
    ];

    public static args = [
    ];


    protected static flagsConfig = {
        // add --version flag to show CLI version
        version: flags.version({ char: 'v' }),
        help: flags.help({ char: 'h' }),
        timethreshold: flags.integer({ char: 't', description: 'Minimum millisecond threshold to parse and display', default: 10 }),
        logid: flags.string({ char: 'i', description: 'Id of the Apex Log to be parsed',required:false }),
        output: flags.string({ char: 'o', description: 'Type of operation that needs to be parsed',required:false,default:"SUMMARY" }),
        logfile: flags.string({ char: 'f', description: 'Absolute path to log file',required:false }),
    };

    public static result: SfdxResult = {
        display() {
            if (Array.isArray(this.data) && this.data.length) {
                if (this.data.length > 100) {
                    // special display for large number of results
                } else {
                    this.ux.table(this.data, this.tableColumnData);
                }
            }
        }
    };
    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    //protected static supportsDevhubUsername = true;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    //protected static requiresProject = false;

    private initialize(){
        if(this.flags.output === "SUMMARY"){
            this.result.tableColumnData = Parse.ALL_SUMMARY_COLS;
        }else if(this.flags.output === "DB"){
            this.result.tableColumnData = Parse.DB_SUMMARY_COLS;

        }
        
    }
    public async run(): Promise<AnyJson> {
        this.initialize();
        if(!this.flags.logid && !this.flags.logfile){
            throw new core.SfdxError(messages.getMessage('errorInvalidParams'));
        }
        let parseResults =null;
        if(this.flags.logid){
            // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
            const conn = this.org.getConnection();
            let toolingEndpointUrl = conn.baseUrl() + `/tooling/sobjects/ApexLog/${this.flags.logid}/Body/`;
            this.ux.log(`Requesting log file data from ${toolingEndpointUrl}`);
            let response = await axios.get(toolingEndpointUrl, {
                headers: {
                    "Authorization": "OAuth " + conn.accessToken
                }
            });
            let parser = new LogParser();
            parseResults = await parser.parseLogFileData(response.data, this.flags.timethreshold);
        }else if(this.flags.logfile){
            var logData = fs.readFileSync(this.flags.logfile);
            // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
            let parser = new LogParser();
            parseResults = await parser.parseLogFileData(logData.toString(), this.flags.timethreshold);

        }


        let summary = this.summarizeResults(parseResults);
        let dbSummary = {
            summary: new Map(),
            dbOperations: new Array()
        };
        if (summary) {
            for (let i = 0; i < summary.length; i++) {
                if (summary[i] instanceof QueryOperation) {
                    let theSmry = dbSummary.summary.get("query");
                    if (!theSmry) {
                        theSmry = {
                            "type": "SOQL",
                            "count": 0,
                            "ellapsedTimeMillis": 0
                        }
                    }
                    theSmry.count++;
                    theSmry.ellapsedTimeMillis += summary[i].getElapsedMillis();
                    dbSummary.summary.set("query", theSmry);
                    let objName = this.extractObjectName(summary[i].name);
                    dbSummary.dbOperations.push({
                        "name": objName ,
                        "type":"SOQL",
                        "rowCount": summary[i].rowCount,
                        "elapsedTime": summary[i].getElapsedMillis()
                    });
                } else if (summary[i] instanceof DMLOperation) {
                    let theSmry = dbSummary.summary.get("DML");
                    if (!theSmry) {
                        theSmry = {
                            "type": "DML",
                            "count": 0,
                            "ellapsedTimeMillis": 0
                        }
                    }
                    theSmry.count++;
                    theSmry.ellapsedTimeMillis += summary[i].getElapsedMillis();
                    dbSummary.summary.set("DML", theSmry);
                    dbSummary.dbOperations.push({
                        "name": summary[i].name.split(':')[1],
                        "type":"DML",
                        "rowCount": summary[i].rowCount,
                        "elapsedTime": summary[i].getElapsedMillis()
                    });
                } else if (summary[i] instanceof TriggerExecutionOperation) {
                    let theSmry = dbSummary.summary.get("Triggers");
                    if (!theSmry) {
                        theSmry = {
                            "type": "Triggers",
                            "count": 0,
                            "ellapsedTimeMillis": 0
                        }
                    }
                    theSmry.count++;
                    theSmry.ellapsedTimeMillis += summary[i].getElapsedMillis();
                    dbSummary.summary.set("Triggers", theSmry);
                    dbSummary.dbOperations.push({
                        "name": summary[i].name,
                        "type":"Trigger",
                        "rowCount": summary[i].rowCount,
                        "elapsedTime": summary[i].getElapsedMillis()
                    });
                }
            }
        }
        if(this.flags.output === "DB"){
            return Array.from(dbSummary.dbOperations);
        }else if(this.flags.output === "SUMMARY"){
            return Array.from(dbSummary.summary.values());
        }
        
       
    }

    summarizeResults(parseResults: Array<any>): Array<any> {
        let smryResults = new Array();
        for (let i = 0; i < parseResults.length; i++) {
            this.extractDatabaseOperations(parseResults[i], smryResults);
        }
        return smryResults;
    }

    private extractDatabaseOperations(operation: Operation, smryResults: Array<Operation>) {
        if (operation instanceof DatabaseOperation) {
            smryResults.push(operation);
        }
        if (operation.hasOperations() && operation.operations && operation.operations.length > 0) {
            for (let i = 0; i < operation.operations.length; i++) {
                this.extractDatabaseOperations(operation.operations[i], smryResults);
            }
        }

    }

    private extractObjectName(soqlString){
        // Create the lexer and parser
        let inputStream = new ANTLRInputStream(soqlString);
        let lexer = new SOQLLexer(inputStream);
        let tokenStream = new CommonTokenStream(lexer);
        let parser = new SOQLParser(tokenStream);

        const soqlQueryContext: Soql_queryContext = parser.soql_query();

        return this.extractObjectNameFromSOQL(soqlQueryContext);
    }

    private extractObjectNameFromSOQL(parseTree:ParseTree | ParserRuleContext){
        let objName=null;
        if (parseTree.childCount > 0) {
            let index: number = 0,ctxName:string = parseTree.constructor.name;
            if(ctxName==="Object_nameContext" ){
                objName=parseTree.getChild(0).getChild(0).text;
            }else{
                while (index < parseTree.childCount) {
                    objName = this.extractObjectNameFromSOQL(parseTree.getChild(index++));
                    if(objName){
                        break;
                    }
                }
                
            }
        }
        return objName;
    }
}
