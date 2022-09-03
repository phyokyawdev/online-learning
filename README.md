# online-learning

Online learning platform with express framework.
Request query attributes are optional.

## V1 Routes

### Tags

Routes to manage tags.

#### "/v1/tags"

##### POST

cookie - auth, teacher role
request - body[name]
response - 201, 401, 403, 409

##### GET

request - query[offset, limit, search]
response - 200

#### "/v1/tags/:id"

##### GET

response - 200, 404

##### DELETE

cookie - auth, admin role
response - 204, 404

### Courses

Routes to manage courses.

#### "/v1/courses"

##### POST

cookie - auth, teacher role
request - body[title, content, tags]
response - 201, 401, 403, 400

##### GET

request - query[offset, limit, tags, teacher, search]
response - 200

#### "/v1/courses/:id"

##### GET

response - 200, 404

##### PUT

cookie - auth, course owner
request - body[title, content, tags]
response - 200, 404, 401, 403, 400

##### DELETE

cookie - auth, course owner
response - 204, 404, 401, 403
