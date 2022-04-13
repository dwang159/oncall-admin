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
        'appdirs==1.4.4',
        'configparser==5.2.0',
        'enum34==1.1.10',
        'falcon==3.1.0',
        'flake8==4.0.1',
        'gevent==21.12.0',
        'greenlet==1.1.2',
        'gunicorn==20.1.0',
        'mccabe==0.6.1',
        'packaging==21.3',
        'pycodestyle==2.8.0',
        'pyflakes==2.4.0',
        'PyMySQL==1.0.2',
        'pyparsing==3.0.8',
        'python-mimeparse==1.6.0',
        'PyYAML==6.0',
        'six==1.16.0',
        'SQLAlchemy==1.4.35',
        'phonenumbers==8.12.46',
        'ujson==5.2.0',
        'python-ldap==3.4.0'
    ],
)
