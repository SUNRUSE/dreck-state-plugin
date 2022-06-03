/**
 * A type which can be serialized as state.
 */
type SerializableState =
  | null
  | boolean
  | number
  | string
  | ReadonlyArray<SerializableState>
  | { readonly [key: string]: SerializableState };

/**
 * Identifies the version of a piece of serialized state.
 */
type StateVersion = null | boolean | number | string;

/**
 * Manages application state, automatically persisting it to localStorage when the page unloads and restoring it on subsequent construction.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class StateManager<T extends SerializableState> {
  /**
   * The current state.  If a value was previously saved and was of the correct version, this is initially the value recovered from localStorage.  Otherwise, it is initially the value given in the constructor.  This will be saved back to localStorage when the page unloads.
   */
  state: T;

  /**
   * @param localStorageKey The localStorage key used to persist the application state.
   * @param version Compared against the value given when saving to localStorage.  If mismatching, the persisted state is discarded and the initial state is taken instead.
   * @param initial The state to use when either no state is persisted or the persisted state is invalid.
   */
  constructor(localStorageKey: string, version: StateVersion, initial: T) {
    let wrapped: readonly [StateVersion, T];

    const json = localStorage.getItem(localStorageKey);

    this.state = initial;
    if (json !== null) {
      localStorage.removeItem(localStorageKey);

      wrapped = JSON.parse(json);

      if (wrapped[0] === version) {
        this.state = wrapped[1];
      }
    }

    addEventListener(`unload`, () => {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify([version, this.state])
      );
    });
  }
}
