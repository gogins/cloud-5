/**
  * This file implements real-time and/or "always-on" score generation for 
  * cloud-music. Time is provided by performance.now() or by  
  * BaseAudioContext.currentTime.
  * 
  * Author: Michael Gogins
  * Copyright: 2023.
  * Licence: GNU Lesser General Public License, version 2.1.
  *
  * Provisionally using CsoundAC-wasm and math.js. Dimensions of 
  * events are the same as CsoundAC, but CsoundAC is column major while 
  * math.js is row major.
  * let transform = math.identity(11);
  * let event = math.zeros([1,11]);
  * event[10] = 1;
  */
  
/**
  * Base class for always-on performance nodes.
  * Derived classes should, at a minimum, override `Node.generate`.
  */
class Node {
  this.SEQUENCE = 1;
  this.STACK = 2;
  this.APPLY = 3;
  this.STACK_APPLY = 4;
  constructor(performer) {
    this.performer = performer;
    this.transform = math.identity(11);
    // Children are keys, types of nodes are values.
    this.children = new Map();
  };
  /**
    * Sequenced nodes start after the previous node has reached the 
    * end of its period.
    */
  sequence(node, period, predicate) {
  };
  /**
    * Stacked nodes start at the same time and render simultaneously.
    */
  stack(node, predicate) {
  };
  /**
    * Apply nodes transform events produced by their children.
    */
  apply(node, predicate) {
  };
  /**
    * Stack apply nodes not only transform events produced by their children, 
    * but also produce the original child events.
    */
  stack_apply(node, predicate) {
  };
  /** 
    * Produces events for the current time slice from this Node and its 
    * children. The default implementation simply traverses the tree for this 
    * slice and applies the transformation.
    */
  generate(events, transform) {
  };
};

class Performer extends Node {
  constructor() {
    this.root = new Node();
    this.keep_running = false;
    this.interval = .02;
    this.events = new CsoundAC.Score();
    this.divisions_per_octave = 12;
    this.round_pitches = true;
    this.current_time = 0;
    this.starting_time = 0;
  };
  current_time() {
  }
  performance_time() {
  }
  start() {
    this.keep_running = true;
    this.starting_time = performance.now() / 1000; 
    this.slice_start = 0;
    this.slice_end = this.slice_start + this.interval);
    this.tymer = setTimeout(this.tick, this.interval);
  }
  stop() {
    this.keep_running = false;
  }
  render() {
    let score_fragment = "";
    // Time 0 is the beginning of this slice, not the 
    // beginning of this performance.
    score_text = score.getCsoundScore(this.divisions_per_octave, this.round_pitches);
    csound.readScore(score_text);
  }
  /**
    * Generates and renders events indefinitely, until stopped.
    */
  tick() {
    if (this.keep_running === false) {
      return;
    } else {
      this.tymer.setTimeout(this.tick, this.interval);
    }
    this.events.clear();
    // Generate one slice's worth of pending events.
    this.generate(this.events, this.getLocalCoordinates());
    // Render this slice's pending events in real time using Csound.
    this.render();    
  }
};