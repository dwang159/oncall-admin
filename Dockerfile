FROM ubuntu:18.04

ARG DEBIAN_FRONTEND="noninteractive"

# set the variables as per $(pyenv init -)
ENV LANG="C.UTF-8" \
    LC_ALL="C.UTF-8" \
    PATH="/opt/pyenv/shims:/opt/pyenv/bin:$PATH" \
    PYENV_ROOT="/opt/pyenv" \
    PYENV_SHELL="bash" \
    PYENV_TAG="v2.2.5" \
    PYTHON_VERSION="2.7.18"

RUN apt-get update && apt-get install -y --no-install-recommends build-essential ca-certificates curl git \
    libbz2-dev libffi-dev libncurses5-dev libncursesw5-dev libreadline-dev libsqlite3-dev libssl1.0-dev \
    llvm make netbase pkg-config tk-dev wget xz-utils zlib1g-dev libsasl2-dev libldap2-dev \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git clone -b $PYENV_TAG --single-branch --depth 1 https://github.com/pyenv/pyenv.git $PYENV_ROOT \
    && pyenv install $PYTHON_VERSION \
    && pyenv global $PYTHON_VERSION \
    && find $PYENV_ROOT/versions -type d '(' -name '__pycache__' -o -name 'test' -o -name 'tests' ')' -exec rm -rf '{}' + \
    && find $PYENV_ROOT/versions -type f '(' -name '*.pyo' -o -name '*.exe' ')' -exec rm -f '{}' + \
    && rm -rf /tmp/*

COPY src /home/oncall-admin/source/src
COPY setup.py /home/oncall-admin/source/setup.py
COPY README.md /home/oncall-admin/source/README.md
COPY LICENSE /home/oncall-admin/source/LICENSE
COPY requirements.txt /home/oncall-admin/source/requirements.txt
COPY Makefile /home/oncall-admin/source/Makefile

WORKDIR /home/oncall-admin

RUN pip install virtualenv \
    && virtualenv /home/oncall-admin/env \
    &&  /bin/bash -c 'source /home/oncall-admin/env/bin/activate && cd /home/oncall-admin/source && pip install wheel && pip install -r requirements.txt'

COPY configs /home/oncall-admin/config
EXPOSE 16652

CMD ["bash", "-c", "source /home/oncall-admin/env/bin/activate && cd /home/oncall-admin/source && python setup.py develop && make"]
