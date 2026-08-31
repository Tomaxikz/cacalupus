use super::State;
use utoipa_axum::{router::OpenApiRouter, routes};

mod post {
    use axum::http::StatusCode;
    use serde::Serialize;
    use shared::{
        ApiError, GetState,
        models::{
            admin_activity::GetAdminActivityLogger, node::GetNode, node_tunnel::NodeTunnel,
            user::GetPermissionManager,
        },
        response::{ApiResponse, ApiResponseResult},
    };
    use utoipa::ToSchema;

    #[derive(ToSchema, Serialize)]
    struct Response {}

    #[utoipa::path(post, path = "/", responses(
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
        activity_logger: GetAdminActivityLogger,
    ) -> ApiResponseResult {
        permissions.has_admin_permission("nodes.tunnel")?;

        if !NodeTunnel::store_cert(&state.database, node.uuid, None).await? {
            return ApiResponse::error("this node is not on the private network")
                .with_status(StatusCode::NOT_FOUND)
                .ok();
        }

        if let Ok(client) = node.api_client(&state.database).await
            && let Err(err) = client.post_tundra_rotate().await
        {
            tracing::warn!(node = %node.uuid, "failed to rotate the node's tunnel token: {:?}", err);
        }

        activity_logger
            .log(
                "node:tunnel.rotate",
                serde_json::json!({
                    "node_uuid": node.uuid,
                }),
            )
            .await;

        shared::tunnel::poke_nodes(&state.database).await;

        ApiResponse::new_serialized(Response {}).ok()
    }
}

pub fn router(state: &State) -> OpenApiRouter<State> {
    OpenApiRouter::new()
        .routes(routes!(post::route))
        .with_state(state.clone())
}
