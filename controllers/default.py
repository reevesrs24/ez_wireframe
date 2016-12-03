# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

# -------------------------------------------------------------------------
# This is a sample controller
# - index is the default action of any application
# - user is required for authentication and authorization
# - download is for downloading files uploaded in the db (does streaming)
# -------------------------------------------------------------------------


def index():
    return dict(title=T('EZ Wireframe'))

def login():
    auth.settings.login_next = URL('default', 'design')
    return dict(title=T('Login'), form=auth())

def register():
    auth.settings.register_next = URL('default', 'design')

    if (auth.user):
        redirect(URL('default', 'design'))

    return dict(title=T('Register'), form=auth.register())

def logout():
    auth.logout()

@auth.requires_login('login')
def design():
    return dict(title=T('Design'))

def appadmin():
	return dict(title=T('Design'))




