
import requests


def get_wireframe_images():
	
    wireframes = db(db.wireframes.platform == "mobile").select()
    if wireframes is None:
        return 'None'
    else:
		return response.json(dict(wireframes=wireframes))