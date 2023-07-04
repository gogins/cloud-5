#!/bin/python3
'''
Patching Strudel...
'''
import os
import os.path

# We don't want to patch any file more than once.

  
#~ '''
#~ Integrates CsoundAC into the Strudel Web site and REPL.
#~ '''
#~ Repl_jsx_filepath = "strudel/website/src/repl/Repl.jsx"
#~ print(f"Patching '{Repl_jsx_filepath}'")
#~ with open(Repl_jsx_filepath, "r+") as file:
  #~ find_this ='''import('@strudel.cycles/csound'),
#~ ];'''
  #~ replace_with = '''import('@strudel.cycles/csound'),
  #~ import('@strudel.cycles/csoundac'),
#~ ];'''
  #~ text = file.read()
  #~ patched_text = text.replace(find_this, replace_with)
  #~ print(patched_text)
  #~ file.seek(0)
  #~ file.truncate()
  #~ file.write(patched_text)
  
#~ website_package_filepath = "strudel/website/package.json"
#~ print(f"Patching '{website_package_filepath}'")
#~ with open(website_package_filepath, "r+") as file:
  #~ find_this = '''    "@strudel.cycles/csound": "workspace:*",
#~ '''
  #~ replace_with =  '''    "@strudel.cycles/csound": "workspace:*",
    #~ "@strudel.cycles/csoundac": "workspace:*",  
#~ '''
  #~ text = file.read()
  #~ patched_text = text.replace(find_this, replace_with)
  #~ print(patched_text)
  #~ file.seek(0)
  #~ file.truncate()
  #~ file.write(patched_text)

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
