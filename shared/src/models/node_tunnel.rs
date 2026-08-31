use crate::{
    models::{InsertQueryBuilder, UpdateQueryBuilder},
    prelude::*,
};
use garde::Validate;
use serde::{Deserialize, Serialize};
use sqlx::{Row, postgres::PgRow};
use std::{
    collections::BTreeMap,
    sync::{Arc, LazyLock},
};
use tundra_common::hash::Hash32;
use utoipa::ToSchema;

#[derive(Serialize, Deserialize)]
pub struct NodeTunnel {
    pub node: Fetchable<super::node::Node>,

    pub host: compact_str::CompactString,
    pub port: u16,

    pub cert_sha256: Option<Hash32>,

    pub created: chrono::NaiveDateTime,

    extension_data: super::ModelExtensionData,
}

impl BaseModel for NodeTunnel {
    const NAME: &'static str = "node_tunnel";

    fn get_extension_list() -> &'static super::ModelExtensionList {
        static EXTENSIONS: LazyLock<super::ModelExtensionList> =
            LazyLock::new(|| parking_lot::RwLock::new(Vec::new()));

        &EXTENSIONS
    }

    fn get_extension_data(&self) -> &super::ModelExtensionData {
        &self.extension_data
    }

    #[inline]
    fn base_columns(prefix: Option<&str>) -> BTreeMap<&'static str, compact_str::CompactString> {
        let prefix = prefix.unwrap_or_default();

        BTreeMap::from([
            (
                "node_tunnels.node_uuid",
                compact_str::format_compact!("{prefix}node_uuid"),
            ),
            (
                "node_tunnels.host",
                compact_str::format_compact!("{prefix}host"),
            ),
            (
                "node_tunnels.port",
                compact_str::format_compact!("{prefix}port"),
            ),
            (
                "node_tunnels.cert_sha256",
                compact_str::format_compact!("{prefix}cert_sha256"),
            ),
            (
                "node_tunnels.created",
                compact_str::format_compact!("{prefix}created"),
            ),
        ])
    }

    #[inline]
    fn map(prefix: Option<&str>, row: &PgRow) -> Result<Self, crate::database::DatabaseError> {
        let prefix = prefix.unwrap_or_default();

        Ok(Self {
            node: super::node::Node::get_fetchable(
                row.try_get(compact_str::format_compact!("{prefix}node_uuid").as_str())?,
            ),
            host: row.try_get(compact_str::format_compact!("{prefix}host").as_str())?,
            port: row.try_get::<i32, _>(compact_str::format_compact!("{prefix}port").as_str())?
                as u16,
            cert_sha256: row
                .try_get::<Option<Vec<u8>>, _>(
                    compact_str::format_compact!("{prefix}cert_sha256").as_str(),
                )?
                .and_then(|bytes| <[u8; 32]>::try_from(bytes.as_slice()).ok())
                .map(Hash32),
            created: row.try_get(compact_str::format_compact!("{prefix}created").as_str())?,
            extension_data: Self::map_extensions(prefix, row)?,
        })
    }
}

impl NodeTunnel {
    pub async fn by_node_uuid(
        database: &crate::database::Database,
        node_uuid: uuid::Uuid,
    ) -> Result<Option<Self>, crate::database::DatabaseError> {
        let row = sqlx::query(sqlx::AssertSqlSafe(format!(
            r#"
            SELECT {}
            FROM node_tunnels
            WHERE node_tunnels.node_uuid = $1
            "#,
            Self::columns_sql(None)
        )))
        .bind(node_uuid)
        .fetch_optional(database.read())
        .await?;

        row.try_map(|row| Self::map(None, &row))
    }

    pub async fn store_cert(
        database: &crate::database::Database,
        node_uuid: uuid::Uuid,
        cert_sha256: Option<Hash32>,
    ) -> Result<bool, crate::database::DatabaseError> {
        let mut transaction = database.write().begin().await?;

        let affected = sqlx::query(
            r#"
            UPDATE node_tunnels
            SET cert_sha256 = $2
            WHERE node_tunnels.node_uuid = $1
            "#,
        )
        .bind(node_uuid)
        .bind(cert_sha256.map(|hash| hash.0.to_vec()))
        .execute(&mut *transaction)
        .await?
        .rows_affected();

        if affected == 0 {
            return Ok(false);
        }

        crate::tunnel::bump_epoch(&mut *transaction).await?;
        transaction.commit().await?;

        Ok(true)
    }
}

#[async_trait::async_trait]
impl IntoAdminApiObject for NodeTunnel {
    type AdminApiObject = AdminApiNodeTunnel;
    type ExtraArgs<'a> = ();

    async fn into_admin_api_object<'a>(
        self,
        state: &crate::State,
        _args: Self::ExtraArgs<'a>,
    ) -> Result<Self::AdminApiObject, crate::database::DatabaseError> {
        let api_object = AdminApiNodeTunnel::init_hooks(&self, state).await?;

        let api_object = finish_extendible!(
            AdminApiNodeTunnel {
                host: self.host,
                port: self.port,
                cert_sha256: self.cert_sha256.map(|hash| hash.to_hex().into()),
                created: self.created.and_utc(),
            },
            api_object,
            state
        )?;

        Ok(api_object)
    }
}

