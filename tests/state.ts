// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const global: { [key: string]: unknown };

type TestState = {
  readonly content: string;
};

describe(`restoreOrInitializeState`, () => {
  describe(`when no state was previously saved`, () => {
    describe(`after calling`, () => {
      let localStorageGetItem: jasmine.Spy;
      let localStorageRemoveItem: jasmine.Spy;
      let localStorageSetItem: jasmine.Spy;
      let addEventListener: jasmine.Spy;
      let stateManager: StateManager<TestState>;

      beforeAll(() => {
        localStorageGetItem = jasmine
          .createSpy(`localStorageGetItem`)
          .and.returnValue(null);
        localStorageRemoveItem = jasmine.createSpy(`localStorageRemoveItem`);
        localStorageSetItem = jasmine.createSpy(`localStorageSetItem`);

        global[`localStorage`] = {
          getItem: localStorageGetItem,
          removeItem: localStorageRemoveItem,
          setItem: localStorageSetItem,
        };

        addEventListener = jasmine.createSpy(`addEventListener`);

        global[`addEventListener`] = addEventListener;

        stateManager = new StateManager(
          `Test Local Storage Key`,
          `Test Version`,
          { content: `Test Initial State` }
        );
      });

      it(`gets one item from local storage`, () => {
        expect(localStorageGetItem).toHaveBeenCalledTimes(1);
      });

      it(`gets the specified item from local storage`, () => {
        expect(localStorageGetItem).toHaveBeenCalledWith(
          `Test Local Storage Key`
        );
      });

      it(`does not remove any items from local storage`, () => {
        expect(localStorageRemoveItem).not.toHaveBeenCalled();
      });

      it(`does not set any items in local storage`, () => {
        expect(localStorageSetItem).not.toHaveBeenCalled();
      });

      it(`adds one event listener`, () => {
        expect(addEventListener).toHaveBeenCalledTimes(1);
      });

      it(`adds one unload event listener`, () => {
        expect(addEventListener).toHaveBeenCalledWith(
          `unload`,
          jasmine.any(Function)
        );
      });

      it(`exposes the initial state`, () => {
        expect(stateManager.state).toEqual({ content: `Test Initial State` });
      });
    });

    describe(`on unload`, () => {
      let localStorageGetItem: jasmine.Spy;
      let localStorageRemoveItem: jasmine.Spy;
      let localStorageSetItem: jasmine.Spy;
      let addEventListener: jasmine.Spy;

      beforeAll(() => {
        localStorageGetItem = jasmine
          .createSpy(`localStorageGetItem`)
          .and.returnValue(null);
        localStorageRemoveItem = jasmine.createSpy(`localStorageRemoveItem`);
        localStorageSetItem = jasmine.createSpy(`localStorageSetItem`);

        global[`localStorage`] = {
          getItem: localStorageGetItem,
          removeItem: localStorageRemoveItem,
          setItem: localStorageSetItem,
        };

        addEventListener = jasmine.createSpy(`addEventListener`);

        global[`addEventListener`] = addEventListener;

        new StateManager(`Test Local Storage Key`, `Test Version`, {
          content: `Test Initial State`,
        });

        addEventListener.calls.argsFor(0)[1]();
      });

      it(`does not get any further items from local storage`, () => {
        expect(localStorageGetItem).toHaveBeenCalledTimes(1);
      });

      it(`does not remove any items from local storage`, () => {
        expect(localStorageRemoveItem).not.toHaveBeenCalled();
      });

      it(`sets one item in local storage`, () => {
        expect(localStorageSetItem).toHaveBeenCalledTimes(1);
      });

      it(`sets the expected item in local storage`, () => {
        expect(localStorageSetItem).toHaveBeenCalledWith(
          `Test Local Storage Key`,
          jasmine.any(String)
        );
      });

      it(`does not add any further event listeners`, () => {
        expect(addEventListener).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe(`when invalid state was previously saved`, () => {
    describe(`after calling`, () => {
      let localStorageGetItem: jasmine.Spy;
      let localStorageRemoveItem: jasmine.Spy;
      let localStorageSetItem: jasmine.Spy;
      let addEventListener: jasmine.Spy;
      let stateManager: StateManager<TestState>;

      beforeAll(() => {
        const previousLocalStorageGetItem = jasmine
          .createSpy(`localStorageGetItem`)
          .and.returnValue(null);
        const previousLocalStorageSetItem =
          jasmine.createSpy(`localStorageSetItem`);

        global[`localStorage`] = {
          getItem: previousLocalStorageGetItem,
          setItem: previousLocalStorageSetItem,
        };

        const previousAddEventListener = jasmine.createSpy(`addEventListener`);

        global[`addEventListener`] = previousAddEventListener;

        const previousStateManager = new StateManager(
          `Test Local Storage Key`,
          `Test Version`,
          { content: `Test First Initial State` }
        );

        previousStateManager.state = { content: `Test Invalid State` };

        previousAddEventListener.calls.argsFor(0)[1]();

        localStorageGetItem = jasmine
          .createSpy(`localStorageGetItem`)
          .and.returnValue(previousLocalStorageSetItem.calls.argsFor(0)[1]);
        localStorageRemoveItem = jasmine.createSpy(`localStorageRemoveItem`);
        localStorageSetItem = jasmine.createSpy(`localStorageSetItem`);

        global[`localStorage`] = {
          getItem: localStorageGetItem,
          removeItem: localStorageRemoveItem,
          setItem: localStorageSetItem,
        };

        addEventListener = jasmine.createSpy(`addEventListener`);

        global[`addEventListener`] = addEventListener;

        stateManager = new StateManager(
          `Test Local Storage Key`,
          `Test Other Version`,
          { content: `Test Second Initial State` }
        );
      });

      it(`gets one item from local storage`, () => {
        expect(localStorageGetItem).toHaveBeenCalledTimes(1);
      });

      it(`gets the specified item from local storage`, () => {
        expect(localStorageGetItem).toHaveBeenCalledWith(
          `Test Local Storage Key`
        );
      });

      it(`removes one item from local storage`, () => {
        expect(localStorageRemoveItem).toHaveBeenCalledTimes(1);
      });

      it(`removes the expected item from local storage`, () => {
        expect(localStorageRemoveItem).toHaveBeenCalledWith(
          `Test Local Storage Key`
        );
      });

      it(`does not set any items in local storage`, () => {
        expect(localStorageSetItem).not.toHaveBeenCalled();
      });

      it(`adds one event listener`, () => {
        expect(addEventListener).toHaveBeenCalledTimes(1);
      });

      it(`adds one unload event listener`, () => {
        expect(addEventListener).toHaveBeenCalledWith(
          `unload`,
          jasmine.any(Function)
        );
      });

      it(`exposes the initial state`, () => {
        expect(stateManager.state).toEqual({
          content: `Test Second Initial State`,
        });
      });
    });

    describe(`on unload`, () => {
      let localStorageGetItem: jasmine.Spy;
      let localStorageRemoveItem: jasmine.Spy;
      let localStorageSetItem: jasmine.Spy;
      let addEventListener: jasmine.Spy;
      let stateManager: StateManager<TestState>;

      beforeAll(() => {
        const previousLocalStorageGetItem = jasmine
          .createSpy(`localStorageGetItem`)
          .and.returnValue(null);
        const previousLocalStorageSetItem =
          jasmine.createSpy(`localStorageSetItem`);

        global[`localStorage`] = {
          getItem: previousLocalStorageGetItem,
          setItem: previousLocalStorageSetItem,
        };

        const previousAddEventListener = jasmine.createSpy(`addEventListener`);

        global[`addEventListener`] = previousAddEventListener;

        const previousStateManager = new StateManager(
          `Test Local Storage Key`,
          `Test Version`,
          { content: `Test First Initial State` }
        );

        previousStateManager.state = { content: `Test Invalid State` };

        previousAddEventListener.calls.argsFor(0)[1]();

        localStorageGetItem = jasmine
          .createSpy(`localStorageGetItem`)
          .and.returnValue(previousLocalStorageSetItem.calls.argsFor(0)[1]);
        localStorageRemoveItem = jasmine.createSpy(`localStorageRemoveItem`);
        localStorageSetItem = jasmine.createSpy(`localStorageSetItem`);

        global[`localStorage`] = {
          getItem: localStorageGetItem,
          removeItem: localStorageRemoveItem,
          setItem: localStorageSetItem,
        };

        addEventListener = jasmine.createSpy(`addEventListener`);

        global[`addEventListener`] = addEventListener;

        stateManager = new StateManager(
          `Test Local Storage Key`,
          `Test Other Version`,
          { content: `Test Second Initial State` }
        );

        stateManager.state = { content: `Test Valid State` };

        addEventListener.calls.argsFor(0)[1]();
      });

      it(`does not get any further items from local storage`, () => {
        expect(localStorageGetItem).toHaveBeenCalledTimes(1);
      });

      it(`does not remove any further items from local storage`, () => {
        expect(localStorageRemoveItem).toHaveBeenCalledTimes(1);
      });

      it(`sets one item in local storage`, () => {
        expect(localStorageSetItem).toHaveBeenCalledTimes(1);
      });

      it(`sets the expected item in local storage`, () => {
        expect(localStorageSetItem).toHaveBeenCalledWith(
          `Test Local Storage Key`,
          jasmine.any(String)
        );
      });

      it(`adds one event listener`, () => {
        expect(addEventListener).toHaveBeenCalledTimes(1);
      });

      it(`does not add any further event listeners`, () => {
        expect(addEventListener).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe(`when valid state was previously saved`, () => {
    describe(`after calling`, () => {
      let localStorageGetItem: jasmine.Spy;
      let localStorageRemoveItem: jasmine.Spy;
      let localStorageSetItem: jasmine.Spy;
      let addEventListener: jasmine.Spy;
      let stateManager: StateManager<TestState>;

      beforeAll(() => {
        const previousLocalStorageGetItem = jasmine
          .createSpy(`localStorageGetItem`)
          .and.returnValue(null);
        const previousLocalStorageSetItem =
          jasmine.createSpy(`localStorageSetItem`);

        global[`localStorage`] = {
          getItem: previousLocalStorageGetItem,
          setItem: previousLocalStorageSetItem,
        };

        const previousAddEventListener = jasmine.createSpy(`addEventListener`);

        global[`addEventListener`] = previousAddEventListener;

        const previousStateManager = new StateManager(
          `Test Local Storage Key`,
          `Test Version`,
          { content: `Test First Initial State` }
        );

        previousStateManager.state = { content: `Test Valid State` };

        previousAddEventListener.calls.argsFor(0)[1]();

        localStorageGetItem = jasmine
          .createSpy(`localStorageGetItem`)
          .and.returnValue(previousLocalStorageSetItem.calls.argsFor(0)[1]);
        localStorageRemoveItem = jasmine.createSpy(`localStorageRemoveItem`);
        localStorageSetItem = jasmine.createSpy(`localStorageSetItem`);

        global[`localStorage`] = {
          getItem: localStorageGetItem,
          removeItem: localStorageRemoveItem,
          setItem: localStorageSetItem,
        };

        addEventListener = jasmine.createSpy(`addEventListener`);

        global[`addEventListener`] = addEventListener;

        stateManager = new StateManager(
          `Test Local Storage Key`,
          `Test Version`,
          { content: `Test Second Initial State` }
        );
      });

      it(`gets one item from local storage`, () => {
        expect(localStorageGetItem).toHaveBeenCalledTimes(1);
      });

      it(`gets the specified item from local storage`, () => {
        expect(localStorageGetItem).toHaveBeenCalledWith(
          `Test Local Storage Key`
        );
      });

      it(`removes one item from local storage`, () => {
        expect(localStorageRemoveItem).toHaveBeenCalledTimes(1);
      });

      it(`removes the expected item from local storage`, () => {
        expect(localStorageRemoveItem).toHaveBeenCalledWith(
          `Test Local Storage Key`
        );
      });

      it(`does not set any items in local storage`, () => {
        expect(localStorageSetItem).not.toHaveBeenCalled();
      });

      it(`adds one event listener`, () => {
        expect(addEventListener).toHaveBeenCalledTimes(1);
      });

      it(`adds one unload event listener`, () => {
        expect(addEventListener).toHaveBeenCalledWith(
          `unload`,
          jasmine.any(Function)
        );
      });

      it(`exposes the restored state`, () => {
        expect(stateManager.state).toEqual({
          content: `Test Valid State`,
        });
      });
    });

    describe(`on unload`, () => {
      let localStorageGetItem: jasmine.Spy;
      let localStorageRemoveItem: jasmine.Spy;
      let localStorageSetItem: jasmine.Spy;
      let addEventListener: jasmine.Spy;
      let stateManager: StateManager<TestState>;

      beforeAll(() => {
        const previousLocalStorageGetItem = jasmine
          .createSpy(`localStorageGetItem`)
          .and.returnValue(null);
        const previousLocalStorageSetItem =
          jasmine.createSpy(`localStorageSetItem`);

        global[`localStorage`] = {
          getItem: previousLocalStorageGetItem,
          setItem: previousLocalStorageSetItem,
        };

        const previousAddEventListener = jasmine.createSpy(`addEventListener`);

        global[`addEventListener`] = previousAddEventListener;

        const previousStateManager = new StateManager(
          `Test Local Storage Key`,
          `Test Version`,
          { content: `Test First Initial State` }
        );

        previousStateManager.state = { content: `Test Valid State` };

        previousAddEventListener.calls.argsFor(0)[1]();

        localStorageGetItem = jasmine
          .createSpy(`localStorageGetItem`)
          .and.returnValue(previousLocalStorageSetItem.calls.argsFor(0)[1]);
        localStorageRemoveItem = jasmine.createSpy(`localStorageRemoveItem`);
        localStorageSetItem = jasmine.createSpy(`localStorageSetItem`);

        global[`localStorage`] = {
          getItem: localStorageGetItem,
          removeItem: localStorageRemoveItem,
          setItem: localStorageSetItem,
        };

        addEventListener = jasmine.createSpy(`addEventListener`);

        global[`addEventListener`] = addEventListener;

        stateManager = new StateManager(
          `Test Local Storage Key`,
          `Test Version`,
          { content: `Test Second Initial State` }
        );

        stateManager.state = { content: `Test Changed State` };

        addEventListener.calls.argsFor(0)[1]();
      });

      it(`does not get any further items from local storage`, () => {
        expect(localStorageGetItem).toHaveBeenCalledTimes(1);
      });

      it(`does not remove any further items from local storage`, () => {
        expect(localStorageRemoveItem).toHaveBeenCalledTimes(1);
      });

      it(`sets one item in local storage`, () => {
        expect(localStorageSetItem).toHaveBeenCalledTimes(1);
      });

      it(`sets the expected item in local storage`, () => {
        expect(localStorageSetItem).toHaveBeenCalledWith(
          `Test Local Storage Key`,
          jasmine.any(String)
        );
      });

      it(`adds one event listener`, () => {
        expect(addEventListener).toHaveBeenCalledTimes(1);
      });

      it(`does not add any further event listeners`, () => {
        expect(addEventListener).toHaveBeenCalledTimes(1);
      });
    });
  });
});
