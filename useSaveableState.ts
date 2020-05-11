import { useReducer, useCallback } from "react";

type SetState<T> = (newPresent: T) => void;

interface IActions<T> {
  type: ActionTypes;
  newState?: T;
}

interface State<T> {
  state: T;
  canSave: boolean
}

enum ActionTypes {
  SET = "SET",
  SAVE = "SAVE",
}

const initialState = {
  state: null,
  canSave: false,
};

function useSaveableState<T>(initialPresent: T, onSave?: (newState: T) => void): [T, SetState<T>, {saveState: () => void, canSave: boolean}] {

  const reducer = useCallback((state: State<T>, action: IActions<T>):State<T> => {
    const { state: prevState } = state;
    const { newState } = action;

    switch (action.type) {
      case ActionTypes.SET: {

        if (newState === prevState) {
          return state;
        }

        return {
          state: newState!,
          canSave: true,
        };
      }

      case ActionTypes.SAVE: {

        if (onSave) {
          onSave(state.state);
        }

        return {
          state: state.state,
          canSave: false,
        };
      }

      default:
        return state;
    }
  }, []);

  const [stateObj, dispatch] = useReducer<(state: State<T>, action: IActions<T>) => State<T>>(reducer, {
    ...initialState,
    state: initialPresent,
  });

  const setState = useCallback((newState) => dispatch({ type: ActionTypes.SET, newState }), []);
  const saveState = useCallback(() => dispatch({ type: ActionTypes.SAVE }), []);
  const canSave = stateObj.canSave;

  return [stateObj.state, setState, {saveState, canSave}];
}

export default useSaveableState;