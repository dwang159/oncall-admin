FROM python:alpine3.15
RUN apk add --no-cache --virtual .build-deps gcc python3-dev build-base openldap-dev mysql-client
RUN adduser -S -s /bin/bash oncall-admin

# HACK: https://github.com/python-ldap/python-ldap/issues/445
RUN echo 'INPUT ( libldap.so )' > /usr/lib/libldap_r.so

RUN pip3 install virtualenv
COPY setup.py /home/oncall-admin/setup.py
COPY src /home/oncall-admin/src

WORKDIR /home/oncall-admin

RUN virtualenv env
RUN . env/bin/activate && python3 setup.py develop

EXPOSE 16652

CMD ["/bin/sh", "-c", ". env/bin/activate && gunicorn --reload --access-logfile=- -b '0.0.0.0:16652' --worker-class gevent -e CONFIG=./configs/config.yaml oncall_admin.gunicorn:application"]
