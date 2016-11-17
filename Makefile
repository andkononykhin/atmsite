.PHONY: all client pep8 env db dist install collectstatic


all: env db dist

# https://gist.github.com/isaacs/579814
# ways of node.js and npm installation


CLIENT=./atmusers/client
STATIC=./static


pep8:
	source env/bin/activate && \
		pep8 . --exclude="env,node_modules,migrations"

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
	make -C $(CLIENT) dist

collectstatic:
	source env/bin/activate && \
		python manage.py collectstatic --ignore node_modules --ignore bower_components

dist: client collectstatic

install:
	make env db && \
	make -C $(CLIENT) env && \
	make dist

clean:
	rm -rf env
	rm -f *.sqlite3
	rm -rf $(STATIC)/*
	make -C $(CLIENT) distclean

