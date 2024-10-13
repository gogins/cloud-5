#!/bin/python3
'''
Patching Strudel...
'''
import os
import os.path

# We don't want to patch any file more than once.

'''
Workaround for a bug in Csound's handling of string pfields; Strudel controls 
passed in p6 as a string have to be omitted to preserve other pfields.
'''
csound_mjs_filepath = "strudel/packages/csound/index.mjs"
print(f"Patching '{csound_mjs_filepath}'")
with open(csound_mjs_filepath, "r+") as file:
  find_this = '''i ${p1} ${p2} ${p3} ${p4} ${p5} "${p6}"'''
  replace_with = '''i ${p1} ${p2} ${p3} ${p4} ${p5}'''
  text = file.read()
  patched_text = text.replace(find_this, replace_with)
  find_this = '''    p1 = `"{instrument}"`;'''
  replace_with = '''    p1 = `"${instrument}"`;'''
  patched_text = patched_text.replace(find_this, replace_with)
  print(patched_text)
  file.seek(0)
  file.truncate()
  file.write(patched_text)
  
'''
Fixes Strudel so that undici does not fail on a URL containing '//' in a 
pathspec.
'''
webaudio_sampler_mjs_filepath = "strudel/packages/superdough/sampler.mjs";
print(f"Patching '{webaudio_sampler_mjs_filepath}'")
with open(webaudio_sampler_mjs_filepath, "r+") as file:
  find_this = '''`https://raw.githubusercontent.com/${path}/strudel.json`;'''
  replace_with = '''`https://raw.githubusercontent.com/${path}/strudel.json`.replace("//strudel.json", "/strudel.json");'''
  text = file.read()
  patched_text = text.replace(find_this, replace_with)
  print(patched_text)
  file.seek(0)
  file.truncate()
  file.write(patched_text)
  
'''
Fixes Strudel so that HTML pages are not cached by Workbox, which was screwing 
up navigation on the Web site, and to build sourcemaps.
'''
astro_config_mjs_filepath = "strudel/website/astro.config.mjs";
print(f"Patching '{astro_config_mjs_filepath}'")
with open(astro_config_mjs_filepath, "r+") as file:
  find_this =    '''      workbox: {
        globPatterns: ['**/*.{js,css,html'''
  replace_with = '''      // MKG patch...
      workbox: {
        globPatterns: ['**/*.{js,css'''
  text = file.read()
  patched_text = text.replace(find_this, replace_with)
  find_this = '''  vite: {
    ssr: {
      // Example: Force a broken package to skip SSR processing, if needed
      // external: ['fraction.js'], // https://github.com/infusion/Fraction.js/issues/51
    },
  },'''
  replace_with = '''
// MKG patch...
    vite: {
    ssr: {
      // Example: Force a broken package to skip SSR processing, if needed
      // external: ['fraction.js'], // https://github.com/infusion/Fraction.js/issues/51
    },
    build: {
        sourcemap: true,
    },
  },
// MKG patch.
  '''
  patched_text = patched_text.replace(find_this, replace_with)
  print(patched_text)
  file.seek(0)
  file.truncate()
  file.write(patched_text)
  
'''
Fixes Strudel so that _all_ triggers go to the default output. This helps
with creating stateful patterns.
'''
# pattern_mjs_filepath = "strudel/packages/core/pattern.mjs";
# print(f"Patching '{pattern_mjs_filepath}'")
# with open(pattern_mjs_filepath, "r+") as file:
#   find_this = '''if (!dominant && hap.context.onTrigger) {'''
#   replace_with = '''if (hap.context.onTrigger) {'''
#   text = file.read()
#   patched_text = text.replace(find_this, replace_with)
#   print(patched_text)
#   file.seek(0)
#   file.truncate()
#   file.write(patched_text)

'''
Fixes the Strudel piano roll to display haps from stateful Patterns as 
an alternative to regular patterns (which still work).
'''
pattern_mjs_filepath = "strudel/packages/draw/pianoroll.mjs";
print(f"Patching '{pattern_mjs_filepath}'")
with open(pattern_mjs_filepath, "r+") as file:
  find_this = '''    (haps, time) => {
      pianoroll({
  '''
  replace_with = '''    (haps, time) => {
      // BEGIN MKG PATCH
      // Usually haps is much much larger than haps_from_outputs.
      /*
      if (globalThis.haps_from_outputs) {
      } else {
        globalThis.haps_from_outputs = [];
      }
      if (globalThis.haps_from_outputs.length > 0) {
        haps.push(...globalThis.haps_from_outputs);
        haps = globalThis.haps_from_outputs.filter(inFrame);
        globalThis.haps_from_outputs = haps;
      }
      */
      // END MKG PATCH
      pianoroll({
'''
  text = file.read()
  patched_text = text.replace(find_this, replace_with)
  print(patched_text)
  file.seek(0)
  file.truncate()
  file.write(patched_text)

'''
Fixes Strudel to store the single Cyclist in globalThis, 
and to null the Haps buffer for pianoroll in the start function.
'''
cyclist_mjs_filepath = "strudel/packages/core/cyclist.mjs";
print(f"Patching '{cyclist_mjs_filepath}'")
with open(cyclist_mjs_filepath, "r+") as file:
  find_this = '''      interval, // duration of each cycle
      0.1,
      0.1,
      setInterval,
      clearInterval,
    );
  }
  now() {'''
  replace_with = '''      interval, // duration of each cycle
      0.1,
      0.1,
      setInterval,
      clearInterval,
    );
// MKG patch...
    let that = this;
    globalThis.__cyclist__ = that;
// MKG patch.
  }
  now() {'''
  text = file.read()
  patched_text = text.replace(find_this, replace_with)
  find_this = '''    this.clock.start();
    this.setStarted(true);
  }'''
  replace_with = '''// MKG patch...
    this.clock.start();
    this.setStarted(true);
    globalThis.haps_from_outputs = null;
  }
// MKG patch.
  '''
  patched_text = patched_text.replace(find_this, replace_with);
  print(patched_text)
  file.seek(0)
  file.truncate()
  file.write(patched_text)
  
'''
Fixes Strudel to send Haps to `pianoroll` directly from the default output.
'''
webaudio_mjs_filepath = "strudel/packages/webaudio/webaudio.mjs";
print(f"Patching '{webaudio_mjs_filepath}'")
with open(webaudio_mjs_filepath, "r+") as file:
  find_this = '''export const webaudioOutputTrigger = (t, hap, ct, cps) => superdough(hap2value(hap), t - ct, hap.duration / cps, cps);
export const webaudioOutput = (hap, deadline, hapDuration) => superdough(hap2value(hap), deadline, hapDuration);'''
  replace_with = '''// MKG patch... 
  export const webaudioOutputTrigger = (t, hap, ct, cps) => {
  if (globalThis.haps_from_outputs) {
      globalThis.haps_from_outputs.push(hap);
  }
  superdough(hap2value(hap), t - ct, hap.duration / cps, cps);
};

export const webaudioOutput = (hap, deadline, hapDuration) => {
  if (globalThis.haps_from_outputs) {
      globalThis.haps_from_outputs.push(hap);
  }
  superdough(hap2value(hap), deadline, hapDuration);
};
// MKG patch.
'''
  text = file.read()
  patched_text = text.replace(find_this, replace_with)
  print(patched_text)
  file.seek(0)
  file.truncate()
  file.write(patched_text)
  
  

