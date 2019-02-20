#!/usr/bin/env node

const promisify = require('util.promisify');

const Fuse = require('fuse.js');
const inq = require('inquirer');
const path = require('path');
const shell = require('shelljs');

const ncp = require('copy-paste');
  var copy = promisify(ncp.copy);

const argv = require('yargs')
  .demandCommand(1)
  .help('help', 'Show this message and exit.')
  .option('f', {
    type: 'string',
    demandOption: true,
    nargs: 1,
    desc: 'Task file to search in.'
  })
  .usage('usage: $0 -f <task_file> <query> [--help]\n\n'
    + 'Searches for command syntax from natural language query.')
  .argv;

var taskFileName = argv.f;
var tasks = require(taskFileName);

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
    { name: 'name',     weight: 0.6 },
    { name: 'keywords', weight: 0.4 }
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

