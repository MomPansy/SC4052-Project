var id = "ab77bd35-9893-4c9f-839f-ffcd5522d5cc";
var prevId = "00000000-0000-0000-0000-000000000000";
var version = "7";
var dialect = "postgresql";
var tables = {
  "public.chats": {
    name: "chats",
    schema: "",
    columns: {
      id: {
        name: "id",
        type: "uuid",
        primaryKey: true,
        notNull: true,
        default: "gen_random_uuid()"
      },
      user_id: {
        name: "user_id",
        type: "uuid",
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
      title: {
        name: "title",
        type: "text",
        primaryKey: false,
        notNull: false
      },
      lockable: {
        name: "lockable",
        type: "boolean",
        primaryKey: false,
        notNull: true,
        default: false
      },
      locked: {
        name: "locked",
        type: "boolean",
        primaryKey: false,
        notNull: true,
        default: false
      }
    },
    indexes: {},
    foreignKeys: {
      chats_user_id_fk: {
        name: "chats_user_id_fk",
        tableFrom: "chats",
        tableTo: "users",
        columnsFrom: [
          "user_id"
        ],
        columnsTo: [
          "id"
        ],
        onDelete: "cascade",
        onUpdate: "no action"
      }
    },
    compositePrimaryKeys: {},
    uniqueConstraints: {},
    policies: {},
    checkConstraints: {},
    isRLSEnabled: false
  },
  "public.messages": {
    name: "messages",
    schema: "",
    columns: {
      id: {
        name: "id",
        type: "uuid",
        primaryKey: true,
        notNull: true,
        default: "gen_random_uuid()"
      },
      chat_id: {
        name: "chat_id",
        type: "uuid",
        primaryKey: false,
        notNull: true
      },
      user_id: {
        name: "user_id",
        type: "uuid",
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
      position: {
        name: "position",
        type: "integer",
        primaryKey: false,
        notNull: true
      },
      role: {
        name: "role",
        type: "text",
        primaryKey: false,
        notNull: true
      },
      content: {
        name: "content",
        type: "text",
        primaryKey: false,
        notNull: false
      },
      parts: {
        name: "parts",
        type: "jsonb[]",
        primaryKey: false,
        notNull: false
      },
      tool_invocations: {
        name: "tool_invocations",
        type: "jsonb[]",
        primaryKey: false,
        notNull: false
      },
      annotations: {
        name: "annotations",
        type: "jsonb[]",
        primaryKey: false,
        notNull: false
      },
      reaction: {
        name: "reaction",
        type: "text",
        primaryKey: false,
        notNull: false
      }
    },
    indexes: {
      messages_primary_idx: {
        name: "messages_primary_idx",
        columns: [
          {
            expression: "chat_id",
            isExpression: false,
            asc: true,
            nulls: "last"
          },
          {
            expression: "archived_at",
            isExpression: false,
            asc: true,
            nulls: "last"
          },
          {
            expression: "position",
            isExpression: false,
            asc: true,
            nulls: "last"
          }
        ],
        isUnique: false,
        concurrently: false,
        method: "btree",
        with: {}
      }
    },
    foreignKeys: {
      messages_user_id_fk: {
        name: "messages_user_id_fk",
        tableFrom: "messages",
        tableTo: "users",
        columnsFrom: [
          "user_id"
        ],
        columnsTo: [
          "id"
        ],
        onDelete: "cascade",
        onUpdate: "no action"
      },
      messages_chat_id_fk: {
        name: "messages_chat_id_fk",
        tableFrom: "messages",
        tableTo: "chats",
        columnsFrom: [
          "chat_id"
        ],
        columnsTo: [
          "id"
        ],
        onDelete: "cascade",
        onUpdate: "no action"
      }
    },
    compositePrimaryKeys: {},
    uniqueConstraints: {},
    policies: {},
    checkConstraints: {},
    isRLSEnabled: false
  },
  "public.users": {
    name: "users",
    schema: "",
    columns: {
      id: {
        name: "id",
        type: "uuid",
        primaryKey: true,
        notNull: true,
        default: "gen_random_uuid()"
      },
      auth_user_id: {
        name: "auth_user_id",
        type: "uuid",
        primaryKey: false,
        notNull: false
      },
      workspace_id: {
        name: "workspace_id",
        type: "text",
        primaryKey: false,
        notNull: false
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
