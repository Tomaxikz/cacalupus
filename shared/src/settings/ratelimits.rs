use super::{
    ExtensionSettings, SettingsDeserializeExt, SettingsDeserializer, SettingsSerializeExt,
    SettingsSerializer,
};
use garde::Validate;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Clone, Copy, Validate, ToSchema, Serialize, Deserialize)]
pub struct RatelimitConfiguration {
    #[garde(range(min = 1))]
    pub hits: u64,
    #[garde(range(min = 1))]
    pub window_seconds: u64,
}

#[derive(Clone, ToSchema, Serialize, Deserialize)]
pub struct AppSettingsRatelimits {
    pub client: RatelimitConfiguration,

    pub client_servers_backups_create: RatelimitConfiguration,
    pub client_servers_files_pull: RatelimitConfiguration,
    pub client_servers_files_pull_query: RatelimitConfiguration,
}

#[async_trait::async_trait]
impl SettingsSerializeExt for AppSettingsRatelimits {
    async fn serialize(
        &self,
        serializer: SettingsSerializer,
    ) -> Result<SettingsSerializer, anyhow::Error> {
        Ok(serializer
            .write_serde_setting("client", &self.client)?
            .write_serde_setting(
                "client_servers_backups_create",
                &self.client_servers_backups_create,
            )?
            .write_serde_setting("client_servers_files_pull", &self.client_servers_files_pull)?
            .write_serde_setting(
                "client_servers_files_pull_query",
                &self.client_servers_files_pull_query,
            )?)
    }
}

pub struct AppSettingsRatelimitsDeserializer;

#[async_trait::async_trait]
impl SettingsDeserializeExt for AppSettingsRatelimitsDeserializer {
    async fn deserialize_boxed(
        &self,
        deserializer: SettingsDeserializer<'_>,
    ) -> Result<ExtensionSettings, anyhow::Error> {
        Ok(Box::new(AppSettingsRatelimits {
            client: deserializer
                .read_serde_setting("client")
                .unwrap_or(RatelimitConfiguration {
                    hits: 360,
                    window_seconds: 60,
                }),
            client_servers_backups_create: deserializer
                .read_serde_setting("client_servers_backups_create")
                .unwrap_or(RatelimitConfiguration {
                    hits: 4,
                    window_seconds: 300,
                }),
            client_servers_files_pull: deserializer
                .read_serde_setting("client_servers_files_pull")
                .unwrap_or(RatelimitConfiguration {
                    hits: 5,
                    window_seconds: 60,
                }),
            client_servers_files_pull_query: deserializer
                .read_serde_setting("client_servers_files_pull_query")
                .unwrap_or(RatelimitConfiguration {
                    hits: 10,
                    window_seconds: 60,
                }),
        }))
    }
}
