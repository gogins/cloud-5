/**
  * This file implements real-time and/or "always-on" score generation for 
  * cloud-music. Time is provided by performance.now() or by  
  * BaseAudioContext.currentTime.
  * 
  * Author: Michael Gogins
  * Copyright: 2023.
  * Licence: GNU Lesser General Public License, version 2.1.
  *
  * Algorithm
  * ---------
  *
  * A piece is a tree of Nodes. Each node has a nominal duration of 1. The 
  * Nodes in the piece are traversed depth first in each slice of time. During 
  * this traversal, the starting and end time of each Node is computed, and 
  * within that interval, Events may be generated or transformed, and added 
  * to a global Score. Some types of Nodes may rescale the intervals of their 
  * child Nodes. At the end of the traversal, the generated Score is 
  * rescaled by a tempo factor and to begin at the current performance time.
  * The Score is then sent to Csound for rendering in real time.
  */
  
/**
  * Base class for always-on performance nodes.
  */
class Node {
  constructor(performer) {
    this.performer = performer;
    this.children = new Array();
    this.start_time = 0;
    this.end_time = 1;
  };
  /**
    * Returns true if this should generate Events. The default implementation 
    * always returns true.
    */
  predicate() {
    return true;
  };
  /**
    * Applies some transformation to the child Events of this. The default 
    * implementation applies the identity transformation (i.e. does nothing).
    */
  transform(score) {
  }
  /**
    * If predicate returns true, generates and/or transforms Events and adds 
    * them to the Score.
    */
  generate(score) {
  };
  /**
    * Performs a depth-first traversal of the tree defined by this and its 
    * child Nodes. At each Node, times are computed, the predicate is 
    * evaluated, and if it is true generate and transform are called.
    */
  traverse(score) {
    
  };
};

/**
  * Performs the immediate child nodes of this in sequence. The duration of 
  * this is the sum of the durations of the immediate children.
  */
class Sequence extends Node {
};

/**
  * Performs the immediate child nodes of this in sequence. The durations of 
  * the immediate child nodes of this are rescaled so the sum equals the 
  * duration of this.
  */
class Nest extends Sequence {
};

/**
  * Generates the events of the child nodes of this, modifies them in some
  * way, and produces the modified events.
  */
class Apply extends Node {
};

/**
  * Performs the child nodes of this simultaneously. The child nodes may have 
  * different durations.
  */
class Stack extends Node {
};


/**
  * Performs the child nodes of this simultaneously. The child nodes may have 
  * different durations. Then, modifies the generated events in some way. 
  * Finally, produces both the child events and the modified child events.
  */
class StackApply extends Apply {
};


class Performer extends Node {
  constructor(csound) {
    this.csound = csound;
    this.root = new Node();
    this.timess_for_nodes = new Map();
    this.keep_running = false;
    this.interval = .02;
    this.events = new CsoundAC.Score();
    this.divisions_per_octave = 12;
    this.round_pitches = true;
    this.current_time = 0;
    this.starting_time = 0;
  };
  current_time() {
    return performance.now() / 1000;
  }
  performance_time() {
    return this.current_time() - this.starting_time();
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
    // Time 0 is the beginning of this slice, not the 
    // beginning of this performance.
    score_text = this.score.getCsoundScore(this.divisions_per_octave, this.round_pitches);
    this.csound.readScore(score_text);
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
    this.slice_start = this.performance_time();
    this.slice_end = this.slice_start + this.interval;
    // Generate one slice's worth of pending events.
    this.generate(this.events, this.getLocalCoordinates());
    // Render this slice's pending events in real time using Csound.
    this.render();    
  }
};