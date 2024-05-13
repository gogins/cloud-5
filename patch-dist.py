#!/bin/python3
'''
Patching cloud-5 dist with relative asset filepaths in the Strudel REPL iframe...
'''
import os
import os.path

index_html_filepath = "strudel/website/dist/index.html"
strudel_repl_html_filepath = "strudel_repl.html"
print(f"Patching '{index_html_filepath}'")
with open(index_html_filepath, "r+") as input_file:
  find_this = '="/'
  replace_with = '="./'
  text = input_file.read()
  patched_text = text.replace(find_this, replace_with)
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
  patched_text = patched_text.replace(find_this, replace_with)
  print(patched_text)
  with open(strudel_repl_html_filepath, "w") as output_file:
      output_file.write(patched_text)

'''
Give the site the right favicon. This must be done in the HTML <head>.
'''
index_filepath = "index.html"
print(f"Patching '{index_filepath}'")
with open(index_filepath, "r+") as input_file:
  find_this = '''</style>
  <link rel="stylesheet" href="readme.css" />
</head>
'''
  replace_with = '''</style>
  <link rel="stylesheet" href="readme.css" />
  <link rel="shortcut icon" type="image/png" href="./favicon-16x16.png">
</head>'''
  text = input_file.read()
  patched_text = text.replace(find_this, replace_with)
with open(index_filepath, "w") as output_file:
  output_file.write(patched_text)

  


  