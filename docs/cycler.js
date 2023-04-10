/**
  * This file implements real-time and/or "always-on" score generation for 
  * cloud-music. 
  * 
  * Author: Michael Gogins
  * Copyright: 2023.
  * Licence: GNU Lesser General Public License, version 2.1.
  *
  * Algorithm
  * ---------
  *
  * This algorithm is _very_ loosely inspired by Tidal Cycles. This algorithm 
  * is concerned only with generating and processing Events; these are 
  * numerical vectors that correspond directly to Csound "i" statements, 
  * usually notes. (Control signals are generated either within Csound 
  * instruments, or as JavaScript calls to `Csound.setChannelValue`.) 
  *
  * Another difference is that Tidal Cycles resolves every note to its own 
  * node in the graph to be performed, whereas here any node, even leaf nodes,
  * may contain processes or scores that produce multiple notes.
  *
  * By using Csound for almost all scheduling, the poor resolution and jitter 
  * of JavaScript timers, which have been imposed as defenses against timing-
  * based attacks, can affect only the repeat times of cycles.
  *
  * A composition is a directed acyclic graph of Nodes that generate Events 
  * for a Score that is periodically sent to Csound. Each Node has a nominal 
  * interval, defaulting to 1. Any Node can either generate Events, or 
  * transform Events produced by its child Nodes, or both. Parent nodes can 
  * have any number of child Nodes. Nominal times are translated to cycle 
  * onsets and intervals for each traversal of the graph, from the top down, 
  * then Events are generated and/or transformed, from the bottom up. At the 
  * end of each traversal, the generated Score is rescaled by tempo and sent 
  * to Csound for rendering in real time. The next traversal is then 
  * scheduled, after correcting its interval for compute time and timer drift.
  *
  * The composer must derive new classes from Node, in which he or she defines 
  * the generation and/or transformation of Events in the piece, and assemble 
  * these derived Nodes into a graph rooted in a Performer.
  *
  * The fundamental types of Nodes are:
  *
  * 1. Node (base class).
  * 2. Sequence, where adding (or repeating) child Nodes expands the interval 
  *    of the parent Sequence to equal the sum of intervals of its child 
  *    Nodes.
  * 3. Nest, where adding (or repeating) child Nodes squeezes the child Nodes 
  *    to fit within the interval of the parent Nest. 
  * 4. Stack, which performs two or more child Nodes simultaneously. Their 
  *    intervals may diffe from that of the parent and/or those of sibling 
  *    Nodes, thus enabling differential canons and other structures.
  */

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var cycler_logging_enabled = true;
  
function cycler_log(message) {
  typeof message !== 'undefined' ? message : '';
  if (cycler_logging_enabled === true) {
    const current_time = audioContext.currentTime;
    const text = sprintf("[cycler][%9.4f] %s", current_time, message);
    console.log(text);
  }
}
/**
  * Base class for for all Nodes.
  */
