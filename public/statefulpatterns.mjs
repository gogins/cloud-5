/**
 * S T A T E F U L P A T T E R N S   M O D U L E   F O R   S T R U D E L
 *
 * Author: Michael Gogins
 * 
 * This module implements "stateful Patterns" by defining a base class, 
 * `StatefulPatterns`, that knows how to register class methods as Patterns
 */
let csound = globalThis.__csound__;
let csoundac = globalThis.__csoundac__;
let audioContext = new AudioContext();

/**
 * Sets the level of diagnostic messages in this module.
 */
let diagnostic_level_ = 5;

/**
 * Gets and/or sets the level of diagnostic messages.
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
 */
export function diagnostic(message, level = INFORMATION) {
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
 * each of which takes an instance of the class as a first parameter. Class 
 * methods must have the following syntax and semantics:
 * ```
 * Class.Pat(is_onset, [0 or more arguments to be patternified], hap) {...}
 * ```
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
    constructor() {
    }
    registerPatterns() {
        for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            let method = this[name];
            if ((method instanceof Function) &&
                (method.name !== this.constructor.name) && 
                (method.name !== 'registerMethods')) {
                let instance = this;
                // Problem: the Pattern function must explicitly declare its 
                // parameters. We can't push that information from the class 
                // method Function object into the Pattern function 
                // declaration, but we do know the arity of the class method, 
                // which is always at least 1 because of the need to pass the 
                // Hap.
                let arity = method.length;
                // For now, we will set up separate registrations for the 
                // first few arities. The actual arity of the Pattern function 
                // is always at least 3 because of the need to pass the class 
                // instance, the is_onset flag, and the Hap along with any 
                // patternifiable rguments.
                arity = arity + 1;
                if (arity === 3) {
                    let registration = register(name, (stateful, pat) => {
                        return pat.onTrigger((t, hap) => {
                            method.call(stateful, true, hap);
                            if (diagnostic_level_ >= DEBUG) diagnostic('[registerStateful][' + method.name + '] onset:' + JSON.stringify({x, stateful}, null, 4));
                        }, false).withHap((hap) => {
                            stateful.current_time = getAudioContext().currentTime;
                            if (diagnostic_level_ >= DEBUG) diagnostic('[registerStateful][' + method.name + '] query value:' + JSON.stringify({x, stateful}, null, 4));
                            hap = method.call(stateful, false, hap);
                            return hap;
                        });
                    });
                    // There are no dynamic exports in JavaScript, so we just stuff 
                    // these into the window scope as global functions.
                    window[name] = registration;
                } else if (arity === 4) {
                    let registration = register(name, (stateful, p2, pat) => {
                        return pat.onTrigger((t, hap) => {
                            method.call(stateful, true, p2, hap);
                            if (diagnostic_level_ >= DEBUG) diagnostic('[registerStateful][' + method.name + '] onset:' + JSON.stringify({x, stateful}, null, 4));
                        }, false).withHap((hap) => {
                            stateful.current_time = getAudioContext().currentTime;
                            if (diagnostic_level_ >= DEBUG) diagnostic('[registerStateful][' + method.name + '] query value:' + JSON.stringify({x, stateful}, null, 4));
                            hap = method.call(stateful, false, p2, hap);
                            return hap;
                        });
                    });
                    window[name] = registration;
                } else if (arity === 5) {
                    let registration = register(name, (stateful, p2, p3, pat) => {
                        return pat.onTrigger((t, hap) => {
                            method.call(stateful, true, p2, p3, hap);
                            if (diagnostic_level_ >= DEBUG) diagnostic('[registerStateful][' + method.name + '] onset:' + JSON.stringify({x, stateful}, null, 4));
                        }, false).withHap((hap) => {
                            stateful.current_time = getAudioContext().currentTime;
                            if (diagnostic_level_ >= DEBUG) diagnostic('[registerStateful][' + method.name + '] query value:' + JSON.stringify({x, stateful}, null, 4));
                            hap = method.call(stateful, false, p2, p3, hap);
                            return hap;
                        });
                    });
                    window[name] = registration;
               } else if (arity === 6) {
                    let registration = register(name, (stateful, p2, p3, p4, pat) => {
                        return pat.onTrigger((t, hap) => {
                            method.call(stateful, true, p2, p3, p4, hap);
                            if (diagnostic_level_ >= DEBUG) diagnostic('[registerStateful][' + method.name + '] onset:' + JSON.stringify({x, stateful}, null, 4));
                        }, false).withHap((hap) => {
                            stateful.current_time = getAudioContext().currentTime;
                            if (diagnostic_level_ >= DEBUG) diagnostic('[registerStateful][' + method.name + '] query value:' + JSON.stringify({x, stateful}, null, 4));
                            hap = method.call(stateful, false, p2, p3, p4, hap);
                            return hap;
                        });
                    });
                    window[name] = registration;
                }
            }
        }
    }
}

