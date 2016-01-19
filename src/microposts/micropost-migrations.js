var currentSchemaVersion = 0;

exports.currentSchemaVersion = currentSchemaVersion;
exports.handleMigrations = handleMigrations;

function handleMigrations(micropost) {
    if (!micropost.schema_version) {
        micropost.schema_version = 0;
    }

    if (micropost.schema_version < currentSchemaVersion) {
        upgradeSchema(micropost);
    } else if (micropost.schema_version > currentSchemaVersion) {
        downgradeSchema(micropost);
    }
}

/**
 * Handles upgrade shcema migrations.
 * @param  {Object} object representing the outdated micropost
 */
function upgradeSchema(micropost) {
	switch (micropost.schema_version) {
		case 0:
	}

    micropost.schema_version = currentSchemaVersion;
    micropost.save();
}

/** Handles downgrade schema migrations. */
function downgradeSchema(micropost) {
    micropost.schema_version = currentSchemaVersion;
    micropost.save();
}
