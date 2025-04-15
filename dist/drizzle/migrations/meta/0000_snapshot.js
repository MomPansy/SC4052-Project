var id = "877f57d7-679e-4020-a2fd-329994cd1edc";
var prevId = "00000000-0000-0000-0000-000000000000";
var version = "7";
var dialect = "postgresql";
var tables = {
  "public.users": {
    name: "users",
    schema: "",
    columns: {
      id: {
        name: "id",
        type: "uuid",
        primaryKey: true,
        notNull: true
      },
      auth_user_id: {
        name: "auth_user_id",
        type: "uuid",
        primaryKey: false,
        notNull: true
      },
      workspace_id: {
        name: "workspace_id",
        type: "text",
        primaryKey: false,
        notNull: true
      },
      created_at: {
        name: "created_at",
        type: "timestamp (3) with time zone",
        primaryKey: false,
        notNull: true,
        default: "now()"
      },
      updated_at: {
        name: "updated_at",
        type: "timestamp (3) with time zone",
        primaryKey: false,
        notNull: true,
        default: "now()"
      },
      archived_at: {
        name: "archived_at",
        type: "timestamp (3) with time zone",
        primaryKey: false,
        notNull: false
      },
      name: {
        name: "name",
        type: "text",
        primaryKey: false,
        notNull: false
      },
      email: {
        name: "email",
        type: "text",
        primaryKey: false,
        notNull: false
      },
      phone: {
        name: "phone",
        type: "text",
        primaryKey: false,
        notNull: false
      },
      avatar_url: {
        name: "avatar_url",
        type: "text",
        primaryKey: false,
        notNull: false
      }
    },
    indexes: {},
    foreignKeys: {},
    compositePrimaryKeys: {},
    uniqueConstraints: {},
    policies: {},
    checkConstraints: {},
    isRLSEnabled: false
  }
};
var enums = {};
var schemas = {};
var sequences = {};
var roles = {};
var policies = {};
var views = {};
var _meta = {
  columns: {},
  schemas: {},
  tables: {}
};
var snapshot_default = {
  id,
  prevId,
  version,
  dialect,
  tables,
  enums,
  schemas,
  sequences,
  roles,
  policies,
  views,
  _meta
};
export {
  _meta,
  snapshot_default as default,
  dialect,
  enums,
  id,
  policies,
  prevId,
  roles,
  schemas,
  sequences,
  tables,
  version,
  views
};
