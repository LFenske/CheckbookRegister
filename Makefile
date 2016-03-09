
default:  # no default

# Need to run json-server in one window, then either grunt or gulp in another.

.PHONY:	json-server
json-server:
	# Runs until killed.
	cd json-server; json-server --watch db.json

grunt:
	# Runs until killed.
	grunt serve

gulp:
	# Runs until killed.
	gulp watch

# After clobber or fresh git clone, make setup.
# Pulls a bunch of stuff from Internet.
setup:
	bower install
	npm install

# Remove temporary stuff that is automatically recreated when needed.
clean:
	rm -rf dist .tmp
	find app -name '*~' -print0 | xargs -0 rm -f
	rm -f *~

# Make as from git clone.
clobber:	clean
	rm -rf bower_components
	rm -rf node_modules

