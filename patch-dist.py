#!/bin/python3
'''
Patching cloud-5 dist with relative asset filepaths in the Strudel REPL iframe...
'''
import os
import os.path

index_html_filepath = "strudel/website/dist/index.html"
strudel_repl_html_filepath = "cloud-5/strudel_repl.html"
print(f"Patching '{index_html_filepath}'")
with open(index_html_filepath, "r+") as input_file:
  find_this = '="/'
  replace_with = '="./'
  text = input_file.read()
  patched_text = text;
  # Not needed if cloud-5 is Web root.
  #~ patched_text = text.replace(find_this, replace_with)
  # Needed:
  find_this = '<style>astro-island,'
  replace_with = '''
  <script>
    if ('caches' in window) {
        caches.keys().then(function(names) {
        for (let name of names)
            caches.delete(name);
            console.log(`deleted ${name} from caches.`);
        });
    }
    </script>
    <style>astro-island,'''
  patched_text = text.replace(find_this, replace_with)
  print(patched_text)
  with open(strudel_repl_html_filepath, "w") as output_file:
      output_file.write(patched_text)
      
  
  


  