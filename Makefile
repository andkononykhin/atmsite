.PHONY: all client pep8 env db dist install


all: env db dist

# https://gist.github.com/isaacs/579814
# ways of node.js and npm installation


pep8:
	pep8 . --exclude='env,node_modules,migrations'

env:
	virtualenv-2.7 env && \
		source env/bin/activate && \
		pip install -r requirements.txt

db:
	source env/bin/activate && \
		python manage.py makemigrations && \
		python manage.py migrate && \
		python manage.py loaddata db.dump.demo.json
		
client:
	make -C atmusers/client dist

dist: client
	python manage.py collectstatic --ignore node_modules --ignore bower_components

install:
	make env db
	make -C atmusers/client env
	make dist
