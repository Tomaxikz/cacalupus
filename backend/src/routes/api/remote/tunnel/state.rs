use super::State;
use utoipa_axum::{router::OpenApiRouter, routes};

mod get {
    use axum::http::StatusCode;
    use shared::{
        ApiError, GetState,
        models::{node::GetNode, node_tunnel::NodeTunnel},
        response::{ApiResponse, ApiResponseResult},
    };

    #[utoipa::path(get, path = "/", responses(
        (status = OK, body = serde_json::Value),
        (status = NOT_FOUND, body = ApiError),
    ))]
    pub async fn route(state: GetState, node: GetNode) -> ApiResponseResult {
        if NodeTunnel::by_node_uuid(&state.database, node.uuid)
            .await?
            .is_none()
        {
            return ApiResponse::error("the tunnel network is not enabled on this node")
                .with_status(StatusCode::NOT_FOUND)
                .ok();
        }

        ApiResponse::new_serialized(shared::tunnel::snapshot(&state.database).await?).ok()
    }
}

pub fn router(state: &State) -> OpenApiRouter<State> {
    OpenApiRouter::new()
        .routes(routes!(get::route))
        .with_state(state.clone())
}
