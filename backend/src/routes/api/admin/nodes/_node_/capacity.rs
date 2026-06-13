use super::State;
use utoipa_axum::{router::OpenApiRouter, routes};

mod get {
    use serde::{Deserialize, Serialize};
    use shared::{
        ApiError, GetState,
        models::{node::GetNode, user::GetPermissionManager},
        response::{ApiResponse, ApiResponseResult},
    };
    use utoipa::ToSchema;

    #[derive(ToSchema, Serialize, Deserialize)]
    struct ResponseStats {
        servers: i64,
        cpu: i64,
        memory: i64,
        memory_overhead: i64,
        disk: i64,
    }

    #[derive(ToSchema, Serialize)]
    struct ResponseLimits {
        memory: i64,
        disk: i64,
    }

    #[derive(ToSchema, Serialize)]
    struct Response {
        #[schema(inline)]
        limits: ResponseLimits,
        #[schema(inline)]
        allocated: ResponseStats,
    }

    #[utoipa::path(get, path = "/", responses(
        (status = OK, body = inline(Response)),
        (status = NOT_FOUND, body = ApiError),
    ), params(
        (
            "node" = uuid::Uuid,
            description = "The node ID",
            example = "123e4567-e89b-12d3-a456-426614174000",
        ),
    ))]
    pub async fn route(
        state: GetState,
        permissions: GetPermissionManager,
        node: GetNode,
    ) -> ApiResponseResult {
        permissions.has_admin_permission("nodes.read")?;

        let allocated = sqlx::query_as_unchecked!(
            ResponseStats,
            "SELECT
                COUNT(*) as servers,
                COALESCE(SUM(cpu), 0)::int8 as cpu,
                COALESCE(SUM(memory), 0)::int8 as memory,
                COALESCE(SUM(memory_overhead), 0)::int8 as memory_overhead,
                COALESCE(SUM(disk), 0)::int8 as disk
            FROM servers
            WHERE servers.node_uuid = $1",
            node.uuid
        )
        .fetch_one(state.database.read())
        .await?;

        ApiResponse::new_serialized(Response {
            limits: ResponseLimits {
                memory: node.memory,
                disk: node.disk,
            },
            allocated,
        })
        .ok()
    }
}

pub fn router(state: &State) -> OpenApiRouter<State> {
    OpenApiRouter::new()
        .routes(routes!(get::route))
        .with_state(state.clone())
}
