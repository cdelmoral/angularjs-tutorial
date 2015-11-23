var currentSchemaVersion = 1;

exports.currentSchemaVersion = currentSchemaVersion;
exports.upgradeSchema = upgradeSchema;
exports.downgradeSchema = downgradeSchema;

/** Handles upgrade schema migrations */
function upgradeSchema(user) {
	switch (user.schema_version) {
		case 0:
			user.admin = false;
	}

    user.schema_version = currentSchemaVersion;
    user.save();
}

/** Handles downgrade schema migrations */
function downgradeSchema(user) {

}
