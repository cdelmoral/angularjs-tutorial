var Micropost = require('../microposts/micropost-model');
var crypto = require('crypto');

var currentSchemaVersion = 4;

exports.currentSchemaVersion = currentSchemaVersion;
exports.handleMigrations = handleMigrations;

function handleMigrations(next) {
  var user = this;

  if (!user.schema_version) {
    user.schema_version = 0;
  }

  if (user.schema_version < currentSchemaVersion) {
    upgradeSchema(user);
  } else if (user.schema_version > currentSchemaVersion) {
    downgradeSchema(user);
  }

  user.save(next);
}

/**
 * Handles upgrade shcema migrations.
 * @param {Object} object representing the outdated user
 */
function upgradeSchema(user) {
  switch (user.schema_version) {
    case 0:
      user.admin = false;
    case 1:
      user.activated = true;
      user.activated_at = new Date(0);
    case 2:
      Micropost.getMicropostsCountForUser(user._id).then(function(count) {
        user.microposts_count = count;
      });
    case 3:
      var gravatarId = crypto.createHash('md5').update(user.email).digest("hex");
      user.gravatar_id = gravatarId;
  }

  user.schema_version = currentSchemaVersion;
}

/** Handles downgrade schema migrations */
function downgradeSchema(user) {
  // user.schema_version = currentSchemaVersion;
  // user.save();
}
