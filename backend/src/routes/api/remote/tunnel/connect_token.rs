use super::State;
use utoipa_axum::{router::OpenApiRouter, routes};

mod get {
    use axum::{extract::Query, http::StatusCode};
    use serde::{Deserialize, Serialize};
    use shared::{
        ApiError, GetState,
        models::{node::GetNode, node_tunnel::NodeTunnel},
        response::{ApiResponse, ApiResponseResult},
    };
    use utoipa::ToSchema;

    #[derive(ToSchema, Deserialize)]
    pub struct Params {
        target: uuid::Uuid,
    }

    #[derive(ToSchema, Serialize)]
    struct Response {
        jwt: String,
    }

    #[utoipa::path(get, path = "/", responses(
        (status = OK, body = inline(Response)),
        (status = BAD_REQUEST, body = ApiError),
        (status = NOT_FOUND, body = ApiError),
    ), params(
        (
            "target" = uuid::Uuid, Query,
            description = "The node being dialled",
            example = "123e4567-e89b-12d3-a456-426614174000",
        ),
    ))]
    pub async fn route(
        state: GetState,
        node: GetNode,
        Query(params): Query<Params>,
    ) -> ApiResponseResult {
        let Some(cert_sha256) = NodeTunnel::by_node_uuid(&state.database, node.uuid)
            .await?
            .and_then(|tunnel| tunnel.cert_sha256)
        else {
            tracing::warn!(
                node = %node.uuid,
                target = %params.target,
                "refused a connect token: the node has no certificate on file, so it cannot be dialled by peers until its daemon re-enrolls"
            );

            return ApiResponse::error("this node has no certificate on file")
                .with_status(StatusCode::BAD_REQUEST)
                .ok();
        };

        if NodeTunnel::by_node_uuid(&state.database, params.target)
            .await?
            .is_none()
        {
            tracing::warn!(
                node = %node.uuid,
                target = %params.target,
                "refused a connect token: the target node is not on the tunnel network"
            );

            return ApiResponse::error("no such node on the tunnel network")
                .with_status(StatusCode::NOT_FOUND)
                .ok();
        }

        let signer = shared::tunnel::signer(&state.database).await?;
        let jwt = signer
            .issuer
            .create(&tundra_common::jwt::ConnectClaims::new(
                node.uuid,
                params.target,
                &cert_sha256,
                tundra_common::jwt::unix_now(),
            ))
            .map_err(anyhow::Error::from)?;

        ApiResponse::new_serialized(Response { jwt }).ok()
    }
}

pub fn router(state: &State) -> OpenApiRouter<State> {
    OpenApiRouter::new()
        .routes(routes!(get::route))
        .with_state(state.clone())
}
