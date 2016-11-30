
import requests


def get_wireframe_images():

    if request.vars.platform == 'web' or request.vars.platform == 'mobile':
        wireframes = db(db.wireframes.platform == request.vars.platform).select()
    else:
        wireframes = db().select(db.wireframes.ALL)

    if wireframes is None:
        return 'None'
    else:
        return response.json(dict(wireframes=wireframes))


def update_wireframe_image():

    name = '\"' + request.vars.search_wireframe + "%" + '\"'
    search = 'SELECT * FROM wireframes WHERE name_readable LIKE ' + name + ';'

    wireframes = db.executesql(search)

    if wireframes is None:
        return 'None'
    else:
        return response.json(dict(wireframes=wireframes))