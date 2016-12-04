
import requests
import json

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

def get_wireframe_by_name():

    wireframes = db(db.wireframes.name_readable == request.vars.wireframe_name).select()

    if wireframes is None:
        return 'None'
    else:
        return response.json(dict(wireframes=wireframes))

def save_tree_data():

    db.saved_data.update_or_insert(db.saved_data.id==auth.user.id, id=auth.user.id, username=auth.user.email,
                                             tree_data=json.dumps(request.vars.tree_data))
    return response.json(dict(success="true"))

def get_user_tree_data():

    tree_data = db.saved_data(auth.user.id)

    if tree_data is None:
        return response.json(dict(tree_data='None'))
    else:
        return response.json(dict(tree_data=json.loads(tree_data['tree_data'])))