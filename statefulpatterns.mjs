/*
 * STATEFULPATTERNS MODULE FOR STRUDEL
 *
 * Author: Michael Gogins
 * 
 * This module implements "stateful Patterns" by defining a base class, 
 * `StatefulPatterns`, that knows how to register class methods as Patterns.
 */
let csound = globalThis.__csound__;
let csoundac = globalThis.__csoundac__;
let audioContext = new AudioContext();

/**
 * Sets the level of diagnostic messages in this module.
 */
let diagnostic_level_ = 1;

/**
 * Gets and/or sets the level of diagnostic messages.
 * 
 * @param {number} new_level The new diagnostic level.
 * @returns {number} The previous diagnostic level.
 */
export function diagnostic_level(new_level) {
    let old_level = diagnostic_level_;
    if (typeof new_level !== 'undefined') {
        diagnostic_level_ = new_level;
    }
    return old_level;
};

export const ALWAYS = 5;
export const DEBUG = 4;
export const INFORMATION = 3;
export const WARNING = 2;
export const ERROR = 1;
export const NEVER = 0;

/**
 * Prints a diagnostic message to both the Strudel logger and the Csound 
 * log. Messages are printed only for the specifed diagnostic level or less.
 *
 * @param {string} message Text of the message.
 * @param {number} level Diagnostic level, defaulting to WARNING.
 */
export function diagnostic(message, level = WARNING) {
    if (level <= diagnostic_level_) {
        const text = 'L' + level + ' ' + audioContext.currentTime.toFixed(4) + ' [csac]' + message;
        logger(text, 'debug');
        if (csound) csound.message(text);
    }
};

/**
 * This is a base class that can be used to _automatically_ define Patterns 
 * that hold state between queries. Derived classes, which must be defined at 
 * module scope, must in their constructor call `this.registerPatterns`, which 
 * will automatically register (most of) of their methods as Strudel Patterns, 
 * each of which takes an instance of the class as a first parameter, and the 
 * Pattern as the last parameter. Class methods must have the following syntax 
 * and semantics:
 * <pre>
 * Class.Pat(is_onset, [0 or more arguments to be patternified], hap) {...}
 * </pre>
 * Strudel will pass `true` for `is_onset` on the onset of the Pattern's cycle, 
 * and `false` for `is_onset` for every query in that cycle. Therefore, the 
 * class method must update its state if `is_onset` is true, and return the 
 * hap, without changing its value; and if 'is_onset' is false, the method must 
 * update and return the hap, and its usually new value.
 *
 * In this way, derived classes act like stateful values that have Pattern 
 * methods as class methods.
 */
export class StatefulPatterns {
  constructor() {}

  registerPatterns() {
    const proto = Object.getPrototypeOf(this);
    for (const name of Object.getOwnPropertyNames(proto)) {
      const method = this[name];
      if (typeof method === 'function'
          && method.name !== this.constructor.name
          && method.name !== 'registerPatterns') {

        // how many params the method expects (e.g. is_onset, ..., hap)
        // we add 1 so we can pick the correct registration shape
        let arity = method.length + 1;
        const stateful = this;

        const make = (factory) => {
          const op = register(name, factory);
          (typeof globalThis !== 'undefined' ? globalThis : window)[name] = op;
        };

        if (arity === 3) {
          make((statefulArg, pat) =>
            pat
              .onTrigger((hap, deadline, duration) => {
                try {
                  // keep your method’s contract: (is_onset, ..., hap)
                  stateful.current_time = deadline;
                  method.call(statefulArg, true, hap);
                } catch (e) {
                  if (typeof diagnostic === 'function') diagnostic(`[registerStateful][${method.name}] onset error: ${e}\n`, ERROR);
                }
              })
              .withHap((hap) => {
                try {
                  // map non-onset / continuous updates
                  stateful.current_time = getAudioContext().currentTime;
                  return method.call(statefulArg, false, hap) || hap;
                } catch (e) {
                  if (typeof diagnostic === 'function') diagnostic(`[registerStateful][${method.name}] withHap error: ${e}\n`, ERROR);
                  return hap;
                }
              })
          );
        } else if (arity === 4) {
          make((statefulArg, p2, pat) =>
            pat
              .onTrigger((hap, deadline, duration) => {
                try {
                  stateful.current_time = deadline;
                  method.call(statefulArg, true, p2, hap);
                } catch (e) {
                  if (typeof diagnostic === 'function') diagnostic(`[registerStateful][${method.name}] onset error: ${e}\n`, ERROR);
                }
              })
              .withHap((hap) => {
                try {
                  stateful.current_time = getAudioContext().currentTime;
                  return method.call(statefulArg, false, p2, hap) || hap;
                } catch (e) {
                  if (typeof diagnostic === 'function') diagnostic(`[registerStateful][${method.name}] withHap error: ${e}\n`, ERROR);
                  return hap;
                }
              })
          );
        } else if (arity === 5) {
          make((statefulArg, p2, p3, pat) =>
            pat
              .onTrigger((hap, deadline, duration) => {
                try {
                  stateful.current_time = deadline;
                  method.call(statefulArg, true, p2, p3, hap);
                } catch (e) {
                  if (typeof diagnostic === 'function') diagnostic(`[registerStateful][${method.name}] onset error: ${e}\n`, ERROR);
                }
              })
              .withHap((hap) => {
                try {
                  stateful.current_time = getAudioContext().currentTime;
                  return method.call(statefulArg, false, p2, p3, hap) || hap;
                } catch (e) {
                  if (typeof diagnostic === 'function') diagnostic(`[registerStateful][${method.name}] withHap error: ${e}\n`, ERROR);
                  return hap;
                }
              })
          );
        } else if (arity === 6) {
          make((statefulArg, p2, p3, p4, pat) =>
            pat
              .onTrigger((hap, deadline, duration) => {
                try {
                  stateful.current_time = deadline;
                  method.call(statefulArg, true, p2, p3, p4, hap);
                } catch (e) {
                  if (typeof diagnostic === 'function') diagnostic(`[registerStateful][${method.name}] onset error: ${e}\n`, ERROR);
                }
              })
              .withHap((hap) => {
                try {
                  stateful.current_time = getAudioContext().currentTime;
                  return method.call(statefulArg, false, p2, p3, p4, hap) || hap;
                } catch (e) {
                  if (typeof diagnostic === 'function') diagnostic(`[registerStateful][${method.name}] withHap error: ${e}\n`, ERROR);
                  return hap;
                }
              })
          );
        }
      }
    }
  }
}

