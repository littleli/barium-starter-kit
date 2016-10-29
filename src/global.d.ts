declare module '*.css' {
  let styles: any;
  export = styles;
}
declare module '*.html' {
  let html: string;
  export = html;
}

declare module 'react-hot-loader' {
  export class AppContainer extends React.Component<void, void> {}
}


declare namespace HotReload {
  interface Module {
    id: string;
    filename: string;
    loaded: boolean;
    parent: any;
    children: any[];
    hot: Hot;
  }

  interface Hot {
    active: boolean;
    data: {};
    /**
     * Accept code updates for the specified dependencies. The callback is called when dependencies were replaced.
     * @param dependencies
     * @param callback
     */
    accept(dependencies: string[], callback: (updatedDependencies: ModuleId[]) => void): void;
    /**
     * Accept code updates for the specified dependencies. The callback is called when dependencies were replaced.
     * @param dependency
     * @param callback
     */
    accept(dependency: string, callback: () => void): void;
    /**
     * Accept code updates for this module without notification of parents.
     * This should only be used if the module doesn’t export anything.
     * The errHandler can be used to handle errors that occur while loading the updated module.
     * @param errHandler
     */
    accept(errHandler?: (err: Error) => void): void;
    /**
     * Do not accept updates for the specified dependencies.
     * If any dependencies is updated, the code update fails with code "decline".
     */
    decline(dependencies: string[]): void;
    /**
     * Do not accept updates for the specified dependencies.
     * If any dependencies is updated, the code update fails with code "decline".
     */
    decline(dependency: string): void;
    /**
     * Flag the current module as not update-able. If updated the update code would fail with code "decline".
     */
    decline(): void;
    /**
     * Add a one time handler, which is executed when the current module code is replaced.
     * Here you should destroy/remove any persistent resource you have claimed/created.
     * If you want to transfer state to the new module, add it to data object.
     * The data will be available at module.hot.data on the new module.
     * @param callback
     */
    dispose<T>(callback: (data: T) => void): void;
    /**
     * Add a one time handler, which is executed when the current module code is replaced.
     * Here you should destroy/remove any persistent resource you have claimed/created.
     * If you want to transfer state to the new module, add it to data object.
     * The data will be available at module.hot.data on the new module.
     * @param callback
     */
    addDisposeHandler<T>(callback: (data: T) => void): void;
    /**
     * Remove a handler.
     * This can useful to add a temporary dispose handler.
     * You could i. e. replace code while in the middle of a multi-step async function.
     * @param callback
     */
    removeDisposeHandler<T>(callback: (data: T) => void): void;
    /**
     * Throws an exceptions if status() is not idle.
     * Check all currently loaded modules for updates and apply updates if found.
     * If no update was found, the callback is called with null.
     * If autoApply is truthy the callback will be called with all modules that were disposed.
     * apply() is automatically called with autoApply as options parameter.
     * If autoApply is not set the callback will be called with all modules that will be disposed on apply().
     * @param autoApply
     * @param callback
     */
    check(autoApply: boolean, callback: (err: Error, outdatedModules: ModuleId[]) => void): void;
    /**
     * Throws an exceptions if status() is not idle.
     * Check all currently loaded modules for updates and apply updates if found.
     * If no update was found, the callback is called with null.
     * The callback will be called with all modules that will be disposed on apply().
     * @param callback
     */
    check(callback: (err: Error, outdatedModules: ModuleId[]) => void): void;
    /**
     * If status() != "ready" it throws an error.
     * Continue the update process.
     * @param options
     * @param callback
     */
    apply(options: AcceptOptions, callback: (err: Error, outdatedModules: ModuleId[]) => void): void;
    /**
     * If status() != "ready" it throws an error.
     * Continue the update process.
     * @param callback
     */
    apply(callback: (err: Error, outdatedModules: ModuleId[]) => void): void;
    /**
     * Return one of idle, check, watch, watch-delay, prepare, ready, dispose, apply, abort or fail.
     */
    status(): string;
    /** Register a callback on status change. */
    status(callback: (status: string) => void): void;
    /** Register a callback on status change. */
    addStatusHandler(callback: (status: string) => void): void;
    /**
     * Remove a registered status change handler.
     * @param callback
     */
    removeStatusHandler(callback: (status: string) => void): void;
  }
}

declare namespace SystemJS {
  interface System {
    /**
     * Loads a module by name taking an optional normalized parent name argument.
     * Promise resolves to the module value.
     */
    import( moduleName: string, normalizedParentName?: string ): Promise<any>;
    import<TModule>( moduleName: string, normalizedParentName?: string ): Promise<TModule>;
  }
}

// declare globals:
declare const System: SystemJS.System;

// extend existing definitions:

// extend Node `module` types
interface NodeModule extends HotReload.Module {}
