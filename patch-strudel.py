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
  file.write(patched_text)
  