class Node {
  constructor() {
    this.parent = this;
    this.children = new Array();
    this.times = {nominal: {}, traversal: {}};
    // Nominal intervals (Node durations) default to 1, but may be redefined 
    // by the composer, and afterwards remain unchanged; they form the basis 
    // for computing all other times. Nominal onsets are assumed to be 0.
    this.times.nominal.interval = 1.;
    // Traversal times are obtained when the nominal times are rescaled to 
    // expand parent Nodes, or squeeze child Nodes, during traversal of the 
    // tree. Performance times are obtained by multiplying intervals by 
    // seconds per cycle. 
    this.times.traversal.onset = 0.;
    this.times.traversal.interval = 1.;
    this.local_score = new CsoundAC.Score();
    cycler_log();
  };
  /**
    * Pushes the child Node onto the children of this.
    */
  add_child(child) {
    child.parent = this;
    this.children.push(child);
  }
  /**
    * Adjusts the traversal intervals of this and/or the children of this 
    * to fit each other. The default implementation does nothing.
    */
  update_intervals() {
  }
  /**
    * Adjusts the traversal onsets of this and/or the children of this 
    * to fit their successive intervals.
    */
  update_onsets() {
    if (this.children.length > 0) {
      let onset = 0;
      this.children[0].times.traversal.onset = onset;
      cycler_log(sprintf("[update_onsets] child: %6d onset: %9.4f", 0, onset));
      for (let i = 1; i < this.children.length; ++i) {
        onset += this.children[i - 1].times.traversal.interval;
        this.children[i].onset = onset;
        cycler_log(sprintf("[update_onsets] child: %6d onset: %9.4f", i, onset));
     }
    }
  }
  /**
    * Generates Events and pushes them onto the Score. These events can have 
    * arbitrary times, usually beginning at onset 0, but will be rescaled to 
    * match the traversal times in [onset, onset + interval). The default 
    * implementation does nothing.
    */
  generate(score) {
  };
  /**
    * Rescales the times of the Events to match [onset, onset + interval) of 
    * this. 
    */
  update_times(score) {
    let interval = this.times.traversal.interval;
    let onset = this.times.traversal.onset;
    score.setDuration(interval);
    for (let i = 0; i < score.size(); ++i) {
      let event = score.get(i);
      let new_onset = event.getTime();
      new_onset += onset;
      event.setTime(new_onset);
      score.set(i, event);
    }
    cycler_log(sprintf("[update_times] node interval:       %9.4f score duration: %9.4f onset: %9.4f", interval, score.getDurationFromZero(), onset));
  }
  /** Appends to the global Score those Events of the local Score that fall 
    * within the interval of this traversal; but retains those Events of the 
    * local Score that fall after the interval of this traversal, adjusting 
    * their onsets for the next traversal.
    */
  split_overlap(global_score, local_score) {
    let end_time = this.parent.times.traversal.interval;
    let new_local_score = new CsoundAC.Score();
    for (let i = 0; i < this.local_score.size(); ++i) {
      let event = this.local_score.get(i);
      let onset = event.getTime();
      if (onset < end_time) {
        cycler_log(sprintf("[split_overlap] i: %6d global event: %s}", i, event.toString()));
        global_score.append_event(event);
      } else {
        let new_onset = end_time - onset;
        event.setTime(new_onset);
        cycler_log(sprintf("[split_overlap] i: %6d local event:  %s}", i, event.toString()));
        new_local_score.append_event(event);
      }
    }
    this.local_score = new_local_score;
  }
  /**
    * Applies some transformation to all Events generated by this and the 
    * child Nodes of this. Such transformations should not normally affect 
    * times. The default implementation does nothing.
    */
  transform(score) {
  };
   /**
    * Traverses the directed acyclic graph defined by this and its child 
    * Nodes. 
    */
  traverse(global_score, depth) {
    cycler_log(sprintf("[traverse] depth: %5d", depth));
    // Rescale the intervals of this and its immediate children 
    // (done from the top down).
    this.update_intervals();
    // Move the onsets of the immediate children of this to match their 
    // successive intervals.
    this.update_onsets();
    // Recursively traverse all sub-trees.
    for (let child of this.children) {
      child.traverse(global_score, depth + 1);
    };
    // Optionally, generate Events and push them on the local Score 
    // (done from the bottom up).
    this.generate(this.local_score);
    // Rescale the times of any Events generated locally.
    // Move the onsets of the immediate children of this to match their 
    // successive intervals.
    this.update_times(this.local_score);
    // Postpone scheduling Events that overlap the interval of the current 
    // traversal. The local Score may contain Events that were generated in 
    // prior traversals for onsets after the interval of that traversal.
    this.split_overlap(global_score, this.local_score);
    // Optionally, transform _all_ child Events of this within the current
    // traversal; this transformation should not change times.
    this.transform(global_score);
  };
};

/**
  * Performs the immediate child nodes of this in sequence. The interval of 
  * this is the sum of the intervals of its _immediate_ children. 
  */
class Sequence extends Node {
  constructor() {
    super();
  }
  update_intervals() {
    let total_interval = 0;
    let onset = 0;
    for (let i = 0; i < this.children.length; ++i) {
      let child = this.children[i];
      child.times.traversal.onset = total_interval;
      total_interval += child.times.traversal.interval;
    }
    this.times.traversal.interval = total_interval;
    super.update_intervals();
  }
};

/**
  * Performs the immediate child nodes of this in sequence. The intervals of 
  * the _immediate_ child nodes of this are rescaled so that their sum equals 
  * the interval of this. 
  */
class Nest extends Sequence {
  constructor() {
    super();
  }
  update_intervals() {
    const this_interval = this.times.traversal.interval;
    super.update_intervals();
    const children_interval = this.times.traversal.interval;
    const scale = this_interval / children_interval;
    let total_interval = 0;
    let onset = 0;
    for (let i = 0; i < this.children.length; ++i) {
      let child = this.children[i];
      child.times.traversal_onset = total_interval;
      child.times.traversal.interval *= scale;
      child.times.traversal.onset = total_interval;
      total_interval += child.times.traversal.interval;
    }
    this.times.traversal.interval = total_interval;
  }
};

/**
  * Performs the immediate child Nodes of this simultaneously. The traversal 
  * times of the immediate child Nodes may differ from the traversal times of 
  * this, enabling the traversal times of those children to go out of and back 
  * into phase with the traversal times of this. Enables differential canons 
  * and other temporal structures.
  */
