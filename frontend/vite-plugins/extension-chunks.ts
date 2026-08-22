import { listExtensionIdentifiers } from './extension-overrides.ts';

/**
 * Gives every extension its own chunk, which is what puts its stylesheet in a dedicated
 * `assets/extension-<identifier>.<hash>.css` instead of merging it into the core one. The
 * frontend disables that stylesheet for extensions the panel reports as disabled, see main.tsx.
 */
export function extensionChunkGroups() {
  return listExtensionIdentifiers().map((identifier) => ({
    name: `extension-${identifier}`,
    // extensions resolve through `frontend/extensions/<id>` or `backend-extensions/<id>/frontend`
    test: new RegExp(`(?:frontend/extensions|backend-extensions)/${identifier}/`),
    priority: 30,
    includeDependenciesRecursively: false,
  }));
}
