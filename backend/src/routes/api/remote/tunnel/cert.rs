use super::State;
use utoipa_axum::{router::OpenApiRouter, routes};

mod post {
    use axum::http::StatusCode;
    use serde::{Deserialize, Serialize};
    use shared::{
        ApiError, GetState,
        models::{node::GetNode, node_tunnel::NodeTunnel},
        response::{ApiResponse, ApiResponseResult},
    };
    use utoipa::ToSchema;

    #[derive(ToSchema, Deserialize)]
    pub struct Payload {
        #[schema(value_type = String)]
        cert_sha256: tundra_common::hash::Hash32,
    }

    #[derive(ToSchema, Serialize)]
    struct Response {}

    #[utoipa::path(post, path = "/", responses(
        (status = OK, body = inline(Response)),
        (status = NOT_FOUND, body = ApiError),
    ), request_body = inline(Payload))]
    pub async fn route(
        state: GetState,
        node: GetNode,
        shared::Payload(data): shared::Payload<Payload>,
    ) -> ApiResponseResult {
        if !NodeTunnel::store_cert(&state.database, node.uuid, Some(data.cert_sha256)).await? {
            return ApiResponse::error("the tunnel network is not enabled on this node")
                .with_status(StatusCode::NOT_FOUND)
                .ok();
        }

        tracing::info!(
            node = %node.uuid,
            fingerprint = %data.cert_sha256,
            "stored the tunnel certificate digest"
        );

        shared::tunnel::poke_nodes(&state.database).await;

        ApiResponse::new_serialized(Response {}).ok()
    }
}

pub fn router(state: &State) -> OpenApiRouter<State> {
    OpenApiRouter::new()
        .routes(routes!(post::route))
        .with_state(state.clone())
}
