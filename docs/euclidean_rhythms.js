/*
From: https://github.com/brianhouse/bjorklund

def bjorklund(steps, pulses):
    steps = int(steps)
    pulses = int(pulses)
    if pulses > steps:
        raise ValueError    
    pattern = []    
    counts = []
    remainders = []
    divisor = steps - pulses
    remainders.append(pulses)
    level = 0
    while True:
        counts.append(divisor // remainders[level])
        remainders.append(divisor % remainders[level])
        divisor = remainders[level]
        level = level + 1
        if remainders[level] <= 1:
            break
    counts.append(divisor)
    
    def build(level):
        if level == -1:
            pattern.append(0)
        elif level == -2:
            pattern.append(1)         
        else:
            for i in range(0, counts[level]):
                build(level - 1)
            if remainders[level] != 0:
                build(level - 2)
    
    build(level)
    i = pattern.index(1)
    pattern = pattern[i:] + pattern[0:i]
    return pattern
*/

/**
  * Calculates a Euclidean rhythm using Bjorkland's algorithm.
  * Returns a pattern (array) of size steps, filled with pulses (ones) and 
  * rests (zeros). The pattern always starts with a pulse.
  */
function euclidean_rhythm(steps, pulses) {
  steps = Math.floor(steps);
  pulses = Math.floor(pulses);
  if (pulses > steps) {
    throw new Error("Pulses must not exceed steps!");
  };
  let pattern = [];
  let counts = [];
  let remainders = [];
  let divisor = steps - pulses;
  remainders.push(pulses);
  let level = 0;
  while (true) {
    counts.push(Math.floor(divisor / remainders[level]));
    remainders.push(divisor % remainders[level]);
    divisor = remainders[level];
    level = level + 1;
    if (remainders[level] <== 1) {
      break;
    };
  };
  counts.append(divisor);
  const build = function(level) {
    if (level === -1) {
      pattern.push(0);
    } else if (level === -2) {
      pattern.push(1);
    } else {
      for (let i = 0; i < counts[level]) {
        build(level - 1);
      }
      if (remainders[level] !== 0) {
        build(level - 2);
      }
    };
  };
  // Recursively build the pattern.
  build(level);
  // Rotate the pattern until it starts on its first pulse.
  while (true) {
    let step = pattern[0];
    if (step === 1) {
      break;
    }
    pattern.push(pattern.shift());
  };
  return pattern;
};

/**
  * Applies a Euclidean rhythm to a Score, repeating the Rhythm as needed. 
  * Events that occur at exactly the same time receive the same pulse. The 
  * Score will be rescaled to have its original duration. Silence at the 
  * beginning of the Score is not accounted for. The durations of notes are 
  * not affected. A fake pulse is used to enable looping and chaining of 
  * Scores without disrupting the rhythm.
  */
function apply_euclidean(euclidean, score) {
  let onsets = [];
  for (let step = 0; step < euclidean.length; ++step) {
    if (euclidean[step] === 1) {
      onsets.push(step);
    }
  }
  score.Sort();
  const original_duration = score.getDurationFromZero();
  let prior_time = 0;
  let current_time = 0;
  let step = 0;
  for (let i = 0; i < score.size(); ++i) {
    let event = score.get(i);
    prior_time = time;
    current_time = event.getTime();
    if (current_time === prior_time) {
      let onset = 
    }
    
  }
  
  score.setDurationFromZero(original_duration);
};


