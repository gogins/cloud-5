#!/bin/python3
'''
Patching Strudel to import csoundac.mjs..
'''
import os
import os.path

# We don't want to patch any file more than once.

Repl_jsx_filepath = "strudel/website/src/repl/Repl.jsx"
print(f"Patching '{Repl_jsx_filepath}'")
with open(Repl_jsx_filepath, "r+") as file:
  find_this ='''import('@strudel.cycles/csound'),
];'''
  replace_with = '''import('@strudel.cycles/csound'),
  import('@strudel.cycles/csoundac'),
];'''
  text = file.read()
  patched_text = text.replace(find_this, replace_with)
  print(patched_text)
  file.seek(0)
  file.truncate()
  file.write(patched_text)
  
csound_mjs_filepath = "strudel/packages/csound/csound.mjs"
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
  
