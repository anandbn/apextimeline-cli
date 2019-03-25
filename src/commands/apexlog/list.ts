import { core, flags, SfdxCommand, SfdxResult } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('apexlogparser', 'list');

export default class List extends SfdxCommand {

    public static description = messages.getMessage('commandDescription');

    public static examples = [
        `$ sfdx apexlog:list --targetusername myOrg@example.com 
        Total log records returned : 10
        Log Id              User Id       Duration (ms)  Log Length (bytes)  Operation                          StartTime
        ──────────────────  ────────────  ─────────────  ──────────────────  ─────────────────────────────────  ────────────────────────────
        07L2F00000CaPbqUAF  Log User      126            31657               /apex/MyVFPage                     2019-03-22T13:56:57.000+0000
        ....
        ...
        `,
        `$ sfdx apexlog:list --targetusername myOrg@example.com -o MyVF
        Total log records returned : 10
        Log Id              User Id       Duration (ms)  Log Length (bytes)  Operation                          StartTime
        ──────────────────  ────────────  ─────────────  ──────────────────  ─────────────────────────────────  ────────────────────────────
        07L2F00000CaPbqUAF  Log User      126            31657               /apex/MyVFPage                     2019-03-22T13:56:57.000+0000
        ....
        ...
        `,
        `$ sfdx apexlog:list --targetusername myOrg@example.com -l "John Doe"
        Total log records returned : 10
        Log Id              User Id       Duration (ms)  Log Length (bytes)  Operation                          StartTime
        ──────────────────  ────────────  ─────────────  ──────────────────  ─────────────────────────────────  ────────────────────────────
        07L2F00000CaPbqUAF  John Doe      126            31657               /apex/MyVFPage                     2019-03-22T13:56:57.000+0000
        ....
        ...
        `,
        `$ sfdx apexlog:list --targetusername myOrg@example.com -l "<name of user to filter>" -r 100
        Total log records returned : 100
        Log Id              User Id       Duration (ms)  Log Length (bytes)  Operation                          StartTime
        ──────────────────  ────────────  ─────────────  ──────────────────  ─────────────────────────────────  ────────────────────────────
        07L2F00000CaPbqUAF  Log User      126            31657               /apex/MyVFPage                     2019-03-22T13:56:57.000+0000
        ....
        ...
        `
    ];

    public static args = [
    ];


    protected static flagsConfig = {
        // add --version flag to show CLI version
        version: flags.version({ char: 'v' }),
        help: flags.help({ char: 'h' }),
        rowlimit: flags.integer({ char: 'r', description: 'Maximum rows to display', default: 10 }),
        sort: flags.string({ char: 's', description: 'Sorting order based on LastModifiedDate', default: 'desc' }),
        loguser: flags.string({ char: 'l', description: 'Name of user that you want to filter by'}),
        operation: flags.string({ char: 'o', description: 'Operation (Apex/VF/Aura/Trigger/Class) etc. to filter by'})

    };

    public static result: SfdxResult = {
        tableColumnData: {
            columns: [
                { key: 'Id', label: 'Log Id' },
                { key: 'LogUser.Name', label: 'User Id' },
                { key: 'DurationMilliseconds', label: 'Duration (ms)' },
                { key: 'LogLength', label: 'Log Length (bytes)' },
                { key: 'Operation'},
                { key: 'StartTime' },
            ]
        },
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

    public async run(): Promise<AnyJson> {

        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();
        let query = 'SELECT Application,DurationMilliseconds,Id,LastModifiedDate,Location,LogLength,LogUser.Name,Operation,Request,StartTime,Status FROM ApexLog';
        if(this.flags.loguser || this.flags.operation){
            query +=` where `;
            let criteria = new Array();

            if(this.flags.loguser){
                criteria.push(`LogUser.Name= '${this.flags.loguser}'`);
            }
            if(this.flags.operation){
                criteria.push(`Operation like '${this.flags.operation}'`);
            }
            query +=criteria.join(' and ');
        }
        query+= ` order by LastModifiedDate ${this.flags.sort}` ;
        query+=` limit ${this.flags.rowlimit}`;

        //this.ux.log(`Executing query : ${query}`);
        // The type we are querying for
        interface ApexLog {
            Application: string,
            DurationMilliseconds: number,
            Id: string,
            LogLength: number,
            LogUserId: string,
            Operation: string,
            Request: string,
            StartTime: string,
            attributes:object
        }

        // Query the org
        const result = await conn.query<ApexLog>(query);

        this.ux.log(`Total log records returned : ${result.records.length}`);
        var table = new Array();
        if (!result.records || result.records.length <= 0) {
            throw new core.SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        } else {
            for(var i=0;i<result.records.length;i++){
                delete result.records[i].attributes;
                //this.ux.log(JSON.stringify(result.records[i]));
                table.push(result.records[i]);
            }
        }


        //let outputString = JSON.stringify(table);

        //this.ux.log(outputString);
        if (this.flags.force && this.args.logFile) {
            this.ux.log(`You input --force and a file: ${this.args.logFile}`);
        }


        if (this.flags.force && this.args.logFile) {
            this.ux.log(`You input --force and a file: ${this.args.logFile}`);
        }

        // Return an object to be displayed with --json
        return  table;
    }
}
