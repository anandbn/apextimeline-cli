apexlogparser
=============

A Force CLI plugin for parsing apex logs

[![Version](https://img.shields.io/npm/v/apexlogparser.svg)](https://npmjs.org/package/apexlogparser)
[![CircleCI](https://circleci.com/gh/anandbn/apexlogparser/tree/master.svg?style=shield)](https://circleci.com/gh/anandbn/apexlogparser/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/anandbn/apexlogparser?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/apexlogparser/branch/master)
[![Codecov](https://codecov.io/gh/anandbn/apexlogparser/branch/master/graph/badge.svg)](https://codecov.io/gh/anandbn/apexlogparser)
[![Greenkeeper](https://badges.greenkeeper.io/anandbn/apexlogparser.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/anandbn/apexlogparser/badge.svg)](https://snyk.io/test/github/anandbn/apexlogparser)
[![Downloads/week](https://img.shields.io/npm/dw/apexlogparser.svg)](https://npmjs.org/package/apexlogparser)
[![License](https://img.shields.io/npm/l/apexlogparser.svg)](https://github.com/anandbn/apexlogparser/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g apexlogparser
$ apexlogparser COMMAND
running command...
$ apexlogparser (-v|--version|version)
apexlogparser/0.0.1 darwin-x64 node-v10.15.3
$ apexlogparser --help [COMMAND]
USAGE
  $ apexlogparser COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`apexlogparser <%= command.id %> [-v <version>] [-h <help>] [-r <integer>] [-s <string>] [-l <string>] [-o <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#apexlogparser--commandid---v-version--h-help--r-integer--s-string--l-string--o-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfatal)
* [`apexlogparser <%= command.id %> [-v <version>] [-h <help>] [-t <integer>] [-i <string>] [-o <string>] [-f <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#apexlogparser--commandid---v-version--h-help--t-integer--i-string--o-string--f-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfatal)

## `apexlogparser <%= command.id %> [-v <version>] [-h <help>] [-r <integer>] [-s <string>] [-l <string>] [-o <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

List ApexLog entries for an org and parameters

```
USAGE
  $ apexlogparser apexlog:list [-v <version>] [-h <help>] [-r <integer>] [-s <string>] [-l <string>] [-o <string>] [-u 
  <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -h, --help                                      show CLI help
  -l, --loguser=loguser                           Name of user that you want to filter by
  -o, --operation=operation                       Operation (Apex/VF/Aura/Trigger/Class) etc. to filter by
  -r, --rowlimit=rowlimit                         [default: 10] Maximum rows to display
  -s, --sort=sort                                 [default: desc] Sorting order based on LastModifiedDate
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  -v, --version                                   show CLI version
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLES
  $ sfdx apexlog:list --targetusername myOrg@example.com 
           Total log records returned : 10
           Log Id              User Id       Duration (ms)  Log Length (bytes)  Operation                          
  StartTime
           ──────────────────  ────────────  ─────────────  ──────────────────  ─────────────────────────────────  
  ────────────────────────────
           07L2F00000CaPbqUAF  Log User      126            31657               /apex/MyVFPage                     
  2019-03-22T13:56:57.000+0000
           ....
           ...
        
  $ sfdx apexlog:list --targetusername myOrg@example.com -o MyVF
           Total log records returned : 10
           Log Id              User Id       Duration (ms)  Log Length (bytes)  Operation                          
  StartTime
           ──────────────────  ────────────  ─────────────  ──────────────────  ─────────────────────────────────  
  ────────────────────────────
           07L2F00000CaPbqUAF  Log User      126            31657               /apex/MyVFPage                     
  2019-03-22T13:56:57.000+0000
           ....
           ...
        
  $ sfdx apexlog:list --targetusername myOrg@example.com -l "John Doe"
           Total log records returned : 10
           Log Id              User Id       Duration (ms)  Log Length (bytes)  Operation                          
  StartTime
           ──────────────────  ────────────  ─────────────  ──────────────────  ─────────────────────────────────  
  ────────────────────────────
           07L2F00000CaPbqUAF  John Doe      126            31657               /apex/MyVFPage                     
  2019-03-22T13:56:57.000+0000
           ....
           ...
        
  $ sfdx apexlog:list --targetusername myOrg@example.com -l "<name of user to filter>" -r 100
           Total log records returned : 100
           Log Id              User Id       Duration (ms)  Log Length (bytes)  Operation                          
  StartTime
           ──────────────────  ────────────  ─────────────  ──────────────────  ─────────────────────────────────  
  ────────────────────────────
           07L2F00000CaPbqUAF  Log User      126            31657               /apex/MyVFPage                     
  2019-03-22T13:56:57.000+0000
           ....
           ...
```

_See code: [src/commands/apexlog/list.ts](https://github.com/anandbn/apexlogparser/blob/v0.0.1/src/commands/apexlog/list.ts)_

## `apexlogparser <%= command.id %> [-v <version>] [-h <help>] [-t <integer>] [-i <string>] [-o <string>] [-f <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

Parse a logfile or Logid from an org

```
USAGE
  $ apexlogparser apexlog:parse [-v <version>] [-h <help>] [-t <integer>] [-i <string>] [-o <string>] [-f <string>] [-u 
  <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -f, --logfile=logfile                           Absolute path to log file
  -h, --help                                      show CLI help
  -i, --logid=logid                               Id of the Apex Log to be parsed
  -o, --output=output                             [default: SUMMARY] Type of operation that needs to be parsed
  -t, --timethreshold=timethreshold               [default: 10] Minimum millisecond threshold to parse and display
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  -v, --version                                   show CLI version
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLE
  $ sfdx apexlog:parse --targetusername myOrg@example.com
```

_See code: [src/commands/apexlog/parse.ts](https://github.com/anandbn/apexlogparser/blob/v0.0.1/src/commands/apexlog/parse.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
