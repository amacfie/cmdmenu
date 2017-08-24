#!/usr/bin/env node

const promisify = require('util.promisify');

const Fuse = require('fuse.js');
const inq = require('inquirer');
const ncp = require('copy-paste');
  var copy = promisify(ncp.copy);
const path = require('path');
const shell = require('shelljs');

var appPath = path.dirname(process.mainModule.filename);
var tasksPath = path.join(appPath, 'tasks');
var stripExtension = function (fn) {
  return fn.replace(/\.[^/.]+$/, '');
};
var taskSetNames = shell.ls(tasksPath).map(stripExtension);

const argv = require('yargs')
  .demandCommand(1)
  .help('help', 'Show this message and exit.')
  .option('a', {
    alias: ['p', 'c', 't'],
    type: 'string',
    demandOption: true,
    nargs: 1,
    desc: 'Task set to search in.',
    choices: taskSetNames
  })
  .usage('usage: $0 -a <task_set> <query> [--help]\n\n'
    + 'Searches for command syntax relevant to natural language query.')
  .argv;

var taskSetName = argv.a;
var tasks = require(`./tasks/${taskSetName}.json`);

var allTasks = [];
var traverseTask = function (task) {
  task.value = allTasks.length;
  allTasks.push(task);
  if (!task.subtasks) { return; }
  task.subtasks.forEach(traverseTask);
};
tasks.forEach(traverseTask);

var query = argv._.join(' ');

var fuse = new Fuse(allTasks, {
  keys: [
    { name: 'name',     weight: 0.7 },
    { name: 'keywords', weight: 0.3 }
  ],
  sort: true,
  tokenize: true
});
var taskMatches = fuse.search(query);

var ask = function (lastAnswers) {
  var task = allTasks[lastAnswers['task']];
  if (!task.subtasks) {
    console.log(task.cmdText);
    if (task.numParams === 0) {
      inq.prompt({
        type: 'confirm',
        name: 'run',
        message: 'Run?',
        default: true
      })
      .then(function (answers) {
        if (answers['run']) shell.exec(task.cmdText)
      });
    } else {
      inq.prompt({
        type: 'confirm',
        name: 'copy',
        message: 'Copy?',
        default: true
      })
      .then(function (answers) {
        if (answers['copy']) return copy(task.cmdText)
      })
     .then( () => process.exit() );
    }
  } else {
    return (inq.prompt({
      type: 'list',
      name: 'task',
      message: 'Select subtask',
      pageSize: 5,
      choices: task.subtasks})
      .then(ask));
  }
};

inq.prompt({
  type: 'list',
  name: 'task',
  message: 'Select task',
  pageSize: 3,
  choices: taskMatches })
.then(ask);

