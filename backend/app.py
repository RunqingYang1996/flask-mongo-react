import pymongo
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MONGO_URL = "mongodb://localhost:27017/"

@app.route('/DB/upload/blender/geometrynode/<projectname>/<version>/<authorname>', methods=['POST'])
def upload_geometry_node(projectname, version, authorname):
    data = request.json
    if not data:
        return jsonify({"error": "no data"}), 400

    nodes_info = data.get('nodes')
    links_info = data.get('links')
    instruction_info = data.get('instructions') 
    picture_info = data.get('picture') 

    if not nodes_info or not links_info:
        return jsonify({"error": "Incomplete data"}), 400

    client = pymongo.MongoClient(MONGO_URL)
    sanitized_version = version.replace('.', '_')  # no '.' is allowed in the name of any database
    db_name = f"blender_geo_{projectname}_v{sanitized_version}"
    db = client[db_name]
    nodes_collection = db["nodes"]
    links_collection = db["links"]
    general_info_collection = db["general_info"]
    pictures_collection = db["pictures"]

    nodes_collection.delete_many({})
    links_collection.delete_many({})
    general_info_collection.delete_many({})
    pictures_collection.delete_many({})

    nodes_collection.insert_many(nodes_info)
    links_collection.insert_many(links_info)

    general_info = {
        "projectname": projectname,
        "version": version,
        "time_created": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "author": authorname,
        "instructions": instruction_info
    }

    image_info = {
        "picture_name": projectname,
        "data": picture_info,
        "category": "Blender/Geo",
        "visibility": "visible",
        "author": authorname,
        "filetype": "PNG",
        "instructions": instruction_info
    }

    general_info_collection.insert_one(general_info)
    pictures_collection.insert_one(image_info)

    return jsonify({"message": f"Project stored successfully for {authorname}"}), 200


@app.route('/DB/download/blender/geometrynode/<projectname>/<version>/<authorname>', methods=['GET'])
def download_geometry_node(projectname, version, authorname):
    client = pymongo.MongoClient(MONGO_URL)
    sanitized_version = version.replace('.', '_')  # no '.' is allowed in the name of any database
    db_name = f"blender_geo_{projectname}_v{sanitized_version}"
    db = client[db_name]
    
    nodes_collection = db["nodes"]
    links_collection = db["links"]
    general_info_collection=db["general_info"]
    nodes_info = list(nodes_collection.find({}, {'_id': False}))
    links_info = list(links_collection.find({}, {'_id': False}))
    
    general_info = general_info_collection.find_one({}, {'_id': 0, 'instructions': 1})
    instruction_info=general_info['instructions']
    
    if not nodes_info or not links_info:
        return jsonify({"error": "Incomplete data"}), 400
    
    return jsonify({'nodes': nodes_info, 'links': links_info, 'instructions':instruction_info}), 200
######################################################################
@app.route('/DB/list_all_v/blender/geometrynode/<projectname>', methods=['GET'])
def list_all_versions_geometry_node(projectname):
    client = pymongo.MongoClient(MONGO_URL)
    db_names = client.list_database_names()
    versions = []
    for db_name in db_names:
        db = client[db_name]
        general_info_collection = db["general_info"]
        general_info = general_info_collection.find_one({"projectname": projectname}, {'_id': 0, 'version': 1})
        if general_info and 'version' in general_info:
            versions.append(general_info['version'])
    versions.sort(key=lambda s: list(map(int, s.split('.'))))
    return jsonify({"versions": versions}), 200

@app.route('/DB/list_all_v_latest/blender/geometrynode', methods=['GET'])
def list_all_project_latest_geometry_node():
    client = pymongo.MongoClient(MONGO_URL)
    db_names = client.list_database_names()
    project_versions = {}
    for db_name in db_names:
        db = client[db_name]
        general_info_collection = db["general_info"]
        general_info = general_info_collection.find_one({}, {'_id': 0, 'projectname': 1, 'version': 1})
        if general_info and 'projectname' in general_info and 'version' in general_info:
            projectname = general_info['projectname']
            version = general_info['version']
            if projectname not in project_versions:
                project_versions[projectname] = []
            project_versions[projectname].append(version)
    latest_versions = {project: max(versions, key=lambda s: list(map(int, s.split('.')))) for project, versions in project_versions.items()}
    return jsonify({"latest_versions": latest_versions}), 200

@app.route('/DB/list_all_authors/blender/geometrynode', methods=['GET'])
def list_all_authors_geometry_node():
    client = pymongo.MongoClient(MONGO_URL)
    db_names = client.list_database_names()
    authors = set()
    for db_name in db_names:
        db = client[db_name]
        general_info_collection = db["general_info"]
        general_info = general_info_collection.find_one({}, {'_id': 0, 'author': 1})
        if general_info and 'author' in general_info:
            authors.add(general_info['author'])
    return jsonify({"authors": list(authors)}), 200

@app.route('/DB/list_all_projects_by_author/blender/geometrynode/<authorname>', methods=['GET'])
def list_all_projects_by_author(authorname):
    client = pymongo.MongoClient(MONGO_URL)
    db_names = client.list_database_names()
    projects = set()
    for db_name in db_names:
        db = client[db_name]
        general_info_collection = db["general_info"]
        general_info = general_info_collection.find_one({"author": authorname}, {'_id': 0, 'projectname': 1})
        if general_info and 'projectname' in general_info:
            projects.add(general_info['projectname'])
    return jsonify({"projects": list(projects)}), 200

@app.route('/api/images', methods=['GET'])
def get_images():
    client = pymongo.MongoClient(MONGO_URL)
    db_names = client.list_database_names()
    all_images = []
    try:
        for db_name in db_names:
            db = client[db_name]
            if 'pictures' in db.list_collection_names():
                pictures_collection = db.pictures
                pictures = pictures_collection.find({"data": {"$ne": None}})
                for picture in pictures:
                    all_images.append({
                        'img': picture['data'],
                        'title': picture.get('picture_name'),
                        'author': picture.get('author'),
                        'databasename': db_name  # Include database name
                    })
    except Exception as e:
        print(f"Error retrieving images: {e}")
    
    return jsonify(all_images)

@app.route('/api/delete/database/<dbname>', methods=['DELETE'])
def delete_database(dbname):
    try:
        client = pymongo.MongoClient(MONGO_URL)
        client.drop_database(dbname)
        return jsonify({"message": f"Database {dbname} deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




#%%%%%%%%%%%%%%%%%%%%%Testneeddelete#####################
users = {
    "therajanmaurya": {
        "name": "Rajan Maurya",
        "username": "therajanmaurya",
        "office": "Head Office",
        "status": "Authenticated",
        "language": "English",
        "email": "rajanmaurya154@gmail.com",
        "role": "Super user",
        "roleDescription": "This role provides all application permissions."
    }
    # 你可以添加更多的用户数据
}

@app.route('/api/getuserprofile/<username>', methods=['GET'])
def get_user_profile(username):
    user = users.get(username)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404
#####################################################################
if __name__ == "__main__":
    app.run(debug=True)

