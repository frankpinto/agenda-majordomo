"use strict";

var Agenda = require('agenda');

var majordomo = function(config) {
  var agenda = null;
  var jobs = [];

  var init = function init(mongo_string, options) {
    this.agenda = new Agenda({db: {address: mongo_string}});

    process.on('SIGINT', this.stop);
  };

  this.start = function start() {
    jobs.forEach(function(job) {
      agenda.define(job.name, job.description);
      agenda.every('20 seconds', job.name);
    });
    agenda.start();
  };

  this.stop = function stop(callback) {
    agenda.stop(function() {
        console.log("\nShutting down");
        agenda.cancel({}, function() {
          if (callback)
            callback();
        });
    });
  };

  this.addJob = function addJob(name, job) {
    jobs.push({name: name, job: job});
  };

  this.addJobs = function addJob(jobs) {
    jobs.forEach(function(job) {
      this.jobs.push(job);
    });
  };

  init(config.mongodb.connection_string);
  return this;
};

module.exports = majordomo;
