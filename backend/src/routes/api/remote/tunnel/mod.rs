use super::State;
use utoipa_axum::router::OpenApiRouter;

mod cert;
mod connect_token;
mod state;

pub fn router(state: &State) -> OpenApiRouter<State> {
    OpenApiRouter::new()
        .nest("/state", state::router(state))
        .nest("/cert", cert::router(state))
        .nest("/connect-token", connect_token::router(state))
        .with_state(state.clone())
}
