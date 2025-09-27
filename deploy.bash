#/bin/bash
echo Deploying strudel/website/dist contents to GitHub pages...
cd ~/gogins.github.io
pwd
git checkout main
echo Removing all of _astro...
git rm -rf _astro
echo Copying static Web site...
cp -r ~/cloud-5/strudel/website/dist/* .
touch .nojekyll
rm cloud-5.zip
git add . 
git status
git commit -m "Deploy updated Web site."
git push
pwd
echo "Completed deployment of strudel/website/dist to GitHub pages."