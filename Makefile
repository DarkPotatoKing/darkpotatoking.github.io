p: pushall
pushall:
	git add .
	git commit
	git push origin master
pushtogh:
	git add .
	git commit
	git push origin gh-pages
commit:
	git commit
push:
	git push origin gh-pages
status:
	git status