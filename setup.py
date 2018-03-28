# Copyright (c) LinkedIn Corporation. All rights reserved. Licensed under the BSD-2 Clause license.
# See LICENSE in the project root for license information.

import setuptools
import re
import string

version = '0.0.1'

setuptools.setup(
    name='oncall_admin',
    version=version,
    package_dir={'': 'src'},
    packages=setuptools.find_packages('src'),
    include_package_data=True,
    install_requires=[
        'appdirs==1.4.3',
        'configparser==3.5.0',
        'enum34==1.1.6',
        'falcon==1.1.0',
        'flake8==3.3.0',
        'gevent==1.1.2',
        'greenlet==0.4.12',
        'gunicorn==19.7.1',
        'mccabe==0.6.1',
        'packaging==16.8',
        'pycodestyle==2.3.1',
        'pyflakes==1.5.0',
        'PyMySQL==0.7.2',
        'pyparsing==2.2.0',
        'python-mimeparse==1.6.0',
        'PyYAML==3.11',
        'six==1.10.0',
        'SQLAlchemy==1.0.11',
        'phonenumbers==7.4.1',
        'ujson==1.35',
        'python-ldap==2.4.9'
    ],
)
