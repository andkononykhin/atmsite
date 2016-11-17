# atmsite
simple ATM model

## Overview

Proto of ATM (automated teller machine).

Backend - Django, frontend - AngularJS.

Tested on python 2.7 only.

## Installation

Install `Node.js` and `npm` and run:

```bash
$ make install
```

Please, check the details below if something goes wrong.

## Installation in details

- Install Node.js and npm

    [Possible ways](https://gist.github.com/isaacs/579814)

Inside progect's root:

- Install and activate python virtualenv

    e.g.

    ```bash
    $ virtualenv-2.7 env
    $ source env/bin/activate
    ```

- Install required python packages

    ```bash
    $ pip install -r requirements.txt
    ```

- Create a database

    ```bash
    $ python manage.py makemigrations
    $ python manage.py migrate
    ```

- (optional) Load test data to the databse

    ```bash
    $ python manage.py loaddata db.dump.demo.json
    ```

- Install bower and grunt-cli

    ```bash
    $ npm install -g grunt-cli bower
    ```

From the `atmusers/client`:

- Install necessary Node.js packets

    ```bash
    $ npm install
    ```

- Install necessary web-packages

    ```bash
    $ bower install
    ```

- Build the front-end

    ```bash
    $ grunt
    ```

From the project's root:

- Collect static files for Django

    ```bash
    $ python manage.py collectstatic --ignore node_modules --ignore bower_components
    ```

## Run

```bash
$ python manage.py runserver
```

## Demo database users

Card/pin:

    0000000000000000/0000 (admin)
    1111111111111111/1111
    2222222222222222/2222
    3333333333333333/3333
    4444444444444444/4444 (blocked)
    5555555555555555/5555
