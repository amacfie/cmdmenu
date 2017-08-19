#!/usr/bin/env node

const inq = require('inquirer');
const argv = require('yargs')
  .demandCommand(1)
  .help('help', 'Show this message and exit.')
  .usage('usage: $0 <query> [--help]\n\n'
    + 'Searches for git command syntax relevant to natural language query.')
  .argv;
const Fuse = require('fuse.js');
const shell = require('shelljs');

const tasks = require('./tasks');

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