class Stack extends Node {
  constructor() {
    super();
  }
  update_intervals() {
    for (let child of this.children) {
      child.times.traversal.interval = this.times.traversal.interval * child.times.nominal.interval;
    }
  }
};

/**
  * A Player is also the root node of its graph. The root node is thus a Nest. 
  */
class Player {
  constructor(csound) {
    this.root = new Nest();
    this.csound = csound;
    this.keep_running = false;
    // Tempo in seconds per cycle. The default value is basically 8 bars of 
    // 4/4 at 120 bpm. In actual pieces this time will usually be much longer.
    this.seconds_per_cycle = 16;
    this.score = new CsoundAC.Score();
    this.divisions_per_octave = 12.;
    // Not to be confused with divisions per octave for equal temperament!
    this.conform_pitches = false;
    this.starting_time = 0;
    this.cycle_count = 0;
  };
  /**
    * Pushes the child Node onto the list of immediate children of the parent. 
    * Times are not adjusted until performance.  
    */
  add_child(child) {
    this.root.children.push(child);
    child.player = this;
  };
  current_time() {
    return audioContext.currentTime;
  }
  performance_time() {
    return this.current_time() - this.starting_time;
  }
  start() {
    cycler_log("Starting...");
    this.keep_running = true;
    this.cycle_count = 0;
    this.starting_time = this.current_time();
    this.current_rendering_time = this.performance_time();
    this.prior_rendering_time = this.performance_time();
    this.expected_traversal_time = 0;
    this.cycle();
  };
  stop() {
    this.keep_running = false;
  }
  /**
    * Sends Events generated by the current traversal _and_ within the 
    * current traversal interval to Csound for rendering.
    */
  render() {
    this.prior_rendering_time = this.current_rendering_time;
    // Rescales the generated score to fit its traversal interval in real 
    // seconds. Time 0 is the beginning of this cycle, not the beginning of 
    // this performance; and the duration is the duration not to the last 
    // _onset_ in the score, but to the last _off time_ in the score.
    const traversal_interval = this.root.times.traversal.interval * this.seconds_per_cycle;
    this.score.setDurationFromZero(traversal_interval);
    const score_text = this.score.getCsoundScore(this.divisions_per_octave, this.conform_pitches);
    cycler_log(sprintf("[render] traversal interval:        %9.4f score duration: %9.4f", traversal_interval, this.score.getDurationFromZero()));
    this.csound.readScore(score_text);
    this.current_rendering_time = this.performance_time();
    cycler_log(sprintf("[render] prior_rendering_time:      %9.4f current_rendering_time: %9.4f", this.prior_rendering_time, this.current_rendering_time));
    cycler_log(sprintf("[render] actual rendering interval: %9.4f", this.current_rendering_time - this.prior_rendering_time));
    // console.log(score_text);
  }
  /**
    * Generates, transforms, and renders Events, until stopped.
    */
  cycle() {
    // Find the amount of time spent computing this traversal.
    const current_traversal_time = this.performance_time();
    if (this.keep_running === false) {
      return;
    }
    this.cycle_count = this.cycle_count + 1;
    cycler_log(sprintf("[cycle] cycle count: %9d", this.cycle_count));
    this.score.clear();
    // Generate and/or transform one traversal's worth of events, 
    // using _traversal_ times.
    this.root.traverse(this.score, 0);
    // Render this traversal's pending events with Csound, 
    // using _real_ times.
    this.render();    
    // Subtract time spent computing this traversal from the next traversal interval.
    const compute_end = this.performance_time();
    const compute_time = compute_end - current_traversal_time;
    const traversal_interval = this.root.times.traversal.interval * this.seconds_per_cycle;
    let timer_interval = traversal_interval - compute_time;
    // Also correct for timer drift, which is measured every cycle.
    // The timer drift is the difference between the actual traversal onset 
    // and the scheduled traversal onset. The drift is positive if the actual 
    // time exceeds the expected time, and negative if the actual time falls 
    // short of the expected time.
    const timer_drift = current_traversal_time - this.expected_traversal_time;
    // The correction applies the drift in reverse.
    timer_interval = Math.max(0, timer_interval - timer_drift);
    cycler_log(sprintf("[cycle] traversal interval: %9.4f compute time: %9.4f timer drift: %9.4f timer interval:%9.4f", traversal_interval, compute_time, timer_drift, timer_interval));
    let that = this;
    let closure = function () {
      that.cycle();
    };      
    setTimeout(closure, timer_interval * 1000.);  
    this.expected_traversal_time += traversal_interval;
  };    
};






