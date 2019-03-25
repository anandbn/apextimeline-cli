import Operation  from './Operation';

export default class DatabaseOperation extends Operation {
	protected rowCount: Number | undefined;
	protected operationType: String | undefined;

	constructor(execStartTime: number, logLineTokens: String[]) {
		//12:51:16.935 (935687015)|DML_BEGIN|[209]|Op:Insert|Type:Account|Rows:1
		super(execStartTime, logLineTokens);
	}

	getRowCount() {
		return this.rowCount;
	}
	setRowCount(count: Number | undefined) {
		this.rowCount = count;
	}
}