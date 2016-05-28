
default:  # no default

# Need to run json-server in one window, then either grunt or gulp in another.

.PHONY:	json-server
json-server:
	# Runs until killed.
	cd json-server; json-server --watch db.json

.PHONY: mongod
mongod:
	mkdir -p mongodb/data
	cd mongodb; mongod --dbpath=data --smallfiles

.PHONY: grunt
grunt:
	# Runs until killed.
	grunt serve

.PHONY: gulp
gulp:
	# Runs until killed.
	gulp watch

# After clobber or fresh git clone, make setup.
# Pulls a bunch of stuff from Internet.
.PHONY: setup
setup:
	bower install
	npm install

# Remove temporary stuff that is automatically recreated when needed.
.PHONY: clean
clean:
	rm -rf dist .tmp
	find app -name '*~' -print0 | xargs -0 rm -f
	rm -f *~

# Make as from git clone.
.PHONY: clobber
clobber:	clean
	rm -rf bower_components
	rm -rf node_modules

