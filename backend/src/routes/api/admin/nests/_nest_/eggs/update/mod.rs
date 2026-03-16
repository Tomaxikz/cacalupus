use super::State;
use utoipa_axum::router::OpenApiRouter;

mod repository;

pub fn router(state: &State) -> OpenApiRouter<State> {
    OpenApiRouter::new()
        .nest("/repository", repository::router(state))
        .with_state(state.clone())
}
