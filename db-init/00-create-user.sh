_js_escape() {
	jq --null-input --arg 'str' "$1" '$str'
}

if [ "$MONGO_USER" ] && [ "$MONGO_PASSWORD" ] && [ "$MONGO_INITDB_DATABASE" ]; then
	mongo --quiet "$MONGO_INITDB_DATABASE" <<-EOJS
		db.createUser({
			user: $(_js_escape "$MONGO_USER"),
			pwd: $(_js_escape "$MONGO_PASSWORD"),
			roles: [ { role: "readWrite", db: $(_js_escape "$MONGO_INITDB_DATABASE") } ]
		})
	EOJS
fi