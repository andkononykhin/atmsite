.PHONY: all node npm grunt bower dist install

PATHENV=$$HOME/local/bin:$$PATH

all: dist

# https://gist.github.com/isaacs/579814
# ways of node.js and npm installation

node:
	echo 'export PATH=$(PATHENV)' >> ~/.bashrc
	mkdir -p ~/local
	rm -rf node-latest-install && \
		mkdir node-latest-install && \
		cd node-latest-install && \
		curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1 && \
		./configure --prefix=~/local && \
		make install && \
		echo 'run ". ~/.bashrc" to update your environment'

npm:
	export PATH="$(PATHENV)" && \
		curl -L https://www.npmjs.com/install.sh | sh

grunt:
	export PATH="$(PATHENV)" && \
		npm install -g grunt-cli && \
		npm install

bower:
	export PATH="$(PATHENV)" && \
		npm install -g bower && \
		bower install

dist:
	grunt

distclean:
	grunt clean

env: grunt bower
