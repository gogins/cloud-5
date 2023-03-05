/**
  * This file implements real-time and/or "always-on" score generation for 
  * cloud-music. Time is provided by performance.now() or from 
  * BaseAudioContext.currentTime.
  * 
  * Author: Michael Gogins
  * Copyright: 2023.
  * Licence: GNU Lesser General Public License, version 2.1.
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
    * children.
    */
  generate(events, transformation) {
  };
};

class Performer extends Node {
  constructor() {
    this.root = new Node();
    this.keep_running = false;
  };
  start() {
  }
  stop() {
  }
  tick() {
  }
};