#[schema_extension_derive::extendible]
#[init_args(NodeTunnel, crate::State)]
#[hook_args(crate::State)]
#[derive(ToSchema, Serialize)]
#[schema(title = "AdminNodeTunnel")]
pub struct AdminApiNodeTunnel {
    pub host: compact_str::CompactString,
    pub port: u16,

    pub cert_sha256: Option<compact_str::CompactString>,

    pub created: chrono::DateTime<chrono::Utc>,
}

#[derive(ToSchema, Deserialize, Validate)]
pub struct CreateNodeTunnelOptions {
    #[garde(skip)]
    pub node_uuid: uuid::Uuid,

    #[garde(length(chars, min = 1, max = 255))]
    #[schema(min_length = 1, max_length = 255)]
    pub host: compact_str::CompactString,
    #[garde(range(min = 1))]
    #[schema(minimum = 1)]
    pub port: u16,
}

#[async_trait::async_trait]
impl CreatableModel for NodeTunnel {
    type CreateOptions<'a> = CreateNodeTunnelOptions;
    type CreateResult = Self;

    fn get_create_handlers() -> &'static LazyLock<CreateListenerList<Self>> {
        static CREATE_LISTENERS: LazyLock<CreateListenerList<NodeTunnel>> =
            LazyLock::new(|| Arc::new(ModelHandlerList::default()));

        &CREATE_LISTENERS
    }

    async fn create_with_transaction(
        state: &crate::State,
        mut options: Self::CreateOptions<'_>,
        transaction: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    ) -> Result<Self, crate::database::DatabaseError> {
        options.validate()?;

        let mut query_builder = InsertQueryBuilder::new("node_tunnels");

        Self::run_create_handlers(&mut options, &mut query_builder, state, transaction).await?;

        query_builder
            .set("node_uuid", options.node_uuid)
            .set("host", &options.host)
            .set("port", options.port as i32);

        let row = query_builder
            .returning(&Self::columns_sql(None))
            .fetch_one(&mut **transaction)
            .await?;
        let mut node_tunnel = Self::map(None, &row)?;

        crate::tunnel::bump_epoch(&mut **transaction).await?;

        Self::run_after_create_handlers(&mut node_tunnel, &options, state, transaction).await?;

        Ok(node_tunnel)
    }
}

#[derive(ToSchema, Serialize, Deserialize, Validate, Default)]
pub struct UpdateNodeTunnelOptions {
    #[garde(length(chars, min = 1, max = 255))]
    #[schema(min_length = 1, max_length = 255)]
    pub host: Option<compact_str::CompactString>,
    #[garde(range(min = 1))]
    #[schema(minimum = 1)]
    pub port: Option<u16>,
}

#[async_trait::async_trait]
impl UpdatableModel for NodeTunnel {
    type UpdateOptions = UpdateNodeTunnelOptions;

    fn get_update_handlers() -> &'static LazyLock<UpdateHandlerList<Self>> {
        static UPDATE_LISTENERS: LazyLock<UpdateHandlerList<NodeTunnel>> =
            LazyLock::new(|| Arc::new(ModelHandlerList::default()));

        &UPDATE_LISTENERS
    }

    async fn update_with_transaction(
        &mut self,
        state: &crate::State,
        mut options: Self::UpdateOptions,
        transaction: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    ) -> Result<(), crate::database::DatabaseError> {
        options.validate()?;

        let mut query_builder = UpdateQueryBuilder::new("node_tunnels");

        self.run_update_handlers(&mut options, &mut query_builder, state, transaction)
            .await?;

        query_builder
            .set("host", options.host.as_ref())
            .set("port", options.port.map(|port| port as i32))
            .where_eq("node_uuid", self.node.uuid);

        query_builder.execute(&mut **transaction).await?;

        crate::tunnel::bump_epoch(&mut **transaction).await?;

        if let Some(host) = options.host {
            self.host = host;
        }
        if let Some(port) = options.port {
            self.port = port;
        }

        self.run_after_update_handlers(state, transaction).await?;

        Ok(())
    }
}

#[async_trait::async_trait]
impl DeletableModel for NodeTunnel {
    type DeleteOptions = ();

    fn get_delete_handlers() -> &'static LazyLock<DeleteHandlerList<Self>> {
        static DELETE_LISTENERS: LazyLock<DeleteHandlerList<NodeTunnel>> =
            LazyLock::new(|| Arc::new(ModelHandlerList::default()));

        &DELETE_LISTENERS
    }

    async fn delete_with_transaction(
        &self,
        state: &crate::State,
        options: Self::DeleteOptions,
        transaction: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    ) -> Result<(), anyhow::Error> {
        self.run_delete_handlers(&options, state, transaction)
            .await?;

        sqlx::query(
            r#"
            DELETE FROM node_tunnels
            WHERE node_tunnels.node_uuid = $1
            "#,
        )
        .bind(self.node.uuid)
        .execute(&mut **transaction)
        .await?;

        crate::tunnel::bump_epoch(&mut **transaction).await?;

        self.run_after_delete_handlers(&options, state, transaction)
            .await?;

        Ok(())
    }
}
