# Copyright (c) LinkedIn Corporation. All rights reserved. Licensed under the BSD-2 Clause license.
# See LICENSE in the project root for license information.

import ldap
from oncall_admin import db
import os
import logging

logger = logging.getLogger(__name__)

connection = None
base_dn = None
search_filter = None
user_suffix = None
attrs = None


def init(config):
    global connection
    global base_dn
    global search_filter
    global user_suffix
    global attrs

    if not config or not config.get('activated'):
        return

    if config.get('ldap_cert_path'):
        cert_path = config['ldap_cert_path']
        if not os.access(cert_path, os.R_OK):
            logger.error("Failed to read ldap_cert_path certificate")
            raise IOError
        ldap.set_option(ldap.OPT_X_TLS_CACERTFILE, cert_path)

    base_dn = config.get('ldap_base_dn')
    search_filter = config.get('ldap_search_filter')
    user_suffix = config.get('ldap_user_suffix')
    attrs = config.get('attrs')

    if config.get('ldap_url') and config.get('ldap_bind_user') and config.get('ldap_bind_password'):
        connection = ldap.initialize(config.get('ldap_url'))
        connection.set_option(ldap.OPT_REFERRALS, 0)
        connection.simple_bind_s(config.get('ldap_bind_user'), config.get('ldap_bind_password'))

def get_ldap_user(username):
    ldap_user = {}
    if not connection:
        return None

    try:
        sfilter = search_filter % username
        result = connection.search_s(base_dn, ldap.SCOPE_SUBTREE, sfilter, attrs.values())
        if len(result) < 1:
            return False
        logger.info("result : %s", str(result))
        ldap_contacts = {}
        ldap_attrs = result[0][1]
        for key, val in attrs.iteritems():
            if ldap_attrs.get(val):
                if  type(ldap_attrs.get(val)) == list:
                    ldap_contacts[key] = ldap_attrs.get(val)[0]
                else:
                    ldap_contacts[key] = ldap_attrs.get(val)
            else:
                ldap_contacts[key] = val
        ldap_user[username] = ldap_contacts
    except ldap.INVALID_CREDENTIALS:
        return False
    except (ldap.SERVER_DOWN, ldap.INVALID_DN_SYNTAX) as err:
        logger.warn("%s", err)
        return None

    return ldap_user

