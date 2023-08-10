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
  print(patched_text)
  file.seek(0)
  file.truncate()
  file.write(patched_text)
  
'''
Fixes Strudel so that undici does not fail on a URL containing '//' in a 
pathspec.
'''
webaudio_sampler_mjs_filepath = "strudel/packages/webaudio/sampler.mjs";
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
up navigation on the Web site.
'''
astro_config_mjs_filepath = "strudel/website/astro.config.mjs";
print(f"Patching '{astro_config_mjs_filepath}'")
with open(astro_config_mjs_filepath, "r+") as file:
  find_this =    '''globPatterns: ['**/*.{js,css,html,ico,png,svg,json,wav,mp3,ogg}']'''
  replace_with = '''globPatterns: ['**/*.{js,css,ico,png,svg,json,wav,mp3,ogg}']'''
  text = file.read()
  patched_text = text.replace(find_this, replace_with)
  print(patched_text)
  file.seek(0)
  file.truncate()
  file.write(patched_text)
  
'''
Fixes Strudel so that _all_ triggers go to the default output. This helps
with creating stateful patterns.
'''
pattern_mjs_filepath = "strudel/packages/core/pattern.mjs";
print(f"Patching '{pattern_mjs_filepath}'")
with open(astro_config_mjs_filepath, "r+") as file:
  find_this = '''`if (!dominant && hap.context.onTrigger) {`;'''
  replace_with = '''`if (hap.context.onTrigger) {;'''
  text = file.read()
  patched_text = text.replace(find_this, replace_with)
  print(patched_text)
  file.seek(0)
  file.truncate()
  file.write(patched_text)

  

